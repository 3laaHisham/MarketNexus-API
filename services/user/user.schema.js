const Joi = require('joi');
const { buildSchema, idRegex, featuresFields } = require('../../utils');

const updateUserSchema = buildSchema({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.number(),
  role: Joi.string().valid('customer', 'seller', 'admin')
});

const queryUsersSchema = buildSchema({
  _id: Joi.string().regex(idRegex),
  ...updateUserSchema._inner.children,
  ...featuresFields
});

module.exports = { queryUsersSchema, updateUserSchema };
