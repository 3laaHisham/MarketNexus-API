const { StatusCodes } = require('http-status-codes');

const cartSchema = require('./cart.schema');
const { HttpError, verifySchema } = require('../../utils');
const { Cart, Product } = require('../../models');

async function createNewCart(userId) {
  const newCart = new Cart({
    userId: userId,
    products: []
  });
  const savedCart = await newCart.save();

  return savedCart;
}

async function isAvailable(productID, color, size) {
  const product = await Product.findOne({
    _id: productID,
    'product.color': color,
    'product.size': size
  });

  return product;
}

async function addProduct(userId, newProduct) {
  if (await !verifySchema(cartSchema, newProduct))
    throw new HttpError(StatusCodes.BAD_REQUEST, 'product is not valid');
  if (await !isAvailable(product.id, product.color, product.size))
    throw new HttpError(StatusCodes.NOT_FOUND, 'product is not available');

  //start transaction

  const currentCart = await Cart.findByIdAndUpdate(
    userId,
    { $push: newProduct },
    { new: true }
  );

  if (!currentCart) currentCart = await createNewCart(userId);

  currentCart = await Cart.findByIdAndUpdate(
    userId,
    { $push: newProduct }, // push where?
    { new: true }
  );
  if (!currentCart) {
    //TODO
    await returnProduct(product.id, product.color, product.size);
    throw new HttpError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'product can not be added to the cart'
    );
  }
  return {
    status: StatusCodes.OK,
    message: 'product is added to cart successfully',
    result: currentCart
  };
}
async function changeCountOfProduct(productId, amount, userId) {
  const updatedCart = await Cart.findOneAndUpdate(
    { userId: userId, 'product.id': productId },
    { $inc: { 'product.$.count': amount } },
    { new: true }
  );

  if (!updatedCart)
    throw new HttpError(
      StatusCodes.NOT_FOUND,
      'product is not found in the cart. Count update failed '
    );

  return {
    status: StatusCodes.OK,
    message: 'product count is updated successfully',
    result: updatedCart
  };
}
async function getCurrentCart(userId) {
  const cart = await Cart.find({ userId: userId });
  if (!cart) throw new HttpError(StatusCodes.NOT_FOUND, 'No carts found');

  return {
    status: StatusCodes.OK,
    message: 'cart is retrieved successfully',
    result: cart
  };
}
async function deleteCurrentCart(userId) {
  const cart = await Cart.deleteOne({ userId: userId });
  if (!cart)
    throw new HttpError(StatusCodes.NOT_FOUND, 'No carts found to be deleted');

  return {
    status: StatusCodes.OK,
    message: 'cart is deleted successfully',
    result: cart
  };
}

async function deleteProduct(productID, userId) {
  //TODO
  return {
    status: StatusCodes.OK,
    message: 'cart is deleted successfully',
    result: cart
  };
}

module.exports = {
  getCurrentCart,
  addProduct,
  deleteCurrentCart,
  changeCountOfProduct,
  deleteProduct
};
