const { StatusCodes } = require("http-status-codes");
const User = require("../../models");
const { HttpError, verifySchema } = require("../../utils");

const { queryUsersSchema, updateUserSchema } = require("./user.schema");

const getUsers = async (query) => {
  // api features

  let isValidSchema = await verifySchema(queryUsersSchema, query);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Not valid query");

  let users = await User.find(query).populate("reviews");
  if (!users)
    throw new HttpError(StatusCodes.NOT_FOUND, "No users for given filters");

  return {
    status: StatusCodes.OK,
    message: "User retrieved successfully",
    result: users,
  };
};

const updateUser = async (id, body) => {
  let isValidSchema =
    (await verifySchema(queryUsersSchema, id)) &&
    (await verifySchema(updateUserSchema, body));
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Not valid id or schema");

  let updatedUser = await User.findOneAndUpdate(id, body, {
    new: true,
    runValidators: true,
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
  let isValidSchema = await verifySchema(queryUsersSchema, id);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Not Valid Id");

  let user = await User.findOneAndDelete(id);
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, "User not found");

  return {
    status: StatusCodes.OK,
    message: "User deleted successfully",
    result: null,
  };
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
};
