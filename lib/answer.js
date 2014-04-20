/**
 * Describes the answer model for use in the core.
 */

var _ = require('underscore');
var ParameterError = require('./ParameterError');

var Answer = function (text, correct) {
  if (!_.isBoolean(correct) || (typeof text !== 'string')) {
    throw new ParameterError("Text must be a string and correct must be a boolean.");
  }
  this.text = text;
  this.correct = correct;
};

module.exports = Answer;
