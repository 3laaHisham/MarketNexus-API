const { StatusCodes } = require('http-status-codes');

const { createOrderSchema, updateOrderSchema, queryOrdersSchema } = require('./order.schema');
const { APIFeatures, HttpError, verifySchema } = require('../../utils');
const { Order, Cart, Product, User } = require('../../models');

async function createNewOrder(userId, order) {
  const cart = await Cart.findOne({ userId });
  let { products } = cart;

  const user = await User.findById(userId);
  let { address } = user;

  // get StripePaymentId

  const orderDetails = {
    userId,
    products,
    address,
    date: Date.now(),
    status: 'Not Processed',
    ...order
  };

  const isOrderValid = await verifySchema(createOrderSchema, order);
  if (!isOrderValid) throw new HttpError(StatusCodes.BAD_REQUEST, 'Order fields are not valid');

  // Empty Cart
  await cart.updateOne({ products: [] });

  // Check if product is available & update its stock
  for (let i = 0; i < order.products.length; i++) {
    let productDetails = order.products[i];
    let product = await Product.findById(productDetails.id);

    if (product.numStock == 0)
      throw new HttpError(StatusCodes.NOT_ACCEPTABLE, `${product.id} is not available`);
    else
      await product.updateOne({
        $inc: {
          numSold: productDetails.count,
          numStock: -productDetails.count
        }
      });
  }

  const newOrder = new Order(orderDetails);
  const savedOrder = await newOrder.save();

  return {
    status: StatusCodes.OK,
    message: 'Order created successfully',
    result: savedOrder
  };
}

async function getAllOrders(query) {
  console.log("********************", query)
  const isOrderValid = await verifySchema(queryOrdersSchema, query);
  if (!isOrderValid) throw new HttpError(StatusCodes.BAD_REQUEST, 'Order fields are not valid');

  const apiFeatures = new APIFeatures(Order, query);

  const orders = await apiFeatures
    .getQueryObj()
    .populate('userId', 'name email')
    .populate('products.id', 'name numStock');
  if (orders.length == 0) throw new HttpError(StatusCodes.NOT_FOUND, 'No orders found');

  return {
    status: StatusCodes.OK,
    message: 'All Order are retrieved successfully',
    result: orders
  };
}
async function getOrder(id) {
  const order = await Order.findById(id)
  if (!order) throw new HttpError(StatusCodes.NOT_FOUND, 'Order not found');
  return {
    status: StatusCodes.OK,
    message: 'Order retrieved successfully',
    result: order
  };
}
async function updateOrder(id, newOrder) {
  const isOrderValid = await verifySchema(updateOrderSchema, newOrder);
  if (!isOrderValid) throw new HttpError(StatusCodes.BAD_REQUEST, 'Order fields are not valid');

  if (newOrder.status && newOrder.status == 'Delivered') newOrder.deliveredAt = Date.now();

  const order = await Order.findById(id);

  if (!order) throw new HttpError(StatusCodes.NOT_FOUND, 'Status update failed');

  if (order.status) {
    if (newOrder.status == 'Cancelled' && order.status == 'Delivered')
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Order is already delivered, can not cancel');
    if (newOrder.status == 'Cancelled' && order.status == 'Cancelled')
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Order is already cancelled, can not cancel again'
      );
  }

  await order.updateOne(newOrder);

  return {
    status: StatusCodes.OK,
    message: 'Order updated successfully'
  };
}

module.exports = { createNewOrder, getAllOrders, updateOrder, getOrder };
