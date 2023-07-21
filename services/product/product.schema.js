const Joi = require('joi');
const { buildSchema, idRegex, featuresFields } = require('../../utils');

const categories = ['Electronics', 'Beauty', 'Sports', 'Books', 'Toys', 'Furniture', 'Clothes'];

const updateProductSchema = buildSchema({
  name: Joi.string(),
  description: Joi.string(),
  category: Joi.string().valid(...categories),
  price: Joi.number(),
  numStock: Joi.number(),
  discount: Joi.number(),

  colors: Joi.array().when('category', {
    not: Joi.valid('Electronics', 'Toys', 'Furniture', 'Clothes'),
    then: Joi.forbidden()
  }),
  sizes: Joi.array().when('category', {
    not: 'Clothes',
    then: Joi.forbidden()
  })
});

const queryProductsSchema = buildSchema({
  _id: Joi.string().regex(idRegex),
  name: Joi.string(),
  description: Joi.string(),
  category: Joi.string(),

  colors: Joi.alternatives().try(Joi.string(), Joi.array()),
  sizes: Joi.alternatives().try(Joi.string(), Joi.array()),
  price: Joi.alternatives().try(Joi.number(), Joi.object()),
  numStock: Joi.alternatives().try(Joi.number(), Joi.object()),
  avgRating: Joi.alternatives().try(Joi.number().min(0).max(5), Joi.object()),

  ...featuresFields
});

const addProductSchema = buildSchema({
  seller: Joi.string().regex(idRegex).required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  specification: Joi.object().required(),
  price: Joi.number().required(),
  numStock: Joi.number().required(),
  category: Joi.string()
    .valid(...categories)
    .required(),

  colors: Joi.array().when('category', {
    is: Joi.valid('Electronics', 'Toys', 'Furniture', 'Clothes'),
    then: Joi.array().required(),
    otherwise: Joi.forbidden()
  }),
  sizes: Joi.array().when('category', {
    is: 'Clothes',
    then: Joi.array().required(),
    otherwise: Joi.forbidden()
  })
});

module.exports = { queryProductsSchema, updateProductSchema, addProductSchema };
