const Joi = require('joi');
const { buildSchema } = require('../../utils');

const cartSchema = buildSchema({
  userId: Joi.string().required(),
  products: Joi.array()
    .items(
      Joi.object({
        id: Joi.object().required(),
        price: Joi.number().required(),
        count: Joi.number().required(),
        color: Joi.string(),
        size: Joi.string()
      })
    )
    .required()
});
const productSchema = buildSchema({
  id: Joi.string().required(),
  price: Joi.number().required(),
  count: Joi.number().required(),
  color: Joi.string(),
  size: Joi.string()
});
module.exports = { cartSchema, productSchema };
