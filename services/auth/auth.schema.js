const Joi = require('joi');
const { buildSchema, addressJoi } = require('../../utils');

const registerSchema = buildSchema({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  address: Joi.object(addressJoi).required(),
  phone: Joi.number().required(),
  role: Joi.string().valid('customer', 'seller', 'admin').required(),
  isCompany: Joi.boolean().when('role', {
    is: 'seller',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

const loginSchema = buildSchema({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const changePasswordSchema = buildSchema({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  newPasswordConfirm: Joi.string().valid(Joi.ref('newPassword')).required()
});

// how to validate a field equal another field in Joi with nodejs?

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema
};
