/**
 * Defines a ParameterError
 */

function ParameterError(message) {
  this.name = "ParameterError";
  this.message = (message || "");
}

ParameterError.prototype = Error.prototype;

module.exports = ParameterError;