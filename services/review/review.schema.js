const Joi = require('joi');
const {
  buildSchema,
  idRegex,
  featuresFields
} = require('../../utils/validator');

const createReviewSchema = buildSchema({
  message: Joi.string().required(),
  numStars: Joi.number().integer().min(1).max(5).required(),

  date: Joi.date().forbidden()
});

const queryReviewSchema = buildSchema({
  ...featuresFields,
  userId: Joi.string().regex(idRegex),
  productId: Joi.string().regex(idRegex),
  numStars: Joi.number().integer().min(1).max(5)
});

module.exports = {
  createReviewSchema,
  queryReviewSchema
};
