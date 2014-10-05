'use strict';
var expect = require('expect.js');
var TestInstance = require('../../lib/models/TestInstance');
var Errors = require('../../lib/errors');

var testInstance;
var user;
var test;

describe('TestInstance Unit Tests', function () {

  beforeEach(function () {
    user = test = {};
    testInstance = undefined; // Restore to original
  });

  it('should instantiate with a user id and a test id', function () {
    user.id = "2a3b4c9aac8hz";
    test.id = "abcD2134dae8f";
    testInstance = new TestInstance(user.id, test.id);
    expect(testInstance).to.be.ok();
    expect(testInstance.questionsAsked.length).to.be(0);
  });

  it('should throw a ParameterError if no parameters are specified.', function () {
    expect(function () {new TestInstance();}).to.throwException(function (e){
      expect(e).to.be.a(Errors.ParameterError);
    });
  });

  it('should throw a ParameterError if a non-string parameter is used.', function () {
    expect(function () {new TestInstance(1, 10);}).to.throwException(function (e){
      expect(e).to.be.a(Errors.ParameterError);
    });

  });

});