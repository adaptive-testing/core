'use strict';
var expect = require('expect.js');
var TestInstance = require('../../lib/models/TestInstance');

var testInstance;
var user;
var test;

describe('TestInstance Unit Tests', function () {

  beforeEach(function () {
    user = test = {};
  });

  it('should instantiate with a user id and a test id', function () {
    user.id = "2a3b4c9aac8hz";
    test.id = "abcD2134dae8f";
    testInstance = new TestInstance(user.id, test.id);
    expect(testInstance).to.be.ok();
    expect(testInstance.questionsAsked.length).to.be(0);
  });

  it('should throw a ParameterError if no parameters are specified.');
  it('should throw a ParameterError if a non-string parameter is used.');

});