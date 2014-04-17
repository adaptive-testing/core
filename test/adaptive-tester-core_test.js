'use strict';

var adaptiveTesterCore = require('../lib/adaptive-tester-core.js');
var Question = require('../lib/question');

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

exports.adaptiveTesterCore = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    //test.expect(1);
    // tests here
    //test.equal(adaptiveTesterCore.awesome(), 'awesome', 'should be awesome.');
    test.done();
  },
  'empty question length': function (test) {
    test.expect(1);
    test.equal(adaptiveTesterCore().getTotalQuestions(), 0, 'should be zero.');
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
    }, Error, 'should fail for an empty answers parameter.');
    test.done();
  }

};
