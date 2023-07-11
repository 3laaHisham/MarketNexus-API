const authService = require('./auth/auth.service');
const userService = require('./user/user.service');
const productService = require('./product/product.service');
const reviewService = require('./review/review.service');
const cartService = require('./cart/cart.service');
const orderService = require('./order/order.service');

module.exports = {
  authService,
  userService,
  productService,
  reviewService,
  cartService,
  orderService
};
