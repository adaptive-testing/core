/**
 * Represents an instance of a test taken by a student.
 */

'use strict';

// Dependencies
var Errors = require('../errors');

// We'll need the test, question, and user models.
var AdaptiveTest = require('./AdaptiveTest');
// var Question = require('./Question');
var User = require('./User');

/**
 * Constructs a TestInstance object.
 * @param {User} user
 * @param {AdaptiveTest} test
 */
function TestInstance(user, test) {

  if (typeof user === 'undefined' || !(user instanceof User)) {
    throw new Errors.ParameterError('user obj must be provided');
  }
  if (typeof test === 'undefined' || !(test instanceof AdaptiveTest)) {
    throw new Errors.ParameterError('testId obj must be provided');
  }

  this.test = test;
  this.user = user;
  this.questionsAsked = [];
  this.user.ability = 50;
}

TestInstance.prototype.getUserAbility = function ()  {
  return this.user.ability;
};

TestInstance.prototype.getNextQuestion = function () {





};

module.exports = TestInstance;
