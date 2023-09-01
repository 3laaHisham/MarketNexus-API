const { StatusCodes } = require('http-status-codes');

const { productSchema } = require('./cart.schema');
const { HttpError, verifySchema } = require('../../utils');
const { Cart, Product } = require('../../models');

async function addToCart(userId, newProduct) {
  const isValidSchema = await verifySchema(productSchema, newProduct);
  if (!isValidSchema) throw new HttpError(StatusCodes.BAD_REQUEST, 'product schema is not valid');

  const product = await Product.findById(newProduct.id);
  if (!product) throw new HttpError(StatusCodes.NOT_FOUND, 'product is not available');

  const currentCart = await Cart.findOneAndUpdate(
    { userId },
    { $push: { products: newProduct } },
    { new: true }
  );

  return {
    status: StatusCodes.OK,
    message: 'product is added to cart successfully',
    result: currentCart
  };
}

async function changeCountOfProduct(productId, amount, userId) {
  const cart = await Cart.findOneAndUpdate(
    { userId, 'products.id': productId },
    { $inc: { 'products.$.count': amount } },
    { new: true }
  );
  if (!cart) throw new HttpError(StatusCodes.NOT_FOUND, 'No product found to update');

  // Remove products if count = 0
  cart.products = cart.products.filter((product) => product.count > 0);
  await cart.save();

  return {
    status: StatusCodes.OK,
    message: 'product count is updated successfully',
    result: cart
  };
}

async function getCart(userId) {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new HttpError(StatusCodes.NOT_FOUND, 'No carts found');

  return {
    status: StatusCodes.OK,
    message: 'cart is retrieved successfully',
    result: cart
  };
}

async function deleteFromCart(userId, productID) {
  const cart = await Cart.findOne({ userId });

  if (!productID) cart.products = [];
  else cart.products = cart.products.filter((product) => product.id != productID);

  await cart.save();

  return {
    status: StatusCodes.OK,
    message: 'cart is deleted successfully',
    result: cart
  };
}

module.exports = {
  getCart,
  addToCart,
  deleteFromCart,
  changeCountOfProduct
};
