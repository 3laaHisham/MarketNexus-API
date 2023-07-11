const Joi = require('joi');
const { buildSchema, idRegex, featuresFields } = require('../../utils');

const createOrderSchema = buildSchema({
  userId: Joi.string().regex(idRegex).required(),
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
    .required(),
  discount: Joi.number().min(0).max(100),
  address: Joi.array()
    .items({
      country: Joi.string().required(),
      city: Joi.string().required(),
      street: Joi.string().required(),
      flatNumber: Joi.string().required()
    })
    .required(),
  status: Joi.string()
    .valid('Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
    .default('Not Processed'),
  total: Joi.number().min(0).required(),
  productsPrice: Joi.number().min(0).required(),
  taxPrice: Joi.number().min(0).required(),
  deliveryPrice: Joi.number().min(0).required(),
  paymentType: Joi.string().valid('card', 'cash').default('cash'),
  StripePaymentId: Joi.when('paymentType', {
    is: 'card',
    then: Joi.string().required(),
    otherwise: Joi.string()
  }),

  orderedAt: Joi.date().forbidden(),
  deliveredAt: Joi.date().forbidden()
});

const updateOrderSchema = buildSchema({
  status: Joi.string()
    .valid('Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
    .default('Not Processed'),
  deliveredAt: Joi.date()
});

const queryOrdersSchema = buildSchema({
  ...featuresFields,
  userId: Joi.string().regex(idRegex).required(),
  status: Joi.string()
    .valid('Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
    .default('Not Processed'),
  deliveredAt: Joi.date()
});

module.exports = { createOrderSchema, updateOrderSchema, queryOrdersSchema };
