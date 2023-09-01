const Joi = require('joi');
const { buildSchema, idRegex, featuresFields } = require('../../utils');

const createOrderSchema = buildSchema({
  discount: Joi.number().min(0).max(100),
  taxPrice: Joi.number().min(0),
  deliveryPrice: Joi.number().min(0),
  paymentType: Joi.string().valid('card', 'cash').required(),
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

  _id: Joi.string().regex(idRegex),
  userId: Joi.string().regex(idRegex),
  status: Joi.string()
    .valid('Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
    .default('Not Processed'),
  deliveredAt: Joi.date()
});

module.exports = { createOrderSchema, updateOrderSchema, queryOrdersSchema };
