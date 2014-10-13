/**
 * Tests for the QuestionStore
 */

'use strict';

var expect = require('expect.js');
var sinon = require('sinon');

var Question = require('../../lib/models/Question');
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
    // Put a question into the store's buffer.
    questionStore.questionsToSave = [
      new Question({
        text: 'What is the right way to test?',
        answers: [{
          text: 'With lots of methods',
          correct: false
        },{
          text: 'When it makes sense',
          correct: true
        }],
        difficulty: 10
      })
    ];
  });


  it('should only retrieve questions once', function () {
    var fetchStub = sinon.stub(questionStore, 'fetch', function () {
      this.hasFetched = true;
    });
    questionStore.getQuestions(function (){});
    questionStore.getQuestions(function (){});
    expect(fetchStub.callCount).to.be(1);
    fetchStub.restore();
  });

  it('should return an array of question objects', function (done) {
    questionStore.getQuestions(function (err, questions) {
      expect(err).to.be(null);
      expect(questions).to.be.an('array');
      done();
    });
  });

  it('should store changes back to the database', function (done) {

    questionStore.save(function (err, errors, numSaved) {
      expect(err).to.be(null);
      expect(errors.length).to.be(0);
      expect(numSaved).to.be(1);
      done();
    });

  });

  it('should remove questionsToSave after saving', function (done) {
    questionStore.save(function () {
      expect(questionStore.questionsToSave.length).to.be(0);
      done();
    });

  });



});