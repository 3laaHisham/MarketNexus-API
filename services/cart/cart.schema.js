const Joi = require("joi");
const { buildSchema } = require("../../utils");

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
        ).required(),


});
