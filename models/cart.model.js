const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    product: [{
        type: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            count: Number,
            color: String,
            size: String
        }

    }]
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;