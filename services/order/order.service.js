const { StatusCodes } = require('http-status-codes');
const {
  createOrderSchema,
  updateOrderSchema,
  queryOrdersSchema
} = require('./order.schema');
const { HttpError, verifySchema } = require('../../utils');
const { Order, Cart, Product, User } = require('../../models');

async function createNewOrder(userId, order) {
  const cart = await Cart.findOne({ userId });
  let { products } = cart;
  let total = cart.calculateTotal();

  const user = await User.findById(userId);
  let { address } = user;

  const orderDetails = { userId, products, total, address, ...order };

  const isOrderValid = await verifySchema(createOrderSchema, orderDetails);
  if (!isOrderValid)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Order fields are not valid');

  const newOrder = new Order();
  const savedOrder = await newOrder.save();

  await cart.update({ products: [] });

  for (let i = 0; i < order.products.length; i++) {
    let product = order.products[i];
    await Product.findByIdAndUpdate(product.id, {
      $inc: {
        numSold: product.count,
        numStock: -product.count
      }
    });
  }

  return {
    status: StatusCodes.OK,
    message: 'Order created successfully',
    result: savedOrder
  };
}

async function getAllOrders(query) {
  const isOrderValid = await verifySchema(queryOrdersSchema, query);
  if (!isOrderValid)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Order fields are not valid');

  const orders = await Order.find(query)
    .populate('userId', 'name email')
    .populate('products.id', 'name');
  if (!orders) throw new HttpError(StatusCodes.NOT_FOUND, 'No orders found');

  return {
    status: StatusCodes.OK,
    message: 'All Order are retrieved successfully',
    result: orders
  };
}

async function updateOrder(id, newOrder) {
  const isOrderValid = await verifySchema(updateOrderSchema, newOrder);
  if (!isOrderValid)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Order fields are not valid');

  if (newOrder.status && newOrder.status == 'Delivered')
    newOrder.deliveredAt = Date.now();

  const order = await Order.findById(id);

  if (!order)
    throw new HttpError(StatusCodes.NOT_FOUND, 'Status update failed');

  if (order.status) {
    if (newOrder.status == 'Cancelled' && order.status == 'Delivered')
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Order is already delivered, can not cancel'
      );
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

module.exports = { createNewOrder, getAllOrders, updateOrder };
