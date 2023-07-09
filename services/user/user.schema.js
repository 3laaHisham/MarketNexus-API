import Joi from "joi";
import { buildSchema, idRegex } from "../../utils";

const queryUsersSchema = buildSchema({
  _id: Joi.string().regex(idRegex),
  ...updateUserSchema._inner.children,
});

const updateUserSchema = buildSchema({
  name: Joi.string(),
  email: Joi.email(),
  phone: Joi.number(),
  role: Joi.string().valid("customer", "seller", "admin"),
});

export default { queryUsersSchema, updateUserSchema };
