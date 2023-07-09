import { Schema, model } from "mongoose";

const productSchema = Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    specification: {
      type: Object,
      required: true,
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
    colors: Array,
    sizes: Array,
    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    noStock: {
      type: Number,
      required: true,
      min: 0,
    },
    noSold: {
      type: Number,
      default: 0,
    },
    noViews: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index(
  {
    name: "text",
    description: "text",
  },
  { weights: { name: 2, description: 1 } }
);

// Full test search using index
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

const Product = model("Product", productSchema);
export default Product;
