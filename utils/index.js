const { hashPassword, comparePasswords } = require('./hash');
const HttpError = require('./HttpError');
const { generateToken, verifyToken } = require('./jwt');
const { verifySchema, buildSchema, idRegex, featuresFields } = require('./validator');
const { putRedis, getRedis, delRedis, clearRedis, keyGenerator } = require('./redis');
const { addressObject, addressJoi } = require('./commonObjects');
const APIFeatures = require('./apiFeatures');
const { nodemailerFunction1, nodemailerFunction2 } = require('./mailer');
const { nodemailerFunction1 } = require('./mailer');

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
  putRedis,
  delRedis,
  getRedis,
  clearRedis,
  keyGenerator,
  addressObject,
  addressJoi,
  nodemailerFunction1,
  nodemailerFunction2
};
