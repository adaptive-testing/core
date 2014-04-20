/**
 * Represents a test instance.
 */

var Student = require('./student');

var Test = function () {
  this.questions = [];
  this.student = new Student();
};

Test.prototype.getQuestions = function () {
  return this.questions;
};

Test.prototype.getStudent = function () {
  return this.student;
};


module.exports = Test;
