import { StatusCodes } from "http-status-codes";

class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default HttpError;
