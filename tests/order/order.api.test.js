const request = require('supertest');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const app = require('../../app');
const myRequest = request(app);

const { customer, seller, admin } = require('../test.setup');
const { Product, Order } = require('../../models');
const fakeOrders = require('../FakeData/orders.json');
const fakeProducts = require('../FakeData/products.json');

let sellerId, customerId, adminSession, customerSession, productID, orderID;
var product, orders, order, products, orderProduct;
sellerId = seller.id();
customerId = customer.id();

const addProduct = async () => {
  sellerId = seller.id()
  const fakeProductsArray = Object.values(fakeProducts);
  products = fakeProductsArray.map((product) => ({ ...product, seller: sellerId }));
  products = await Product.insertMany(products);
  product = products[14];
  productID = product._id;
  orderProduct = {
    id: productID,
    price: product.price,
    count: 1,
    color: product.colors[0],
    size: product.sizes[0]
  };
  return productID;
};
function print(x) {
  console.log(x);
}
const addOrder = async () => {
  if (!productID)
    addProduct();
  customerId = customer.id();
  const ordersArray = Object.values(fakeOrders);
  order = ordersArray[0]
  order.userId = customerId;
  order.products[0] = orderProduct;
  newOrder = new Order(order)
  order = newOrder;
  await newOrder.save();
  orderID = order._id;
  return orderID;
};
function str(obj) {
  return new String(obj).toString();
}

beforeAll(async () => {
  if (!productID) await addProduct();
  if (!orderID) await addOrder();

});

describe('Order API Tests', () => {

  it('should succeed - get the order', async () => {
    customerSession = await customer.getSession();
    const res = await myRequest.get(`/orders/${orderID}`).set('Cookie', customerSession).send();
    expect(res.statusCode).to.equal(StatusCodes.OK);
    expect(res.body).to.have.property('result');
    expect(res.body.result).to.have.property('userId');
    expect(res.body.result.userId).to.equal(customerId);
    expect(res.body.result.products).to.be.of.length(1);
    expect(str(res.body.result.products[0].id)).to.equal(str(productID));
  });

  it('should fail - get the order without authorization', async () => {
    const res = await myRequest.get(`/orders/${orderID}`).send();
    expect(res.statusCode).not.to.equal(StatusCodes.OK);
  });

  it('should succeed - update order status by admin', async () => {
    let newStatus = 'Shipped';
    let tempOrder = {
      status: newStatus
    }
    adminSession = await admin.getSession();
    const res = await myRequest.put(`/orders/${orderID}/status`).set('Cookie', adminSession).send(tempOrder);

    expect(res.statusCode).to.equal(StatusCodes.OK);
    // print(JSON.stringify(res) + "fffffffff");
    let ret = await Order.findOne({ _id: orderID });
    expect(ret.status).to.equal(newStatus);
  });

  it('should fail - update order status by non-admin user', async () => {
    let newStatus = 'Shipped';
    let tempOrder = {
      status: newStatus
    }
    customerSession = await customer.getSession();
    const res = await myRequest.put(`/orders/${orderID}/status`).set('Cookie', customerSession).send(tempOrder);
    expect(res.statusCode).not.to.equal(StatusCodes.OK);
  });

  it('should succeed - cancel the order by the owner', async () => {
    customerSession = await customer.getSession();
    const res = await myRequest.put(`/orders/${orderID}/cancel`).set('Cookie', customerSession).send();
    expect(res.statusCode).to.equal(StatusCodes.OK);
    let ret = await Order.findOne({ _id: orderID });
    expect(ret.status).to.equal('Cancelled');
  });

  it('should fail - cancel the order by non-owner', async () => {
    sellerSession = seller.getSession();
    const res = await myRequest.put(`/orders/${orderID}/cancel`).set('Cookie', sellerSession).send();
    expect(res.statusCode).not.to.equal(StatusCodes.OK);
  });



  it('should succeed - search for orders', async () => {
    customerId = customer.id()
    const searchQuery = { userId: customerId };
    customerSession = await customer.getSession();
    const res = await myRequest.get('/orders/search').set('Cookie', customerSession).query(searchQuery);
    expect(res.statusCode).to.equal(StatusCodes.OK);

    expect(res.body).to.have.property('result');
    expect(res.body.result).to.be.an('array');
    expect(res.body.result).to.have.length.greaterThan(0);
    expect(res.body.result[0]).to.have.property('status');

  });
});
