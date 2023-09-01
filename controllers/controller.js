const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('../utils');

const controller =
  (res, session) =>
  (service) =>
  async (...args) => {
    try {
      const result = await service(...args);
      if (session && result.token) session.token = result.token;

      res.status(result.status).json(result);
    } catch (error) {
      // console.log(error);

      if (error instanceof HttpError) res.status(error.statusCode).send(error.message);
      else res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
    }
  };

module.exports = controller;
