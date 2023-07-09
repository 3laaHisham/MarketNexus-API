import Joi from "joi";
import { buildSchema, idRegex } from "../../utils";

const userIdSchema = buildSchema({
  _id: Joi.string().regex(idRegex).required(),
});

const registerSchema = buildSchema({
  name: Joi.string().required(),
  email: Joi.email().required(),
  password: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.number().required(),
  role: Joi.string().valid("customer", "seller", "admin").required(),
  isCompany: Joi.boolean().when("role", {
    is: "seller",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

const loginSchema = buildSchema({
  email: Joi.email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = buildSchema({
  password: Joi.string().required(),
  newPassword: Joi.string().required(),
  newPasswordConfirm: Joi.string().required(),
});

export default {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  userIdSchema,
};
