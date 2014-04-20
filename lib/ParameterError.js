/**
 * Custom parameter error for use in the core.
 */
function ParameterError(message) {
  this.message = message;
}

ParameterError.prototype = new Error();


module.exports = ParameterError;
