/**
 * Custom error for use in the core.
 */
function MultipleCorrectAnswersError(message) {
  this.message = message;
}

MultipleCorrectAnswersError.prototype = new Error();


module.exports = MultipleCorrectAnswersError;
