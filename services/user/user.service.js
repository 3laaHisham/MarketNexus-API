import { StatusCodes } from "http-status-codes";
import userModel from "../../models";
import { HttpError, isValid } from "../../utils";

import {
  queryUsersSchema,
  updateUserSchema,
  userIdSchema,
} from "./user.schema";

const getUser = async (id) => {
  let validSchema = await isValid(userIdSchema, id);
  if (!validSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Not Valid Id");

  let user = await userModel.find({ _id: id }).populate("reviews");
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, "User not found");

  return {
    status: StatusCodes.OK,
    message: "User retrieved successfully",
    result: user,
  };
};

const getUsers = async (query) => {
  // api features to limit

  let validSchema = await isValid(queryUsersSchema, query);
  if (!validSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Not valid query");

  let users = await userModel.find(query).populate("reviews");
  if (!users)
    throw new HttpError(StatusCodes.NOT_FOUND, "No users with given filters");

  return {
    status: StatusCodes.OK,
    message: "User retrieved successfully",
    result: users,
  };
};

const updateUser = async (id, body) => {
  let validSchema =
    (await isValid(updateUserSchema, body)) &&
    (await isValid(userIdSchema, id));
  if (!validSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Not valid id or fields");

  let updatedUser = await userModel.findOneAndUpdate(id, body, {
    new: true,
  });
  if (!updatedUser)
    throw new HttpError(StatusCodes.NOT_FOUND, "User not found");

  return {
    status: StatusCodes.OK,
    message: "User updated successfully",
    result: updatedUser,
  };
};

const deleteUser = async (id) => {
  let validSchema = await isValid(userIdSchema, id);
  if (!validSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Not Valid Id");

  let user = await userModel.findOneAndDelete({ _id: id });
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, "User not found");

  return {
    status: StatusCodes.OK,
    message: "User deleted successfully",
    result: null,
  };
};

export default {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
