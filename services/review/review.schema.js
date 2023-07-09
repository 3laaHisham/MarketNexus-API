
import joi from "joi";
import buildSchema from "../../utils/validator";



const reviewSchema = buildSchema({

    userId: Joi.string().required(),
    productId: Joi.string().required(),
    message: Joi.string().required(),
    date: Joi.date().required(),
    noOfStars: Joi.number().integer().min(1).max(5).required()


});

module.exports = {
    reviewSchema
};
