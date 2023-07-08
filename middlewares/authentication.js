import { verifyToken } from "../utils";
import { StatusCodes } from "http-status-codes";

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    let decoded = token ? await verifyToken(token) : undefined;

    if (decoded) {
      req.user = decoded;
      next();
    }

    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthenticated" });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error" });
  }
};

export default isAuthenticated;
