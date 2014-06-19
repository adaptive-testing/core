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
testQuestions.push(new Question(testQuestionText, testAnswers, 45));
testQuestions.push(new Question('Different', testAnswers, 50));
testQuestions.push(new Question('Another', testAnswers, 5.5));
testQuestions.push(new Question('Testing again', testAnswers, 45));

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
    this.test.questions[1].difficulty = 100;
    var question = this.test.getNextQuestion();
    test.equals(question.text, 'Another', "Question text does not match properly.");
    test.done();
  },
  'test question search results returns less than difficulty': function (test) {
    test.expect(1);
    this.test.questions[0].difficulty = 15;
    this.test.questions[1].difficulty = 50;
    this.test.questions[2].difficulty = 5;
    this.test.questions[3].difficulty = 10;
    var question = this.test.getNextQuestion();
    test.equals(question.text, 'Different', "Question text does not match properly.");
    test.done();
  },
  'process response: update ability low difficulty correct': function (test) {
    test.expect(1);
    this.test.processResponse(testQuestions[0], "yes");
    var ability = this.test.student.getAbility();
    test.ok((ability > 50) && (ability < 55), "Ability should be slightly higher.");
    test.done();
  },
  'process response: update ability low difficulty incorrect': function (test) {
    test.expect(1);
    this.test.processResponse(testQuestions[0], "no");
    var ability = this.test.student.getAbility();
    console.log(ability);
    test.ok(ability <= 0, "Ability should be much lower max of zero.");
    test.done();
  },
  'process response: update ability equal difficulty correct': function (test) {
    test.expect(1);
    this.test.processResponse(testQuestions[1], "yes");
    var ability = this.test.student.getAbility();
    test.ok((ability > 50) && (ability < 55), "Ability should be a bit higher.");
    test.done();
  },
  'process response: update ability equal difficulty incorrect': function (test) {
    test.expect(1);
    this.test.processResponse(testQuestions[1], "no");
    var ability = this.test.student.getAbility();
    test.ok((ability > 45) && (ability < 50), "Ability should be a bit lower.");
    test.done();
  },
  'process response: update ability greater difficulty correct': function (test) {
    test.expect(1);
    this.test.questions[3].difficulty = 90;
    this.test.processResponse(testQuestions[3], "yes");
    var ability = this.test.student.getAbility();
    console.log(ability);
    test.ok((ability > 90) && (ability <= 100), "Ability should be a lot higher.");
    test.done();
  },
  'process response: update ability greater difficulty incorrect': function (test) {
    test.expect(1);
    this.test.questions[3].difficulty = 90;
    this.test.processResponse(testQuestions[3], "no");
    var ability = this.test.student.getAbility();
    console.log(ability);
    test.ok((ability >= 49) && (ability <= 50), "Ability should be a bit lower.");
    test.done();
  },
  'process response: update ability slightly greater difficulty correct': function (test) {
    test.expect(1);
    this.test.questions[3].difficulty = 5.5;
    this.test.processResponse(testQuestions[3], "yes");
    var ability = this.test.student.getAbility();
    console.log(ability);
    test.ok((ability >= 5.0) && (ability <= 6.5), "Ability should be slightly higher, but not really high.");
    test.done();
  }

};
