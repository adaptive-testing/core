'use strict';

var adaptiveTesterCore = require('../lib/adaptive-tester-core.js');
var Question = require('../lib/question');
var Answer = require('../lib/answer');
var ParameterError = require('../lib/ParameterError');
var MultipleCorrectAnswersError = require('../lib/MultipleCorrectAnswersError');
var Student = require('../lib/student');
var Test = require('../lib/test');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var testAnswers = [new Answer("yes", true), new Answer("no", false) ];
var testQuestionText = "Will this work?";

exports.adaptiveTesterCore = {
  'empty question length': function (test) {
    test.expect(1);
    test.equal(adaptiveTesterCore.getTotalQuestions(), 0, 'should be zero.');
    test.done();
  },
  'a question object cannot be created without any answers': function (test) {
    test.expect(1);
    test.throws(function () {
      new Question("Will this throw an exception?");
    }, Error, 'should fail for a non-array answers parameter.');
    test.done();
  },
  'a question object cannot be created with a non-array answers parameter': function (test) {
    test.expect(1);
    test.throws(function () {
      new Question("Will this throw an exception?", "an answer");
    }, Error, 'should fail for a non-array answers parameter.');
    test.done();
  },
  'a question object cannot be created with an empty answers parameter': function (test) {
    test.expect(1);
    test.throws(function () {
      new Question("Will this throw an exception?", []);
    }, ParameterError, 'should fail for an empty answers parameter.');
    test.done();
  },
  'a question cannot be created without a valid text parameter': function (test) {
    test.expect(1);
    test.throws(function () {
      new Question (null, testAnswers);
    }, ParameterError, 'should fail for an empty question text string.');
    test.done();
  },
  'a question can be added only with an array of answers': function (test) {
    test.expect(2);
    test.doesNotThrow(function () {
      new Question(testQuestionText, testAnswers, 3);
    }, ParameterError, 'should not fail with valid input.');
    test.throws(function () {
      new Question(testQuestionText, ["yes", "now"], 3);
    }, ParameterError, 'should fail for non-answer input in arrays');
    test.done();
  },
  'a question fails if it does not have a number for difficulty': function (test) {
    test.expect(3);
    test.doesNotThrow(function () {
      new Question(testQuestionText, testAnswers, 3);
    }, ParameterError, 'should not fail with valid input.');
    test.throws(function () {
      new Question(testQuestionText, testAnswers, "hard");
    }, ParameterError, 'should fail with a string as input.');
    test.throws(function () {
      new Question(testQuestionText, testAnswers, NaN);
    }, ParameterError, 'should fail for NaN input.');
    test.done();
  },
  'a question fails if the difficulty is lower than 0 or more than 100': function (test) {
    test.expect(2);
    test.throws(function () {
      new Question(testQuestionText, testAnswers, -1);
    }, RangeError, 'should fail for negative difficulties');
    test.throws(function() {
      new Question(testQuestionText, testAnswers, 101);
    }, RangeError, 'should fail for difficulties over 100');
    test.done();
  },
  'a question can be added into the core': function (test) {
    test.expect(1);
    adaptiveTesterCore.addQuestion(new Question(testQuestionText, testAnswers, 30));
    test.equal(adaptiveTesterCore.getTotalQuestions(), 1, 'should have one question within.');
    test.done();
  },
  'a non-question cannot be added to the core': function (test) {
    test.expect(1);
    test.throws(function () {
      adaptiveTesterCore.addQuestion("Why?");
    }, ParameterError, 'should fail with non-question input.');
    test.done();
  },
  'a question cannot have more than one correct answer': function (test) {
    test.expect(1);
    var answersCopy = testAnswers.slice();
    answersCopy.push(new Answer('It depends', true));
    test.throws(function () {
       new Question(testQuestionText, answersCopy, 30);
    }, MultipleCorrectAnswersError, 'should fail with more than one correct answer.');
    test.done();
  },
  'a student can be created with an initial ability': function (test) {
    test.expect(2);
    var student = new Student(30);
    test.ok(student, 'should create a student without problem.');
    test.equals(student.getAbility(), 30, 'ability should be equal after creation.');
    test.done();
  },
  'a student can be created with only a name': function (test) {
    test.expect(2);
    var student = new Student("Clay");
    test.ok(student, 'should create a student without problem.');
    test.equals(student.getName(), "Clay", 'name should be equal after creation.');
    test.done();
  },
  'a student can be created with both a name and an initial ability': function (test) {
    test.expect(3);
    var student = new Student("Clay", 30);
    test.ok(student, 'should create a student without problem.');
    test.equals(student.getName(), "Clay", 'name should be equal after creation.');
    test.equals(student.getAbility(), 30, 'ability should be equal after creation.');
    test.done();
  },
  'a student created with no arguments gets default values': function (test) {
    test.expect(3);
    var student = new Student();
    test.ok(student, 'should create a student without problem.');
    test.equals(student.getName(), 'Default', 'name should be Default.');
    test.equals(student.getAbility(), 5.0, 'ability should be 50.');
    test.done();
  },
  'a student has a list of previously asked questions': function (test) {
    test.expect(2);
    var student = new Student(3);
    test.ok(student, 'should create a student without problem.');
    test.equals(student.getAskedQuestions().length, 0, 'should have 0 questions asked.');
    test.done();
  },
  'a question which has been asked can be added to a student': function (test) {
    test.expect(3);
    var student = new Student(30);
    test.ok(student, 'should create a student without problem.');
    test.equals(student.getAskedQuestions().length, 0, 'should have 0 questions asked.');
    student.addAskedQuestion('acb231d');
    test.equals(student.getAskedQuestions().length, 1, 'should have 1 questions asked.');
    test.done();
  },
  'a test can be created': function (test) {
    test.expect(1);
    var myTest = new Test();
    test.ok(myTest, 'a test is created successfully');
    test.done();
  },
  'a test has all the expected properties': function (test) {
    test.expect(3);
    var myTest = new Test();
    test.ok(myTest, 'a test is created successfully');
    test.equals(myTest.getQuestions().length, 0, 'should have no questions');
    test.equals(myTest.getStudent() instanceof Student, true, 'should have a student');
    test.done();
  }

};
