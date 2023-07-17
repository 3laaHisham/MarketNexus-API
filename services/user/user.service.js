const { StatusCodes } = require('http-status-codes');
const { User } = require('../../models');
const { APIFeatures, HttpError, verifySchema } = require('../../utils');

const { queryUsersSchema, updateUserSchema } = require('./user.schema');

const getUsers = async (query) => {
  const isValidSchema = await verifySchema(queryUsersSchema, query);
  if (!isValidSchema) throw new HttpError(StatusCodes.BAD_REQUEST, 'Not valid query');

  const apiFeatures = APIFeatures(User, query);

  const users = await apiFeatures.query().populate('reviews');
  if (!users) throw new HttpError(StatusCodes.NOT_FOUND, 'No users for given filters');

  const key = Object.assign('user', query);
  await setRedis(key, users);

  return {
    status: StatusCodes.OK,
    message: 'User retrieved successfully',
    result: users
  };
};

const updateUser = async (id, user) => {
  const isValidQuerySchema = await verifySchema(updateUserSchema, user);
  if (!isValidQuerySchema) throw new HttpError(StatusCodes.BAD_REQUEST, 'Not valid schema');

  const updatedUser = await User.findByIdAndUpdate(id, user, {
    new: true,
    runValidators: true
  });
  if (!updatedUser) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  return {
    status: StatusCodes.OK,
    message: 'User updated successfully',
    result: updatedUser
  };
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  return {
    status: StatusCodes.OK,
    message: 'User deleted successfully'
  };
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser
};
