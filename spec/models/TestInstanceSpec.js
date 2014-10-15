'use strict';
var expect = require('expect.js');
var TestInstance = require('../../lib/models/TestInstance');
var User = require('../../lib/models/User');
var AdaptiveTest = require('../../lib/models/AdaptiveTest');
var Question = require('../../lib/models/Question');
var Errors = require('../../lib/errors');
var mongoose = require('mongoose');
var async = require('async');
var sinon = require('sinon');
var _ = require('lodash');
require('underscore-query')(_);

var testInstance;
var user;
var test;
var question;

describe('TestInstance', function () {

  before(function (done) {
    // Connect to the database
    mongoose.connect(require('../../config/test.env').db);
    // Create a user
    var userObj = new User({
      userId: 'testId',
      fullName: 'Testy McTester',
      email: 'testing@test.com',
      roles: 'student'
    });
    // Create a test
    var adaptiveTestObj = new AdaptiveTest({
      title: 'A Test Test',
      description: 'Just for testing'
    });
    // Create a question
    var questionObj = new Question({
      text: 'What is the right way to test?',
      answers: [{
        text: 'With lots of methods',
        correct: false
      },{
        text: 'When it makes sense',
        correct: true
      }],
      difficulty: 50
    });

    // Save the user
    userObj.save(function (err, usr) {
      user = usr;
      // Save the question
      questionObj.save(function (err2, quest) {
        adaptiveTestObj.questions.push(quest._id);
        // Save the test
        adaptiveTestObj.save(function (err3, aTest) {
          test = aTest;
          done();
        });
      });
    });
  });

  beforeEach(function () {
    // Reset things to the original.
    testInstance = undefined;
  });

  after(function () {
    Question.remove().exec();
    User.remove().exec();
    AdaptiveTest.remove().exec();
    mongoose.disconnect();
  });


  it('should accept the userId and testId as actual user and test objects', function () {
    testInstance = new TestInstance(user, test);
    expect(testInstance).to.be.ok();
    expect(testInstance.questionsAsked.length).to.be(0);
  });

  it('should throw a ParameterError if no parameters are specified.', function () {
    expect(function () {new TestInstance();}).to.throwException(function (e){
      expect(e).to.be.a(Errors.ParameterError);
    });
  });

  it('should throw a ParameterError if an invalid parameter type is used.', function () {
    expect(function () {new TestInstance(1, 10);}).to.throwException(function (e){
      expect(e).to.be.a(Errors.ParameterError);
    });
  });

  it('should have the proper test and user objects after instantiation', function () {
    testInstance = new TestInstance(user, test);
    expect(testInstance.test).to.be(test);
    expect(testInstance.user).to.be(user);
  });

  it('should set the inital user ability to 50', function () {
    testInstance = new TestInstance(user, test);
    expect(testInstance.getUserAbility()).to.be(50);
  });

  describe('response processing', function () {

    before(function (done) {
      // Add in a bunch of questions.
      async.parallel([
          function (complete) {
            new Question({
              text: 'Test Q1',
              answers: [{
                text: 'Test Ans1',
                correct: false
              }, {
                text: 'When it makes sense',
                correct: true
              }],
              difficulty: 52
            }).save(function (err, quest) {
                  complete(err, quest);
                });
          },
          function (complete) {
            new Question({
              text: 'Test Q2',
              answers: [{
                text: 'Test Ans2',
                correct: false
              },{
                text: 'When it makes sense',
                correct: true
              }],
              difficulty: 48
            }).save(function (err, quest) {
                  complete(err, quest);
                });
          }
      ], function() {
        done();
      });


    });

    beforeEach(function (done) {
      testInstance = new TestInstance(user, test);
      testInstance.getNextQuestion(function (err, quest) {
        question = quest;
        done();
      });
    });

    afterEach(function () {
      testInstance = null;
      question = null;
    });

    after(function () {
      Question.remove().exec();
    });

    it('should process a correct response', function () {
      var responseId = question.answers[1].id;
      var correct = testInstance.processResponse(question._id, responseId);
      expect(correct).to.be(true);
    });

    it('should process an incorrect response', function () {
      var responseId = question.answers[0].id;
      var correct = testInstance.processResponse(question._id, responseId);
      expect(correct).to.be(false);
    });


    describe('ability modifications', function () {


      before(function (done) {
        // Add in a bunch of questions.
        async.parallel([
          function (complete) {
            new Question({
              text: 'Much Higher',
              answers: [{
                text: 'Test Ans1',
                correct: true
              }, {
                text: 'When it makes sense',
                correct: false
              }],
              difficulty: 60
            }).save(function (err, quest) {
                  complete(err, quest);
                });
          },
          function (complete) {
            new Question({
              text: 'Somewhat Higher',
              answers: [{
                text: 'Test Ans1',
                correct: true
              }, {
                text: 'When it makes sense',
                correct: false
              }],
              difficulty: 55
            }).save(function (err, quest) {
                  complete(err, quest);
                });
          },
          function (complete) {
            new Question({
              text: 'Higher',
              answers: [{
                text: 'Test Ans1',
                correct: true
              }, {
                text: 'When it makes sense',
                correct: false
              }],
              difficulty: 53
            }).save(function (err, quest) {
                  complete(err, quest);
                });
          },
          function (complete) {
            new Question({
              text: 'Slightly Higher',
              answers: [{
                text: 'Test Ans1',
                correct: true
              }, {
                text: 'When it makes sense',
                correct: false
              }],
              difficulty: 51
            }).save(function (err, quest) {
                  complete(err, quest);
                });
          },
          function (complete) {
            new Question({
              text: 'Slightly Lower',
              answers: [{
                text: 'Test Ans1',
                correct: true
              }, {
                text: 'When it makes sense',
                correct: false
              }],
              difficulty: 49
            }).save(function (err, quest) {
                  complete(err, quest);
                });
          },
          function (complete) {
            new Question({
              text: 'Lower',
              answers: [{
                text: 'Test Ans1',
                correct: true
              }, {
                text: 'When it makes sense',
                correct: false
              }],
              difficulty: 47
            }).save(function (err, quest) {
                  complete(err, quest);
                });
          },
          function (complete) {
            new Question({
              text: 'Somewhat Lower',
              answers: [{
                text: 'Test Ans1',
                correct: true
              }, {
                text: 'When it makes sense',
                correct: false
              }],
              difficulty: 45
            }).save(function (err, quest) {
                  complete(err, quest);
                });
          },
          function (complete) {
            new Question({
              text: 'Much Lower',
              answers: [{
                text: 'Test Ans1',
                correct: true
              }, {
                text: 'When it makes sense',
                correct: false
              }],
              difficulty: 40
            }).save(function (err, quest) {
                  complete(err, quest);
                });
          }
        ], function() {
          done();
        });
      });

      var questionHolder;
      var getStub;

      beforeEach(function (done) {
        questionHolder = question;
        testInstance = new TestInstance(user, test);
        Question.find(function (err, questions) {
          testInstance.fakeAskedQuestions = questions;
          getStub = sinon.stub(testInstance, 'getNextQuestion');
          done();
        });
      });

      afterEach(function () {
        getStub.restore();
        question = questionHolder;
        testInstance = null;
      });

      after(function () {
        Question.remove().exec();
      });


      it('should become much higher if the questions difficulty was 10 points or more higher and answered correctly', function (done) {
        var questionToUse = _.query(testInstance.fakeAskedQuestions, {text: 'Much Higher'})[0];
        testInstance.questionsAsked = [questionToUse];
        getStub.yields(null, questionToUse);

        testInstance.getNextQuestion(function (err, questionToAsk) {
          var oldAbility = testInstance.getUserAbility();
          var responseId = questionToAsk.answers[0].id;
          testInstance.processResponse(questionToAsk._id, responseId);
          var newAbility = testInstance.getUserAbility();
          expect(newAbility).to.be.greaterThan(oldAbility);
          expect(newAbility - oldAbility).to.be.within(10, 15);
          done();
        });
      });

      it('should become somewhat higher if the questions difficulty was between 5 - 9 points higher and answered correctly', function () {
        var questionToUse = _.query(testInstance.fakeAskedQuestions, {text: 'Somewhat Higher'})[0];
        testInstance.questionsAsked = [questionToUse];
        getStub.yields(null, questionToUse);

        testInstance.getNextQuestion(function (err, questionToAsk) {
          var oldAbility = testInstance.getUserAbility();
          var responseId = questionToAsk.answers[0].id;
          testInstance.processResponse(questionToAsk._id, responseId);
          var newAbility = testInstance.getUserAbility();
          expect(newAbility).to.be.greaterThan(oldAbility);
          expect(newAbility - oldAbility).to.be.within(5, 10);
        });
      });

      it('should become higher if the questions difficulty was between 2 - 4 points higher and answered correctly', function () {
        var questionToUse = _.query(testInstance.fakeAskedQuestions, {text: 'Higher'})[0];
        testInstance.questionsAsked = [questionToUse];
        getStub.yields(null, questionToUse);

        testInstance.getNextQuestion(function (err, questionToAsk) {
          var oldAbility = testInstance.getUserAbility();
          var responseId = questionToAsk.answers[0].id;
          testInstance.processResponse(questionToAsk._id, responseId);
          var newAbility = testInstance.getUserAbility();
          expect(newAbility).to.be.greaterThan(oldAbility);
          expect(newAbility - oldAbility).to.be.within(2.5, 5);
        });
      });

      it('should become slightly higher if the questions difficulty was between 0 - 2 points higher and answered correctly', function () {
        var questionToUse = _.query(testInstance.fakeAskedQuestions, {text: 'Slightly Higher'})[0];
        testInstance.questionsAsked = [questionToUse];
        getStub.yields(null, questionToUse);

        testInstance.getNextQuestion(function (err, questionToAsk) {
          var oldAbility = testInstance.getUserAbility();
          var responseId = questionToAsk.answers[0].id;
          testInstance.processResponse(questionToAsk._id, responseId);
          var newAbility = testInstance.getUserAbility();
          expect(newAbility).to.be.greaterThan(oldAbility);
          expect(newAbility - oldAbility).to.be.within(0, 2.5);
        });
      });

      it('should become slightly lower if the questions difficulty was between 0 - 2 points lower and answered incorrectly', function () {
        var questionToUse = _.query(testInstance.fakeAskedQuestions, {text: 'Slightly Lower'})[0];
        testInstance.questionsAsked = [questionToUse];
        getStub.yields(null, questionToUse);

        testInstance.getNextQuestion(function (err, questionToAsk) {
          var oldAbility = testInstance.getUserAbility();
          var responseId = questionToAsk.answers[1].id;
          testInstance.processResponse(questionToAsk._id, responseId);
          var newAbility = testInstance.getUserAbility();
          expect(newAbility).to.be.lessThan(oldAbility);
          expect(newAbility - oldAbility).to.be.within(-2.5, 0);
        });
      });

      it('should become lower if the questions difficulty was between 2 - 4 points lower and answered incorrectly', function () {
        var questionToUse = _.query(testInstance.fakeAskedQuestions, {text: 'Lower'})[0];
        testInstance.questionsAsked = [questionToUse];
        getStub.yields(null, questionToUse);

        testInstance.getNextQuestion(function (err, questionToAsk) {
          var oldAbility = testInstance.getUserAbility();
          var responseId = questionToAsk.answers[1].id;
          testInstance.processResponse(questionToAsk._id, responseId);
          var newAbility = testInstance.getUserAbility();
          expect(newAbility).to.be.lessThan(oldAbility);
          expect(newAbility - oldAbility).to.be.within(-5, -2.5);
        });
      });

      it('should become somewhat lower if the questions difficulty was between 5 - 9 points lower and answered incorrectly', function () {
        var questionToUse = _.query(testInstance.fakeAskedQuestions, {text: 'Somewhat Lower'})[0];
        testInstance.questionsAsked = [questionToUse];
        getStub.yields(null, questionToUse);

        testInstance.getNextQuestion(function (err, questionToAsk) {
          var oldAbility = testInstance.getUserAbility();
          var responseId = questionToAsk.answers[1].id;
          testInstance.processResponse(questionToAsk._id, responseId);
          var newAbility = testInstance.getUserAbility();
          expect(newAbility).to.be.lessThan(oldAbility);
          expect(newAbility - oldAbility).to.be.within(-10, -5);
        });
      });

      it('should become much lower if the questions difficulty was 10 points or more lower and answered incorrectly', function () {
        var questionToUse = _.query(testInstance.fakeAskedQuestions, {text: 'Much Lower'})[0];
        testInstance.questionsAsked = [questionToUse];
        getStub.yields(null, questionToUse);

        testInstance.getNextQuestion(function (err, questionToAsk) {
          var oldAbility = testInstance.getUserAbility();
          var responseId = questionToAsk.answers[1].id;
          testInstance.processResponse(questionToAsk._id, responseId);
          var newAbility = testInstance.getUserAbility();
          expect(newAbility).to.be.lessThan(oldAbility);
          expect(newAbility - oldAbility).to.be.within(-20, -10);
        });
      });

    });

  });

  describe('stopping criteria', function () {
    it('should not permit stopping until the minimum configured questions are asked');
    it('should stop whenever the maximum configured questions are asked');
    it('should stop whenever the configured mastery threshold has been reached');
    it('should stop whenever the configured failure threshold has been reached');
  });

  it('should be able to get the next question', function (done){
    testInstance = new TestInstance(user, test);
    testInstance.getNextQuestion(function (err, nextQuestion) {
      expect(err).to.be(null);
      expect(nextQuestion).to.be.a(Question);
      done();
    });
  });







});