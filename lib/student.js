/**
 * Represents a student in the adaptive tester.
 */

var _ = require('underscore');

var Student = function () {
  var args = Array.prototype.slice.call(arguments);
  args.forEach(function (arg) {
    if (_.isNumber(arg)) {
      this.ability = arg;
    } else if (_.isString(arg)) {
      this.name = arg;
    }
  }, this);
  if (this.ability === undefined) {
    this.ability = 5;
  }
  if (this.name === undefined) {
    this.name = 'Default';
  }
  this.questionsAsked = [];
};

Student.prototype.updateAbility = function (ability) {
  this.ability = ability;
};


Student.prototype.getAbility = function () {
  return this.ability;
};

Student.prototype.getName = function () {
  return this.name;
};

Student.prototype.getAskedQuestions = function () {
  return this.questionsAsked;
};

Student.prototype.addAskedQuestion = function (question) {
  this.questionsAsked.push(question);
};

module.exports = Student;
