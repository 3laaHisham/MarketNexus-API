const { hashPassword, comparePasswords } = require('./hash');
const HttpError = require('./HttpError');
const { generateToken, verifyToken } = require('./jwt');
const {
  verifySchema,
  buildSchema,
  idRegex,
  featuresFields
} = require('./validator');
const { setRedis, getRedis, delRedis } = require('./redis');
const { addressObject, addressJoi } = require('./commonObjects');
const APIFeatures = require('./apiFeatures');

module.exports = {
  APIFeatures,
  HttpError,
  hashPassword,
  comparePasswords,
  generateToken,
  verifyToken,
  verifySchema,
  buildSchema,
  idRegex,
  featuresFields,
  setRedis,
  delRedis,
  getRedis,
  addressObject,
  addressJoi
};
