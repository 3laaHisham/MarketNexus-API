import Joi from "joi";

const verifySchema = async (schema, obj) => {
  const { error } = schema.validate(obj);
  return !error;
};

const buildSchema = (schema) =>
  Joi.object(schema).options({ allowUnknown: false });

// MongoDB ID format
const idRegex = new RegExp("^[0-9a-fA-F]{24}$");

const featuresFields = {
  sort: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
};

export default { verifySchema, buildSchema, idRegex, featuresFields };
