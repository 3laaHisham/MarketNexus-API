import { HttpError } from "./utils";
import { StatusCodes } from "http-status-codes";

const controller =
  (res) =>
  (service) =>
  async (...args) => {
    try {
      // return result of service is { }
      const { statusCode, message, output } = await service(...args);
      res.status(statusCode).json({ statusCode, message, output });
    } catch (e) {
      console.log(e);
      if (e instanceof HttpError) res.status(e.statusCode).send(e);
      else res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
    }
  };

export default controller;
