const { StatusCodes } = require('http-status-codes');
const { User, Cart } = require('../../models');
const mailer = require('../../utils/mailer');

const {
  HttpError,
  generateToken,
  verifyToken,
  verifySchema,
  putRedis,
  getRedis,
  delRedis
} = require('../../utils');

const { registerSchema, loginSchema, changePasswordSchema } = require('./auth.schema');

const register = async (userDetails) => {
  const isValidSchema = await verifySchema(registerSchema, userDetails);
  if (!isValidSchema) throw new HttpError(StatusCodes.BAD_REQUEST, 'Schema not satisfied');

  const { email } = userDetails;

  const isUser = await User.findOne({ email });
  if (isUser) throw new HttpError(StatusCodes.BAD_REQUEST, 'Email already taken');

  const newUser = new User(userDetails);
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
  const tokenExist = token ? await getRedis(token) : undefined;
  const isLogged = tokenExist ? await verifyToken(token) : undefined;
  if (isLogged) throw new HttpError(StatusCodes.BAD_REQUEST, 'Already logged in');

  const isValidSchema = await verifySchema(loginSchema, userDetails);
  if (!isValidSchema) throw new HttpError(StatusCodes.BAD_REQUEST, 'Schema not satisfied');

  const { email, password } = userDetails;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch) throw new HttpError(StatusCodes.UNAUTHORIZED, 'Wrong password');

  const newToken = await generateToken(user.id, user.role);
  await putRedis(newToken, newToken);

  return {
    status: StatusCodes.OK,
    message: 'User logged in successfully',
    token: newToken
  };
};

const logout = async (session) => {
  await delRedis(session.token);
  session.destroy();

  return {
    status: StatusCodes.OK,
    message: 'User logged out successfully'
  };
};

const changePassword = async (id, newUser) => {
  const isValidSchema = await verifySchema(changePasswordSchema, newUser);
  if (!isValidSchema) throw new HttpError(StatusCodes.BAD_REQUEST, 'Not valid schema');

  const user = await User.findById(id).select('+password');
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  const isPasswordMatch = await user.isPasswordMatch(newUser.oldPassword);
  if (!isPasswordMatch) throw new HttpError(StatusCodes.UNAUTHORIZED, 'Wrong password');

  user.password = newUser.newPassword;
  await user.save();

  return {
    status: StatusCodes.OK,
    message: 'Password changed successfully'
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  const resetToken = await user.generateResetPasswordToken();
  await user.save();

  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
  await mailer.sendMail(user.email, 'Reset Password', `Click here to reset your password: ${resetLink}`);

  return {
    status: StatusCodes.OK,
    message: 'Reset password email sent'
  };
};

const confirmSignup = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  const confirmToken = await user.generateConfirmationToken();
  await user.save();

  const confirmLink = `http://localhost:3000/confirm-signup/${confirmToken}`;
  await mailer.sendMail(user.email, 'Confirm Signup', `Click here to confirm your signup: ${confirmLink}`);

  return {
    status: StatusCodes.OK,
    message: 'Confirmation email sent'
  };
};

module.exports = { register, login, logout, changePassword, forgotPassword, confirmSignup };
