/**
 * Represents an instance of a test taken by a student.
 */

'use strict';

// Dependencies
var Errors = require('../errors');
var _ = require('lodash');
require('underscore-query')(_);

// We'll need the test, question, and user models.
var AdaptiveTest = require('./AdaptiveTest');
// var Question = require('./Question');
var User = require('./User');
var QuestionStore = require('../utils/QuestionStore');

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
  this.userResponses = [];
  this.user.ability = 50;
  this.questionStore = new QuestionStore();
}

TestInstance.prototype.getUserAbility = function ()  {
  return this.user.ability;
};

TestInstance.prototype.setUserAbility = function (ability) {
  this.user.ability = ability;
};

TestInstance.prototype.updateUserAbility = function (questionDifficulty, answeredCorrectly) {
  var abilityDifferenceModifier = 0;
  var currentAbility = this.getUserAbility();
  var difference = questionDifficulty - currentAbility;

  if (difference > 2) { abilityDifferenceModifier = 2; }
  if (difference > 1.5 && difference <= 2) { abilityDifferenceModifier = 1.5; }
  if (difference > 1 && difference <= 1.5) { abilityDifferenceModifier = 0.5; }
  if (difference > 0 && difference <= 1) { abilityDifferenceModifier = 0.25; }
  if (difference > -1 && difference <= 0) { abilityDifferenceModifier = -0.25; }
  if (difference > -1.5 && difference <= -1) { abilityDifferenceModifier = -0.5; }
  if (difference > -2 && difference <= -1.5) { abilityDifferenceModifier = -1.5; }
  if (difference < -2) { abilityDifferenceModifier = -2; }

  if (answeredCorrectly) {
    this.setUserAbility(currentAbility + (2 + abilityDifferenceModifier / this.userResponses.length));
  } else {
    this.setUserAbility(currentAbility - (2 + abilityDifferenceModifier / this.userResponses.length));
  }

};

TestInstance.prototype.processResponse = function (questionId, responseId) {
  // TODO: Is this actually necessary, the find?
  var question = _.find(this.questionsAsked, {_id: questionId});  // Makes sure it was indeed asked.
  var answer = _.find(question.answers, function (ans) {
    if (ans.id === responseId) {
      return true;
    }
  });

  // Store it as a user response
  this.userResponses.push({question: question, responseCorrect: answer.correct});

  // Adjust user ability
  this.updateUserAbility(question.difficulty, answer.correct);

  // Return if it was correct or not.
  return answer.correct;

};

/**
 * Gets the next question.
 */
TestInstance.prototype.getNextQuestion = function (callback) {
  if (!_.isFunction(callback)) {
    throw new Errors.ParameterError('A callback must be provided.');
  }
  var that = this;
  var possibleQuestions;
  var ability = this.getUserAbility();
  // var answeredPreviousCorrect = _.last(this.userResponses).responseCorrect;
  var searchRange = {
    high: ability + 20.0,
    low: ability - 20.0
  };

  // Get the questions.
  this.questionStore.getQuestions(function (err, questions) {

    // Filter out any questions that were already asked.
    possibleQuestions = _.filter(questions, function (quest) {
      return !_.contains(that.questionsAsked, quest._id);
    });

    var questionsToAsk;

    //Loop looking for a question.
    while (_.isUndefined(questionsToAsk)) {
      questionsToAsk = _.query(possibleQuestions, {
        difficulty: {$between: [searchRange.low, searchRange.high]}
      });

      // TODO: This could use some improvement.
      searchRange.high += 0.1;
      searchRange.low -= 0.1;
    }

    // We'll now have several to pick, lets go with a random one.
    var randNum = Math.floor(Math.random() * questionsToAsk.length);

    that.questionsAsked.push(questionsToAsk[randNum]);

    callback(null, questionsToAsk[randNum]);

  });






};

module.exports = TestInstance;
