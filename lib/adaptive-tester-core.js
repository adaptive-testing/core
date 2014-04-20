/*
 * adaptive-tester-core
 * user/repo
 *
 * Copyright (c) 2014 Clay Diffrient
 * Licensed under the MIT license.
 */

'use strict';

var Question = require('./question');
var ParameterError = require('./ParameterError');
var MultipleCorrectAnswersError = require('./MultipleCorrectAnswersError');
var _ = require('underscore');

// Holds the questions
var questions = [];

var getTotalQuestions = function () {
  return questions.length;
};

var addQuestion = function (question) {
  if (!(question instanceof Question)) {
    throw new ParameterError('Cannot add a non-question object to the questions.');
  }
  var correctCount = 0;
  _.each(question.answers, function (answer) {
    if (answer.correct) {
      correctCount++;
    }
  });
  if (correctCount > 1) {
    throw new MultipleCorrectAnswersError('Cannot have more than one correct answer');
  }
  questions.push(question);
};



module.exports = {
  getTotalQuestions: getTotalQuestions,
  addQuestion: addQuestion
};



