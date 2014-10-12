/**
 * Tests for the QuestionStore
 */

'use strict';
// var expect = require('expect.js');

// var Question = require('../../lib/models/Question');
var QuestionStore = require('../../lib/utils/QuestionStore');
// var Errors = require('../../lib/errors');
var mongoose = require('mongoose');

var questionStore;

describe('The QuestionStore', function () {
  before(function () {
    mongoose.connect(require('../../config/test.env').db);
  });

  after(function () {
    mongoose.disconnect();
  });

  beforeEach(function () {
    questionStore = new QuestionStore([]);
  });


  it('should only retrieve questions once');
  it('should return an array of question objects');
  it('should store changes back to the database');

});