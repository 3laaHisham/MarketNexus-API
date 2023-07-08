import { HttpError } from "./utils";
import { StatusCodes } from "http-status-codes";

const controller =
  (res) =>
  (service) =>
  async (...args) => {
    try {
      const result = await service(...args);
      res.status(StatusCodes.OK).send(result);
    } catch (e) {
      console.log(e);
      if (e instanceof HttpError) res.status(e.statusCode).send(e);
      else res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
    }
  };

export default controller;
