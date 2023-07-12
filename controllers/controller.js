const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('../utils');

const controller =
  (res) =>
  (service) =>
  async (...args) => {
    try {
      const result = await service(...args);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      console.log(error);

      if (error instanceof HttpError)
        res.status(error.statusCode).json(error.message);
      else res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  };

module.exports = controller;
