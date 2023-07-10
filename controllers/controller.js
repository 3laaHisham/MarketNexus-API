const controller =
  (res) =>
  (service) =>
  async (...args) => {
    try {
      const result = await service(...args);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      console.log(error);

      if (error instanceof HttpError) res.status(error.statusCode).send(error);
      else res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

module.exports = controller;
