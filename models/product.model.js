const { Schema, model } = require('mongoose');

const productSchema = Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50
    },
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    specification: {
      type: Object,
      required: true
    },
    category: {
      type: String,
      enum: ['Electronics', 'Beauty', 'Sports', 'Books', 'Toys', 'Furniture', 'Clothes'],
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    colors: {
      type: Array,
      validate(value) {
        const categories = ['Electronics', 'Toys', 'Furniture', 'Clothes'];
        const inCategories = categories.includes(this.category);

        return value.length == 0 ? !inCategories : inCategories; // both exist or none
      }
    },
    sizes: {
      type: Array,
      validate(value) {
        const inCategories = this.category === 'Clothes';

        return value.length == 0 ? !inCategories : inCategories; // both exist or none
      }
    },
    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    numStock: {
      type: Number,
      required: true,
      min: 0
    },
    numSold: {
      type: Number,
      default: 0
    },
    numViews: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.index(
  {
    name: 'text',
    description: 'text'
  },
  { weights: { name: 2, description: 1 } }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'productId',
  localField: '_id'
});

const Product = model('Product', productSchema);

module.exports = Product;
