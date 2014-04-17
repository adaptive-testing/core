/**
 * Describes the question model for use in the core.
 */

var _ = require('underscore');

function ParameterError(message) {
  this.message = message;
}

ParameterError.prototype = new Error();

var Question = function (text, answers) {
  this.text = text;
  if (!_.isArray(answers) || answers.length < 2) {
    throw new ParameterError("The answers parameter must be an array with at least two entries.");
  } else {
    this.answers = answers;
  }

}

module.exports = Question;


