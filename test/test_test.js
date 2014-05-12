'use strict';
/**
 * Tests the Test module.
 */

var Test = require('../lib/test');
var Question = require('../lib/question');
var Answer = require('../lib/answer');

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
var testQuestions = [];
testQuestions.push(new Question(testQuestionText, testAnswers, 4.5));
testQuestions.push(new Question('Different', testAnswers, 5));
testQuestions.push(new Question('Another', testAnswers, 5.5));
testQuestions.push(new Question('Testing again', testAnswers, 4.5));

exports.TestModule = {
  setUp: function (done) {
    this.test = new Test();
    this.test.addQuestions(testQuestions);
    done();
  },
  'test question search equals difficulty': function (test) {
    test.expect(1);
    var question = this.test.getNextQuestion();
    test.equals(question.text, 'Different', "Question text does not match.");
    test.done();
  },
  'test question search returns greater than difficulty': function (test) {
    test.expect(1);
    this.test.questions[1].difficulty = 10;
    var question = this.test.getNextQuestion();
    test.equals(question.text, 'Another', "Question text does not match properly.");
    test.done();
  },
  'test question search results returns less than difficulty': function (test) {
    test.expect(1);
    this.test.questions[0].difficulty = 1.5;
    this.test.questions[1].difficulty = 2.0;
    this.test.questions[2].difficulty = .5;
    this.test.questions[3].difficulty = 1.0;
    var question = this.test.getNextQuestion();
    test.equals(question.text, 'Different', "Question text does not match properly.");
    test.done();
  }


};
