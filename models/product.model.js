const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "electronics",
      "fashion",
      "appliances",
      "beauty",
      "sports",
      "books",
      "toys",
      "others",
    ],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    number: {
      type: Number,
      default: 0,
    },
  },
});

productSchema.index({
  name: "text",
  description: "text",
});

productSchema.methods.addReview = (reviewID) => {
  this.findByIdAndUpdate(productId, { $push: { reviews: reviewID } });
};

productSchema.statics.search = (query) =>
  postModel.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  );

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
