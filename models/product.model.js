import { Schema, model } from "mongoose";

const productSchema = Schema({
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
      "Electronics",
      "Beauty",
      "Sports",
      "Books",
      "Toys",
      "Furniture",
      "Clothes",
    ],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },

  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  avgRating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
});

productSchema.index({
  name: "text",
  description: "text",
});

productSchema.statics.search = (query) =>
  this.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "productId",
  localField: "_id",
});

productSchema.virtual("noInStock", {
  // calculate the number in stock from
});

const Product = model("Product", productSchema);
export default Product;
