const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    message: {
        type: String,
        minLength: 2,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        require: true

    },
    updatedAt: {
        type: Date,
    },
    numberOfStars: {
        type: Number,
        min: 0,
        maxlength: 5
    }
});
const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;

