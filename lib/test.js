/**
 * Represents a test instance.
 */

var Student = require('./student');
var StudentResponse = require('./StudentResponse');
var _ = require('underscore');

var Test = function () {
  this.questions = [];
  this.student = new Student();
  this.studentResponses = [];


  this.findExactDifficulty = function (targetDifficulty) {
    if (this.questions.length < 1) {
      // No questions in list error condition.
      return 0;
    }

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
      while (searchDifficulty < 10) {
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
  return this.questions;
};

Test.prototype.addQuestion = function (question) {
  this.questions.push(question);
};

Test.prototype.addQuestions = function (questions) {
  this.questions = this.questions.concat(questions);
};

Test.prototype.getStudent = function () {
  return this.student;
};

Test.prototype.getNextQuestion = function () {
  var ability = this.student.getAbility();
  var lastAnswered = this.studentResponses[this.studentResponses.length - 1];
  var bias;
  if (lastAnswered) {
     bias = lastAnswered.answeredCorrectly;
  } else {
    bias = true;
  }
  var question = this.findClosestDifficulty(ability, bias);
  if (!question)
  {
    question = this.findClosestDifficulty(ability, !bias);
    if (!question) {
      return false;
    }
    return question;
  }
  return question;
};

Test.prototype.processResponse = function (question, response) {
  // Check if the response was correct
  var correctAns = question.checkAnswer(response);
  // Get the ability
  var ability = this.student.getAbility();
  // Add the response to the array of responses.
  this.studentResponses.push(new StudentResponse(question, correctAns, ability));
  // Variable to hold the data we will soon retrieve.
  var modelledProbabilitySum = 0;
  // Variable to hold the multiplied probabilities
  var probablityMultipleSum = 0;
  // Variable to hold the number of successes
  var numSuccess = 0;
  // Collect and calculate the data within this loop.
  _.each(this.studentResponses, function (response) {
    // Determine the numerator for the modelled probabilty.
    var numerator = Math.exp(response.abilityLevel - response.question.difficulty);
    // Now the denominator
    var denominator = numerator + 1;
    // Calculate the probability of success.
    var correctProb = Math.round((numerator / denominator) * 10) / 10;
    // Add it to the sum.
    modelledProbabilitySum += correctProb;
    // Same for incorrect.
    var incorrectProb = 1 - Math.round((numerator / denominator) * 10) / 10;
    // Add the product to the total sum.
    probablityMultipleSum += correctProb * incorrectProb;
    // Increase the number of successes if it was answered correctly.
    if (response.answeredCorrectly) {
      numSuccess++;
    }
  });
  // Calculate the new ability.
  var newAbility = ability + ((numSuccess - modelledProbabilitySum) / probablityMultipleSum);
  newAbility = Math.round(newAbility * 10) / 10;
  this.student.updateAbility(newAbility);
};



module.exports = Test;
