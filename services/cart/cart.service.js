const { StatusCodes } = require('http-status-codes');

const { cartSchema } = require('./cart.schema');
const { HttpError, verifySchema } = require('../../utils');
const { Cart, Product } = require('../../models');

async function addToCart(userId, newProduct) {
  const isValidSchema = await verifySchema(cartSchema, newProduct);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'product schema is not valid');

  const product = await Product.findById(newProduct._id);
  if (!product)
    throw new HttpError(StatusCodes.NOT_FOUND, 'product is not available');

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
  if (!cart)
    throw new HttpError(StatusCodes.NOT_FOUND, 'No product found to update');

  // Remove products if count = 0
  cart.products.filter(
    (product) => product.id == productId && product.count == 0
  );

  return {
    status: StatusCodes.OK,
    message: 'product count is updated successfully',
    result: cart
  };
}

async function getCart(userId) {
  const cart = await Cart.find({ userId });
  if (!cart) throw new HttpError(StatusCodes.NOT_FOUND, 'No carts found');

  return {
    status: StatusCodes.OK,
    message: 'cart is retrieved successfully',
    result: cart
  };
}

async function emptyCart(userId) {
  const cart = await Cart.findOneAndUpdate({ userId }, { products: [] });
  if (!cart)
    throw new HttpError(StatusCodes.NOT_FOUND, 'No carts found to be deleted');

  return {
    status: StatusCodes.OK,
    message: 'cart is deleted successfully',
    result: cart
  };
}

async function deleteFromCart(productID, userId) {
  const cart = await Cart.findOneAndUpdate(
    { userId, 'products.id': productID },
    { $pull: { products: { id: productID } } },
    { new: true }
  );
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
  changeCountOfProduct,
  emptyCart
};
