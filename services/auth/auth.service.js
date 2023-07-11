const { StatusCodes } = require('http-status-codes');
const User = require('../../models');

const {
  HttpError,
  hashPassword,
  generateToken,
  verifyToken,
  verifySchema,
  setRedis,
  delRedis
} = require('../../utils');

const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  userIdSchema
} = require('./auth.schema');

const register = async (user) => {
  const isValidSchema = await verifySchema(registerSchema, user);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Schema not satisfied');

  const isUser = await User.isEmailExist(user.email);
  if (isUser)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Email already taken');

  user.password = await hashPassword(user.password);

  const user = new User(user);
  await user.save();

  return {
    status: StatusCodes.CREATED,
    message: 'User created successfully',
    result: user
  };
};

const login = async (token, user) => {
  const isLogged = token ? await verifyToken(token) : undefined;
  if (isLogged)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Already logged in');

  const isValidSchema = await verifySchema(loginSchema, user);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Schema not satisfied');

  const { email, password } = user;

  const user = await User.isEmailExist(email);
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch)
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Wrong password');

  const newToken = await generateToken(user._id, role);
  await setRedis(newToken, newToken);

  return {
    status: StatusCodes.OK,
    message: 'User logged in successfully',
    result: newToken
  };
};

const logout = async (id) => {
  await delRedis(id);

  return {
    status: StatusCodes.OK,
    message: 'User logged out successfully'
  };
};

const changePassword = async (id, user) => {
  const isValidSchema = await verifySchema(changePasswordSchema, user);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Not valid schema');

  const user = await User.findById(id);
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  const isPasswordMatch = await user.isPasswordMatch(user.oldPassword);
  if (!isPasswordMatch)
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Wrong password');

  user.password = await hashPassword(user.newPassword);
  await user.save();

  return {
    status: StatusCodes.OK,
    message: 'Password changed successfully'
  };
};

module.exports = { register, login, logout, changePassword };
