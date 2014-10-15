/**
 * Defines a MaxQuestionsError
 *
 * This error is used to indicate that a test has asked the maximum number of questions.
 */

function MaxQuestionsError(message) {
    this.name = "MaxQuestionsError";
    this.message = (message || "");
}

MaxQuestionsError.prototype = Error.prototype;

module.exports = MaxQuestionsError;