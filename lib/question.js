/**
 * Describes the question model for use in the core.
 */

var _ = require('underscore');
var ParameterError = require('./ParameterError');
var MultipleCorrectAnswersError = require('./MultipleCorrectAnswersError');
var Answer = require('./answer');

var Question = function (text, answers, difficulty) {
  'use strict';
  //console.log([text, answers, difficulty]);
  if (typeof text !== 'string') {
    throw new ParameterError("Question text must be present as a string.");
  } else {
    this.text = text;
  }

  if (!_.isNumber(difficulty) || _.isNaN(difficulty)) {
    throw new ParameterError("Questions must have a numeric difficulty.");
  }
  if (difficulty > 100 || difficulty < 0) {
    throw new RangeError("Difficulty must be between 0 and 100 (inclusive)");
  }
  this.difficulty = difficulty;

  // Check if there are at least 2 answers in the array.
  if (!_.isArray(answers) || answers.length < 2) {
    throw new ParameterError("The answers parameter must be an array with at least two entries.");
  }

  // Check if it is an array of answers and if there is more than one correct answer.
  var correctCount = 0;
  _.each(answers, function (answer) {
     if (!(answer instanceof Answer)) {
       console.log("Error...");
       throw new ParameterError("The answers array, must contain answer objects.");
     }
     if (answer.correct) {
       correctCount++;
     }
  });

  if (correctCount > 1) {
    throw new MultipleCorrectAnswersError("Only one correct answer is allowed.");
  }

  this.answers = answers;

};

Question.prototype.checkAnswer = function (answer){
  'use strict';
  //console.log(answer);
  //console.log("Here");

  var selectedAns = _.find(this.answers, function (ans) {
    //console.log([ans, answer]);
    return ans.text === answer;
  });
  return selectedAns.isCorrect();
};

Question.createQuestionFromDB = function (questionObj) {
  'use strict';
  var answers = [];
  _.each(questionObj.answers, function (ans) {
    answers.push(new Answer(ans.text, ans.correct));
  });
  var question = new Question(questionObj.text, answers, questionObj.difficulty);
  question.create = questionObj.created;
  question.correct = questionObj.correct;
  question.asked = questionObj.asked;
  return question;
};

module.exports = Question;


