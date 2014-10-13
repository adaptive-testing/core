/**
 * Used to store questions and cache them with the database.
 */

'use strict';
// var mongoose = require('mongoose');
var Question = require('../models/Question');
var async = require('async');


/**
 * Creates a new QuestionStore
 * @param {[Question]} Array of Question object ids.
 */
function QuestionStore() {
  this.hasFetched = false;
  this.questionsFetched = [];
  this.questionsToSave = [];

}

QuestionStore.prototype.fetch = function (callback) {
  var that = this;
  if (!this.hasFetched) {
    Question.find(function (err, questions) {
      that.questionsFetched = questions;
      that.hasFetched = true;
      if (err) {
        callback(err);
      } else {
        callback(null, that.questionsFetched);
      }
    });
  }
  return;
};

/**
 * Returns the questions from the question store, fetches
 * the questions from the database if needed.
 * TODO: Use events rather than callbacks?
 */
QuestionStore.prototype.getQuestions = function (callback) {
  if (this.hasFetched) {
    callback(null, this.questionsFetched);
  } else {
    this.fetch(function (err, questions) {
      if (err) {
        // TODO: Replace with new Error type.
        callback(new Error('Problem fetching questions'));
      } else {
        callback(null, questions);
      }
    });

  }
};

/**
 * Saves everything back to the database.
 * The callback's signature is callback(err, errors, numSaved)
 * where errors, is an array of the models that didn't save.
 * @param callback
 */
QuestionStore.prototype.save = function (callback) {
  var that = this;
  if (this.questionsToSave) {
    var errors = [];
    var numSaved = 0;

    async.each(this.questionsToSave, function (question, cb) {
      question.save(function (err, quest){
        if (err) {
          errors.push(quest);
        } else {
          numSaved++;
        }
        cb();
      });

    }, function () {
      if (!errors.length) {
        // Clear the holding area if they all saved.
        that.questionsToSave = [];
      }

      callback(null, errors, numSaved);


    });
  } else {
    // If there weren't any to save, don't save it.
    callback(null, [], 0);
  }

};

module.exports = QuestionStore;