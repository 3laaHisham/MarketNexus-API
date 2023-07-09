import { StatusCodes } from "http-status-codes";
import User from "../../models";

import {
  HttpError,
  hashPassword,
  generateToken,
  verifyToken,
  verifySchema,
  setRedis,
  delRedis,
} from "../../utils";

import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  userIdSchema,
} from "./auth.schema";

const register = async (body) => {
  let isValidSchema = await verifySchema(registerSchema, body);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Schema not satisfied");

  const isUser = await User.isEmailExist(body.email);
  if (isUser)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Email already taken");

  body.password = await hashPassword(body.password);

  const user = new User(body);
  await user.save();

  return {
    status: StatusCodes.CREATED,
    message: "User created successfully",
    result: user,
  };
};

const login = async (header, body) => {
  if (header.authorization && (await verifyToken(header.authorization)))
    throw new HttpError(StatusCodes.BAD_REQUEST, "Already logged in");

  let isValidSchema = await verifySchema(loginSchema, body);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Schema not satisfied");

  const { email, password } = body;

  const user = await User.isEmailExist(email);
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, "User not found");

  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch)
    throw new HttpError(StatusCodes.UNAUTHORIZED, "Wrong password");

  const token = await generateToken(user.id, role);
  await setRedis(token, "");

  return {
    status: StatusCodes.OK,
    message: "User logged in successfully",
    result: token,
  };
};

const logout = async (id) => {
  // delete token
  let isValidSchema = await verifySchema(userIdSchema, id);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Not valid id");

  await delRedis(id);

  return {
    status: StatusCodes.OK,
    message: "User logged out successfully",
  };
};

const changePassword = async (id, body) => {
  let isValidSchema =
    (await verifySchema(userIdSchema, id)) &&
    (await verifySchema(changePasswordSchema, body));
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Not valid id or schema");

  const user = await User.find(id);
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, "User not found");

  const isPasswordMatch = await user.isPasswordMatch(body.oldPassword);
  if (!isPasswordMatch)
    throw new HttpError(StatusCodes.UNAUTHORIZED, "Wrong password");

  user.password = await hashPassword(body.newPassword);
  await user.save();

  return {
    status: StatusCodes.OK,
    message: "Password changed successfully",
  };
};

export default { register, login, logout, changePassword };
