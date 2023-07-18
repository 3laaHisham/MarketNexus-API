const Joi = require('joi');
const { buildSchema, idRegex, featuresFields } = require('../../utils');

const commonFields = {
  name: Joi.string(),
  description: Joi.string(),
  category: Joi.string()
    .valid('Electronics', 'Beauty', 'Sports', 'Books', 'Toys', 'Furniture', 'Clothes')
    .required(),
  price: Joi.number(),
  avgRating: Joi.number(),
  numStock: Joi.number().required(),
  discount: Joi.number()
};

const updateProductSchema = buildSchema({
  color: Joi.array(),
  size: Joi.array(),
  ...commonFields
});

const queryProductsSchema = buildSchema({
  _id: Joi.string().regex(idRegex),
  color: Joi.array(),
  size: Joi.array(),
  ...commonFields,
  ...featuresFields
});

const addProductSchema = buildSchema({
  ...commonFields,
  specification: Joi.object().required(),
  colors: Joi.array().items(Joi.string()).required(),
  sizes: Joi.array().items(Joi.string()).required()
});

module.exports = { queryProductsSchema, updateProductSchema, addProductSchema };
