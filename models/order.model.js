const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({

    cart: {
        type: mongoose.Schema.Types.ObjectId
        ref: "Cart"
    }
    dicount: {
        type: Number,
        validate: {
            validator: function (value) {
                return undefined;
            }
        }
    }


});