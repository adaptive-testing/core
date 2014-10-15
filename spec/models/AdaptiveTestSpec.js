/**
 * Tests for the AdaptiveTest model.
 */
var expect = require('expect.js');
var Question = require('../../lib/models/Question');
var AdaptiveTest = require('../../lib/models/AdaptiveTest');

var mongoose = require('mongoose');

var question;
var adaptiveTest;

describe('AdaptiveTest Unit Tests', function () {

  before(function () {
    mongoose.connect(require('../../config/test.env').db);
  });

  beforeEach(function () {

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
      difficulty: 10
    });

    // Create a test
    adaptiveTest = new AdaptiveTest({
      title: 'A Test Test',
      description: 'Just for testing',
      config: {
        maxQuestions: 30,
        masteryThreshold: 80,
        failureThreshold: 40
      }
    });

  });

  afterEach(function () {
    Question.remove().exec();
    AdaptiveTest.remove().exec();
  });

  after(function () {
    mongoose.disconnect();
  });

  it('should save an AdaptiveTest without problems', function (done) {
    adaptiveTest.save(function (err) {
      expect(err).to.be(null);
      done();
    });
  });

  it('should require a configuration object to be present', function (done) {
    adaptiveTest.config = null;
    adaptiveTest.save(function (err) {
      expect(err).to.be.ok();
      done();
    });
  });



  it('should save a question to the test given an ID', function (done) {
    question.save(function (err, quest) {
      adaptiveTest.questions.push(quest._id);
      adaptiveTest.save(function (err) {
        expect(err).to.be(null);
        done();
      });
    });
  });

});