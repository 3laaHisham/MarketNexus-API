import Joi from "joi";
import { buildSchema, idRegex } from "../../utils";

const queryUsersSchema = buildSchema({
  name: Joi.string(),
  email: Joi.email(),
  phone: Joi.number(),
  role: Joi.string().valid("customer", "seller", "admin"),
  company: Joi.string(),
});

const updateUserSchema = buildSchema({
  ...queryUsersSchema._inner.children,
  adderess: Joi.array().items(Joi.string()),

  _id: Joi.forbidden(),
  password: Joi.forbidden(),
});

const userIdSchema = buildSchema({
  id: Joi.string().regex(idRegex).required(),
});

export default { queryUsersSchema, updateUserSchema, userIdSchema };
