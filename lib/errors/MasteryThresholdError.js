/**
 * Defines a MasteryThresholdError
 *
 * This error is used to indicate that a user has achieved the mastery threshold and will not be asked more questions.
 */

function MasteryThresholdError(message) {
    this.name = "MasteryThresholdError";
    this.message = (message || "");
}

MasteryThresholdError.prototype = Error.prototype;

module.exports = MasteryThresholdError;