/**
 * Represents a test instance.
 */

var Student = require('./student');
var StudentResponse = require('./StudentResponse');
var _ = require('underscore');
var Question = require('./question');
var questionDb = require('./question.db');
var config = require('./config');
require("underscore-query")(_);

var Test = function (studentName, studentAbility) {
  'use strict';
  this.questions = [];
  if (studentName && studentAbility) {
    this.student = new Student(studentName, studentAbility);
  } else {
    this.student = new Student();
  }

  this.studentResponses = [];


  this.findExactDifficulty = function (targetDifficulty) {
    if (this.questions.length < 1) {
      // No questions in list error condition.
      return 0;
    }

//    this.questions = _.reject(this.questions, function (question) {
//      var responseQuestions = _.pluck(this.studentResponses, 'question');
//      if (_.contains(responseQuestions, question)) {
//        console.log(responseQuestions);
//        console.log(_.contains(responseQuestions, question));
//      }
//      return _.contains(responseQuestions, question);
//    }, this);
    //console.log('PRE REJECT', this.questions);
//    this.questions = _.reject(this.questions, function (question) {
//      _.contains
//    }, this);
    //console.log('POST REJECT', this.questions);


    // Make sure it's all sorted first...
    this.questions.sort(function (a,b) {
      return a.difficulty > b.difficulty;
    });

    var upper = this.questions.length - 1;
    var lower = 0;
    while (lower <= upper) {
      var mid = Math.floor((upper + lower) / 2);
      if (this.questions[mid].difficulty < targetDifficulty) {
        lower = mid + 1;
      } else if (this.questions[mid].difficulty > targetDifficulty) {
        upper = mid - 1;
      }
      else {
        return this.questions[mid];
      }
    }
    return -1; // Indicates the item was not found.
  };

  this.findClosestDifficulty = function (targetDifficulty, biasHigh) {
    var searchDifficulty = targetDifficulty;
    var found = null;
    if (biasHigh) {
      while (searchDifficulty < 100) {
        found = this.findExactDifficulty(searchDifficulty);
        if (found === -1) {
          searchDifficulty = Math.round((searchDifficulty + 0.1) * 10) / 10;
          found = null;
        } else {
          return found;
        }
      }
    } else {
      while (searchDifficulty > 0) {
        found = this.findExactDifficulty(searchDifficulty);
        if (found === -1) {
          searchDifficulty = Math.round((searchDifficulty - 0.1) * 10) / 10;
          found = null;
        } else {
          return found;
        }
      }
    }
  };
};



Test.prototype.getQuestions = function () {
  'use strict';
  return this.questions;
};

Test.prototype.addQuestion = function (question) {
  'use strict';
  this.questions.push(question);
};

Test.prototype.addQuestions = function (questions) {
  'use strict';
  this.questions = this.questions.concat(questions);
};

Test.prototype.getStudent = function () {
  'use strict';
  return this.student;
};

Test.prototype.getNextQuestion = function () {
  'use strict';
  var ability = this.student.getAbility();
  var lastAnswered = this.studentResponses[this.studentResponses.length - 1];
  var bias;
  var questions;
  var searchRange = {
    high: ability + 1.0,
    low: ability - 1.0
  };
  if (lastAnswered) {
     bias = lastAnswered.answeredCorrectly;
  } else {
    bias = true;
  }

  var responseQuestions = _.pluck(this.studentResponses, 'question');
  //if (config.debug) {console.log(this.studentResponses);}
  //if (config.debug) {console.log(responseQuestions);}

  while (_.isUndefined(questions))
  {
    if (config.debug) {console.log(searchRange);}
    // Find questions within the search range.
    questions = _.query(this.questions, {
        difficulty : {$between:[searchRange.low,searchRange.high]}
    });

    // Remove all questions that have already been asked.
    questions = _.reject(questions, function (quest) {
      return (_.where(responseQuestions, {text: quest.text}).length > 1);
    });

//    question = _.find(this.questions, function (quest){
//      //console.log(quest);
//      return ((quest.difficulty < searchRange.high) &&
//              (quest.difficulty > searchRange.low) &&
//              (_.where(responseQuestions, {text: quest.text}).length === 0));

//    });
    searchRange.high += 0.1;
    searchRange.low -= 0.1;
  }
  // Once a suitable question has been found, we need find all others like it.
  // var questions = _.where(this.questions, {difficulty: question.difficulty});
  // Pick a random one of them to use.
  var randNum = Math.floor(Math.random() * questions.length);
  var question = questions[randNum];

  return question;

  //var question = this.findClosestDifficulty(ability, bias);
//  if (!question)
//  {
//    //question = this.findClosestDifficulty(ability, !bias);
//    if (!question) {
//      return false;
//    }
//    return question;
//  }
//  return question;
};


Test.prototype.processResponse = function (question, response) {
  'use strict';
  // Check if the response was correct
  //console.log([question, response]);
  //console.log(question);
  var questionObj = Question.createQuestionFromDB(question); //new Question(question.text, question.answers, question.difficulty);
  var correctAns = questionObj.checkAnswer(response);
  var newAbility = this.student.getAbility();

  var sResponse = new StudentResponse(questionObj, correctAns, this.student.getAbility());
  //if (config.debug) console.log("****************Student Response****************");
  //if (config.debug) console.log(sResponse);
  this.studentResponses.push(sResponse);

  /**
   * Handle updating the database statistics.
   */
  // if (config.debug) console.log('******Question*****');
  // if (config.debug) console.log(question);
  var updateOperation = {
    $inc: {
      asked: 1,
      correct: (correctAns) ? 1 : 0
    }
  };
  questionDb.update({_id: question._id}, updateOperation, null, function (err, doc){
    if (config.debug) console.log("DB updated");
  });

  // Handle penalties/bonuses for differences in ability.
  var abilityDifferenceModifier = 0;
  var difference = questionObj.difficulty - newAbility;
  if (difference > 2) abilityDifferenceModifier = 2;
  if (difference > 1.5 && difference <= 2) abilityDifferenceModifier = 1.5;
  if (difference > 1 && difference <= 1.5) abilityDifferenceModifier = .5;
  if (difference > 0 && difference <= 1) abilityDifferenceModifier = .25;
  if (difference > -1 && difference <= 0) abilityDifferenceModifier = -.25;
  if (difference > -1.5 && difference <= -1) abilityDifferenceModifier = -.5;
  if (difference > -2 && difference <= -1.5) abilityDifferenceModifier = -1.5;
  if (difference > -2) abilityDifferenceModifier = -2;

  if (correctAns) {
    console.log('Correct!');
    newAbility = newAbility + (2 + abilityDifferenceModifier / this.studentResponses.length);
  } else {
    console.log('Incorrect :(');
    newAbility = newAbility - (2 + abilityDifferenceModifier / this.studentResponses.length);
  }



  /**
   * New ability estimation attempt
   */

  // Determine the number of correct responses
  var numCorrectAnswers = _.countBy(this.studentResponses, function (response) {
    return response.answeredCorrectly === true;
  }).true;
  // Make sure it's set to zero if undefined.
  numCorrectAnswers = _.isUndefined(numCorrectAnswers) ? 0 : numCorrectAnswers;


  // Previous ability estimate
  var prevAbility = this.student.getAbility();

  // Calculate the modelled probability of success for the previous answers.
  var modeledProbability = 0;
  _.each(this.studentResponses, function (resp) {
    var top = Math.exp(resp.abilityLevel - resp.question.difficulty);
    var bottom = 1 + top;
    modeledProbability += top / bottom;
  });

  // Calculate the bottom half of the equation
  var modeledProbabilityWithFailure = 0;
  _.each(this.studentResponses, function (resp) {
    var top = Math.exp(resp.abilityLevel - resp.question.difficulty);
    var bottom = 1 + top;
    modeledProbabilityWithFailure += ((top / bottom) * (1 - (top/bottom)));
  });

  // Calculate new ability.
  if (config.debug) {
    console.log('Previous ability: ' + prevAbility);
    console.log('numCorrectAnswers: ' + numCorrectAnswers);
    console.log('modeledProbability: ' + modeledProbability);
    console.log('modeledProbabilityWithFailure: ' + modeledProbabilityWithFailure);
  }

  if (!correctAns) {
    prevAbility -= 1;
  }

  var newNewAbility = prevAbility + ((numCorrectAnswers - modeledProbability) / modeledProbabilityWithFailure);

  if (config.debug) {
    console.log('Old method ability = ' + newAbility);
    console.log('New method ability = ' + newNewAbility);
  }
  console.log('Updating ability to ' + newNewAbility);
  this.student.updateAbility(newNewAbility);
  return correctAns; // Return if the answer was properly answered or not.
};



module.exports = Test;
