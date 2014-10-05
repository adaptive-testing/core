/**
 * Tests for the Question model
 */
var expect = require('expect.js');
var Question = require('../../lib/models/Question');
var mongoose = require('mongoose');
var question;

describe('Question Unit Tests', function () {

  before(function () {
    mongoose.connect(require('../../config/test.env').db);
  });

  after(function () {
    mongoose.disconnect();
  });

  beforeEach(function () {
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
  });

  afterEach(function () {
    Question.remove().exec();
  });



  it('should save the model without problems', function (done) {
    question.save(function (err) {
      expect(err).to.be(null);
      done();
    });
  });

  it('should not allow saving without text', function (done) {
    question.text = '';
    question.save(function (err) {
      expect(err).to.be.ok();
      done();
    });
  });

  it('should not allow more than one correct answer', function (done) {
    question.answers.push({text: 'With care', correct: true});
    question.save(function (err) {
      expect(err.name).to.be('ValidationError');
      done();
    });
  });

  it('should not allow no answers', function (done) {
    question.answers = [];
    question.save(function (err) {
      expect(err.name).to.be('ValidationError');
      done();
    });
  });

  it('should only accept an array of answers', function (done) {
    question.answers = "Cool answer";
    question.save(function (err) {
      expect(err.name).to.be('TypeError');
      done();
    });
  });

  it('should not accept strings as difficulty', function (done){
    question.difficulty = "Hard";
    question.save(function (err) {
      expect(err.name).to.be('CastError');
      done();
    });
  });

  it('should not accept a difficulty less than zero (0)', function (done) {
    question.difficulty = -1;
    question.save(function (err) {
      expect(err.name).to.be('ValidationError');
      done();
    });
  });

  it('should not accept a difficulty more than one hundred (100)', function (done) {
    question.difficulty = 101;
    question.save(function (err) {
      expect(err.name).to.be('ValidationError');
      done();
    });
  });



  it('should return a proper value for the incorrect property', function (done) {
    question.asked = 10;
    question.correct = 5;
    question.save(function (err, quest) {
      expect(err).to.be(null);
      expect(quest.incorrect).to.be(5);
      done();
    });
  });

});