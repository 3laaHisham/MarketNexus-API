const { StatusCodes } = require("http-status-codes");
const orderSchema = require("./order.schema");
const validateOrder = require("./order.schema");
const { HttpError, verifySchema } = require("../../utils");
const orderModel = require("../../models");

async function createNewOrder(order) {
  const isOrderValid = await verifySchema(orderSchema, order);
  if (!isOrderValid)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Order fields are not valid");

  const newOrder = new orderModel(order);

  const savedOrder = await newOrder.save();
  return {
    status: StatusCodes.OK,
    message: "Order created successfully",
    result: savedOrder,
  };
}

async function getAllOrders() {
  const orders = await orderModel
    .find({})
    .populate("userID", "name email")
    .populate("products.id", "name")
    .populate("StripePaymentId");
  if (!orders) throw new HttpError(StatusCodes.NOT_FOUND, "No orders found");

  return {
    status: StatusCodes.OK,
    message: "All Order are retrieved successfully",
    result: orders,
  };
}

async function getOrderById(id) {
  const order = await orderModel
    .findOne({ _id: id })
    .populate("userID", "name email")
    .populate("products.id", "name")
    .populate("StripePaymentId");
  if (!order) throw new HttpError(StatusCodes.NOT_FOUND, "No order found");

  return {
    status: StatusCodes.OK,
    message: "Order is retrieved successfully",
    result: order,
  };
}
async function updateOrderStatus(orderID, newStatus) {
  const updatedOrder = await orderModel.findOneAndUpdate(
    { _id: orderID },
    { status: newStatus },
    { new: true }
  );
  if (!updatedOrder)
    throw new HttpError(StatusCodes.NOT_FOUND, "status update failed");
  return {
    status: StatusCodes.OK,
    message: "Order status updated successfully",
    result: order,
  };
}
async function cancelOrder(orderID) {
  updateOrderStatus(orderID, "Cancelled");
}

// async function updateStatus(orderID, newStatus) {
//     //check
//     updateOrderStatus(orderID, newStatus);

// }
