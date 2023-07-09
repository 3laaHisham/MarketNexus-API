import { StatusCodes } from "http-status-codes";

const errorHandler = (error, req, res, next) => {
  console.log(error);

  if (error instanceof HttpError) res.status(error.statusCode).send(error);
  else res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
};

export default errorHandler;
