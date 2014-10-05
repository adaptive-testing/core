/**
 * Represents an instance of a test taken by a student.
 */

'use strict';

// Dependencies
var Errors = require('../errors');

// We'll need the test, question, and user models.
// var AdaptiveTest = require('./AdaptiveTest');
// var Question = require('./Question');
// var User = require('./User');

/**
 * Constructs a TestInstance object.
 * @param {String} userId
 * @param {String} testId
 */
function TestInstance(userId, testId) {
  if (typeof userId === 'undefined') {
    throw new Errors.ParameterError('userId must be provided');
  }
  if (typeof userId === 'undefined') {
    throw new Errors.ParameterError('testId must be provided');
  }
  if (typeof userId !== 'string') {
    throw new Errors.ParameterError('userId must be a string');
  }
  if (typeof testId !== 'string') {
    throw new Errors.ParameterError('userId must be a string');
  }
  this.userId = userId;
  this.testId = testId;
  this.questionsAsked = [];
}

module.exports = TestInstance;
