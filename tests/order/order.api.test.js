const request = require('supertest');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

// call it once in  setup
const { customer, seller, admin } = require('../test.setup');
const { Product, Order } = require('../../models');

const app = require('../../app');
const myRequest = request(app);

const fakeOrders = require('../FakeData/orders.json');
const fakeProducts = require('../FakeData/products.json');

let sellerId, customerId, adminSession, customerSession, productID, orderID;
var product, orders, order, products, orderProduct;
sellerId = seller.id();
customerId = customer.id();

const addProduct = async () => {
  sellerId = seller.id();

  const fakeProductsArray = Object.values(fakeProducts);
  products = fakeProductsArray.map((product) => ({ ...product, seller: sellerId }));
  products = await Product.insertMany(products);

  product = products[14];
  productID = product.id;

  orderProduct = {
    id: productID,
    price: product.price,
    count: 1,
    color: product.colors[0],
    size: product.sizes[0]
  };

  return productID;
};

const addOrder = async () => {
  if (!productID) addProduct();

  customerId = customer.id();

  const ordersArray = Object.values(fakeOrders);
  order = ordersArray[0];
  order.userId = customerId;
  order.products[0] = orderProduct;

  newOrder = new Order(order);
  order = newOrder;
  await newOrder.save();

  orderID = order._id;
  return orderID;
};

describe('Order Test Suite', () => {
  beforeAll(async () => {
    if (!productID) await addProduct();
    if (!orderID) await addOrder();
  });

  it('should succeed - get the order by id', async () => {
    customerSession = await customer.getSession();
    const res = await myRequest.get(`/orders/${orderID}`).set('Cookie', customerSession).send();

    expect(res.statusCode).to.equal(StatusCodes.OK);
    expect(res.body).to.have.property('result');
    expect(res.body.result).to.have.property('userId');
    expect(res.body.result.userId._id).to.equal(customerId);
    expect(res.body.result.products[0].id.id).to.equal(productID);
  });

  it('should succeed - get the order by status', async () => {
    customerSession = await customer.getSession();
    const res = await myRequest
      .get(`/orders/search?status=Cancelled`)
      .set('Cookie', customerSession)
      .send();

    expect(res.statusCode).to.equal(StatusCodes.OK);
    expect(res.body).to.have.property('result');
    expect(res.body.result).to.have.property('userId');
    expect(res.body.result.userId._id).to.equal(customerId);
    expect(res.body.result.products[0].id.id).to.equal(productID);
  });

  it('should fail - get the order without authentication', async () => {
    const res = await myRequest.get(`/orders/${orderID}`).send();
    expect(res.statusCode).not.to.equal(StatusCodes.OK);
  });

  it('should succeed - update order status by admin', async () => {
    let newStatus = 'Shipped';
    let tempOrder = {
      status: newStatus
    };
    adminSession = await admin.getSession();
    const res = await myRequest
      .put(`/orders/${orderID}/status`)
      .set('Cookie', adminSession)
      .send(tempOrder);

    expect(res.statusCode).to.equal(StatusCodes.OK);
    let ret = await Order.findOne({ _id: orderID });
    expect(ret.status).to.equal(newStatus);
  });

  it('should fail - update order status by non-admin user', async () => {
    let newStatus = 'Shipped';
    let tempOrder = {
      status: newStatus
    };
    customerSession = await customer.getSession();
    const res = await myRequest
      .put(`/orders/${orderID}/status`)
      .set('Cookie', customerSession)
      .send(tempOrder);
    expect(res.statusCode).not.to.equal(StatusCodes.OK);
  });

  it('should succeed - cancel the order by the owner', async () => {
    customerSession = await customer.getSession();
    const res = await myRequest
      .put(`/orders/${orderID}/cancel`)
      .set('Cookie', customerSession)
      .send();

    expect(res.statusCode).to.equal(StatusCodes.OK);
    let ret = await Order.findOne({ _id: orderID });
    expect(ret.status).to.equal('Cancelled');
  });

  it('should fail - cancel the order by non-owner', async () => {
    sellerSession = seller.getSession();
    const res = await myRequest
      .put(`/orders/${orderID}/cancel`)
      .set('Cookie', sellerSession)
      .send();
    expect(res.statusCode).not.to.equal(StatusCodes.OK);
  });
});
