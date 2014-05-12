/**
 * Represents a student's response
 */

var StudentResponse = function (question, answeredCorrectly, abilityLevel) {

  // TODO: Add some checking and error handling here.
  // TODO: Possibly add a few more methods.

  // The question that was asked.
  this.question = question;
  // Was the question properly answered?
  this.answeredCorrectly = answeredCorrectly;
  // The student's ability at the time it was answered.
  this.abilityLevel = abilityLevel;
};

module.exports = StudentResponse;
