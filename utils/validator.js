import joi from "joi";

const isValid = async (schema, obj) => {
  const { error } = schema.validate(obj);
  return !error;
};

const buildSchema = (schema) =>
  joi.object(schema).options({ allowUnknown: false });

// MongoDB ID format
const idRegex = new RegExp("^[0-9a-fA-F]{24}$");

export default { isValid, buildSchema, idRegex };
