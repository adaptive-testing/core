'use strict';
var expect = require('expect.js');
var TestInstance = require('../../lib/models/TestInstance');
var User = require('../../lib/models/User');
var AdaptiveTest = require('../../lib/models/AdaptiveTest');
var Question = require('../../lib/models/Question');
var Errors = require('../../lib/errors');
var mongoose = require('mongoose');

var testInstance;
var user;
var test;

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
      difficulty: 10,
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

  it('should be able to get the next question'); /*, function (){
    testInstance = new TestInstance(user, test);
    expect(testInstance.getNextQuestion()).to.be.a(Question);
  });
  */

  it('should be able to get the next question after a correct answer');
  it('should be able to get the next question after an incorrect answer');

  describe('ability modifications', function () {
    it('should become much higher if the questions difficulty was 2 points or more higher');
    it('should become somewhat higher if the questions difficulty was between 1.5 - 2 points higher');
    it('should become higher if the questions difficulty was between 1 - 1.5 points higher');
    it('should become slightly higher if the questions difficulty was between 0 - 1 points higher');
    it('should become slightly lower if the questions difficulty was between 0 - 1 points lower');
    it('should become lower if the questions difficulty was between 1 - 1.5 points lower');
    it('should become somewhat lower if the questions difficulty was between 1.5 - 2 points lower');
    it('should become much lower if the questions difficulty was 2 points or more lower');
  });


});