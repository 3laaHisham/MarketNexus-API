const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    message: {
      type: String,
      minLength: 2,
      maxlength: 500
    },
    date: {
      type: Date,
      default: Date.now(),
      required: true
    },
    numStars: {
      type: Number,
      min: 0,
      max: 5,
      required: true
    }
  },
  { timestamps: true }
);

reviewSchema.index({ productId: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
