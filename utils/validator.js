import { validate as _validate, object } from "joi";

// write a method for joi validation and handle errors
const isValid = async (schema, obj) => {
  const { error } = _validate(obj, schema);
  return !error;
};

const buildSchema = (schema) => object(schema).options({ abortEarly: false });

// MongoDB ID format
const idExpression = new RegExp("^[0-9a-fA-F]{24}$");

/* Exports */
export default { isValid, buildSchema, idExpression };
