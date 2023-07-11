const Joi = require('joi');

const verifySchema = async (schema, obj) => {
  const { error } = schema.validate(obj);
  return !error;
};

const buildSchema = (schema) =>
  Joi.object(schema).options({ allowUnknown: false });

// MongoDB ID format
const idRegex = /^[0-9a-fA-F]{24}$/;

const featuresFields = {
  select: Joi.string(),
  sort: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
  search: Joi.string()
};

module.exports = { verifySchema, buildSchema, idRegex, featuresFields };
