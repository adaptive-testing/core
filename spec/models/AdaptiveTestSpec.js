/**
 * Tests for the AdaptiveTest model.
 */

var Question = require('../../lib/models/Question');
var AdaptiveTest = require('../../lib/models/AdaptiveTest');

var mongoose = require('mongoose');

var question;
var adaptiveTest;

describe('AdaptiveTest Unit Tests', function () {

  beforeEach(function () {
    // Connect to the test DB
    mongoose.connect(require('../../config/test.env').db);

    // Create a question
    question = new Question({
      text: 'What is the right way to test?',
      answers: [{
        text: 'With lots of methods',
        correct: false
      },{
        text: 'When it makes sense',
        correct: true
      }],
      difficulty: 10,
    });

    // Create a test
    adaptiveTest = new AdaptiveTest({
      title: 'A Test Test',
      description: 'Just for testing'
    });

  });

  afterEach(function () {
    Question.remove().exec();
    AdaptiveTest.remove().exec();
    mongoose.disconnect();
  });

  it('should save an AdaptiveTest without problems', function (done) {
    adaptiveTest.save(function (err) {
      expect(err).toBeNull();
      done();
    });
  });

  it('should save a question to the test given an ID', function (done) {
    question.save(function (err, quest) {
      adaptiveTest.questions.push(quest._id);
      adaptiveTest.save(function (err) {
        expect(err).toBeNull();
        done();
      });
    });
  });

});