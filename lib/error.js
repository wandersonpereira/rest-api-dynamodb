/**
 * Format error
 * @param message
 */
module.exports = (message) => {
    this.code = 400;
    this.message = message;
    this.name = "ResponseException";
};