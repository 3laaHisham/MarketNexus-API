const mongoose = require("mongoose");
const { func } = require("joi");
const { addressObject } = require("../utils/commonObjects");

const orderSchema = mongoose.Schema({
    userID:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    products: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        color: String,
        size: String,
        count: Number
    }],
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
            message: 'Total price  must be a non-negative number.'
        },

    },
    address: [addressObject],
    status: {
        type: String,
        enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: "Not Processed"
    },
    productPrice: Number,
    taxPrice: Number,
    deliveryPrice: Number,
    paymentType: {
        type: String,
        enum: ["card", "cash"],
        default: "cash"
    },
    StripePaymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: () => {
            this.paymentType === "card"
        }
    },
    deliveredAt: Date,
    ordereddAt: Date,
}
);