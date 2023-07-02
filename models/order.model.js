const mongoose = require("mongoose");
const {func} = require("joi");
const {addressObject} = require("../utils/commonObjects");

const orderSchema = mongoose.Schema({

        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart"
        },
        discount: {
            type: Number,
            validate: {
                validator: function (value) {
                    return value <= 100 || value >= 0;
                }
            }
        },
        total: {
            type: Number,
            validate: {
                validator: function (value) {
                    return value >= 0
                },
                message: 'total price  must be a non-negative number.'
            },

        },
        address: [addressObject],
        orderType: String,
        isDelivered: Boolean,
        status: String,
        servicePrice: Number,
        taxPrice: Number,
        deliveryPrice: Number,
        PaymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment"
        },
        deliveredAt: Date,


        isPaid: Boolean
    }
);