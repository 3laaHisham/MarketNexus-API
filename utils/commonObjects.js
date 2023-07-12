const Joi = require('joi');

const addressObject = {
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  flatNumber: {
    type: String,
    required: true
  }
};

const addressJoi = {
  country: Joi.string().required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
  flatNumber: Joi.string().required()
};

module.exports = { addressObject, addressJoi };
