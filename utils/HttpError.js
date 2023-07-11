const { StatusCodes } = require('http-status-codes');

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = HttpError;
