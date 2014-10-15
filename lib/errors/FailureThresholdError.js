/**
 * Defines a FailureThresholdError
 *
 * This error is used to indicate that a user has reached the failure threshold and will not be asked more questions.
 */

function FailureThresholdError(message) {
    this.name = "FailureThresholdError";
    this.message = (message || "");
}

FailureThresholdError.prototype = Error.prototype;

module.exports = FailureThresholdError;