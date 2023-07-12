const { StatusCodes } = require('http-status-codes');
const { User, Cart } = require('../../models');

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
  changePasswordSchema
} = require('./auth.schema');

const register = async (user) => {
  const isValidSchema = await verifySchema(registerSchema, user);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Schema not satisfied');

  const isUser = await User.isEmailExist(user.email);
  if (isUser)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Email already taken');

  user.password = await hashPassword(user.password);

  const newUser = new User(user);
  await newUser.save();

  const userCart = new Cart({
    userId: newUser._id,
    products: []
  });
  await userCart.save();

  return {
    status: StatusCodes.CREATED,
    message: 'User created successfully',
    result: newUser
  };
};

const login = async (token, userDetails) => {
  const isLogged = token ? await verifyToken(token) : undefined;
  if (isLogged)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Already logged in');

  const isValidSchema = await verifySchema(loginSchema, userDetails);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Schema not satisfied');

  const { email, password } = userDetails;

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

const changePassword = async (id, newUser) => {
  const isValidSchema = await verifySchema(changePasswordSchema, newUser);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Not valid schema');

  const user = await User.findById(id);
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  const isPasswordMatch = await user.isPasswordMatch(newUser.oldPassword);
  if (!isPasswordMatch)
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Wrong password');

  user.password = await hashPassword(user.newUser);
  await user.save();

  return {
    status: StatusCodes.OK,
    message: 'Password changed successfully'
  };
};

module.exports = { register, login, logout, changePassword };
