const mongoose = require('mongoose');
const { addressObject } = require('../utils');

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    address: {
      type: addressObject,
      required: true
    },
    status: {
      type: String,
      enum: [
        'Not Processed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
      ],
      default: 'Not Processed'
    },
    total: {
      type: Number,
      min: 0,
      required: true
    },
    productsPrice: {
      type: Number,
      min: 0,
      default: 0
    },
    taxPrice: {
      type: Number,
      min: 0,
      default: 0
    },
    deliveryPrice: {
      type: Number,
      min: 0,
      default: 0
    },
    paymentType: {
      type: String,
      enum: ['card', 'cash'],
      required: true
    },
    StripePaymentId: {
      type: Number,
      required: () => {
        this.paymentType === 'card';
      }
    },
    orderedAt: {
      type: Date,
      default: Date.now()
    },
    deliveredAt: Date
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
