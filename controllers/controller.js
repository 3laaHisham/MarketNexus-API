const { HttpError } = require("./utils");

const controller =
  (res) =>
  (service) =>
  async (...args) => {
    try {
      const result = await service(...args);
      res.send(result);
    } catch (e) {
      console.log(e);
      if (e instanceof HttpError) res.status(e.statusCode).send(e);
      else res.status(500).send(e);
    }
  };

module.exports = controller;
