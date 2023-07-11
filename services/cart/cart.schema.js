const Joi = require('joi');
const { buildSchema } = require('../../utils');

const orderSchema = buildSchema({
  userId: Joi.string().required(),
  products: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        price: Joi.number().required(),
        color: Joi.string().required(),
        size: Joi.string().required(),
        count: Joi.number().required()
      })
    )
    .required()
});

module.exports = { orderSchema };
