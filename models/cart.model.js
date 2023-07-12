const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true
    },
    products: {
      type: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          price: {
            type: Number,
            required: true
          },
          count: {
            type: Number,
            required: true
          },
          color: String,
          size: String
        }
      ],
      required: true
    }
  },
  { timestamps: true }
);

cartSchema.index({ userId: 1 }, { unique: true });

cartSchema.method.calculateTotal = function () {
  let total = 0;
  for (let i = 0; i < this.products.length; i++)
    total += this.products[i].price * this.products[i].count;

  return total;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
