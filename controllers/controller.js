const controller =
  (service) =>
  (...args) =>
  async (req, res, next) => {
    try {
      const result = await service(...args);
      res.status(StatusCodes.OK).send(result);
    } catch (e) {
      next(e);
    }
  };

export default controller;
