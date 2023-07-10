const Joi = require("joi");
const { buildSchema, addressObject } = require("../../utils");

const orderSchema = buildSchema({
  userID: Joi.string().required(),
  products: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        color: Joi.string().required(),
        size: Joi.string().required(),
        count: Joi.number().required(),
      })
    )
    .required(),
  discount: Joi.number().min(0).max(100).allow(null),
  total: Joi.number()
    .min(0)
    .required()
    .error(new Error("Total price must be a non-negative number.")),
  // address: Joi.array().items(addressObject).required(), fix
  status: Joi.string()
    .valid("Not Processed", "Processing", "Shipped", "Delivered", "Cancelled")
    .default("Not Processed"),
  productPrice: Joi.number().required(),
  taxPrice: Joi.number().required(),
  deliveryPrice: Joi.number().required(),
  paymentType: Joi.string().valid("card", "cash").default("cash"),
  StripePaymentId: Joi.when("paymentType", {
    is: "card",
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null),
  }),
  deliveredAt: Joi.date().allow(null),
  orderedAt: Joi.date().required(),
});

module.exports = {
  orderSchema,
};
