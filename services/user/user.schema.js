const Joi = require('joi');
const { buildSchema, idRegex, featuresFields } = require('../../utils');

const commonFields = {
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.number(),
  role: Joi.string().valid('customer', 'seller', 'admin')
};

const updateUserSchema = buildSchema(commonFields);

const queryUsersSchema = buildSchema({
  _id: Joi.string().regex(idRegex),
  ...commonFields,
  ...featuresFields
});

module.exports = { queryUsersSchema, updateUserSchema };
