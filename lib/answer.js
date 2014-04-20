/**
 * Describes the answer model for use in the core.
 */

var _ = require('underscore');
var ParameterError = require('./ParameterError');

var Answer = function (text, correct) {
  if (!_.isBoolean(correct) || ! (typeof text === 'string')) {

  }
  this.text = text;
  this.correct = correct;
}

module.exports = Answer;
