/**
 * Describes the question model for use in the core.
 */

var _ = require('underscore');
var ParameterError = require('./ParameterError');
var MultipleCorrectAnswersError = require('./MultipleCorrectAnswersError');
var Answer = require('./answer');

var Question = function (text, answers, difficulty) {
  if (typeof text !== 'string') {
    throw new ParameterError("Question text must be present as a string.");
  } else {
    this.text = text;
  }

  if (!_.isNumber(difficulty) || _.isNaN(difficulty)) {
    throw new ParameterError("Questions must have a numeric difficulty.");
  }
  if (difficulty > 10 || difficulty < 0) {
    throw new RangeError("Difficulty must be between 0 and 10 (inclusive)");
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
  var selectedAns = _.find(this.answers, function (ans) {
    return ans == answer;
  });
  return selectedAns.isCorrect();
};

module.exports = Question;


