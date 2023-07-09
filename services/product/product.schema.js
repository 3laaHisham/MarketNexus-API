import Joi from "joi";
import { buildSchema, idRegex, featuresFields } from "../../utils";

const commonFields = {
  name: Joi.string(),
  description: Joi.string(),
  category: Joi.string()
    .valid(
      "Electronics",
      "Beauty",
      "Sports",
      "Books",
      "Toys",
      "Furniture",
      "Clothes"
    )
    .required(),
  price: Joi.number(),
  avgRating: Joi.number(),
  noStock: Joi.number().required(),
  discount: Joi.number(),
};

const queryProductsSchema = buildSchema({
  _id: Joi.string().regex(idRegex),
  ...updateProductSchema._inner.children,
  ...featuresFields,
});

const updateProductSchema = buildSchema({
  ...commonFields,
  color: Joi.string(),
  size: Joi.string(),
});

const addProductSchema = buildSchema({
  ...commonFields,
  seller: Joi.string().regex(idRegex).required(),
  specification: Joi.object().required(),
  colors: Joi.array().items(Joi.string()).required(),
  sizes: Joi.array().items(Joi.string()).required(),
});

export default { queryProductsSchema, updateProductSchema, addProductSchema };
