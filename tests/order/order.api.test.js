const request = require('supertest');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const app = require('../../app');
const myRequest = request(app);

const { customer, seller, admin } = require('../test.setup');
const { Order } = require('../../models');

describe('POST /orders', () => {
  let customerSession;
  beforeAll(async () => {
    customerSession = await customer.getSession();
  });

  it('should create a new order', async () => {
    const order = {
      userId: customer.id,
      products: [
        {
          id: 'product_id',
          price: 10,
          count: 2,
          color: 'red',
          size: 'M'
        }
      ],
      discount: 0,
      address: {
        street: '123 Main St',
        city: 'Example City',
        country: 'Example Country',
        flatNumber: '44'
      },
      status: 'Not Processed',
      taxPrice: 0,
      deliveryPrice: 0,
      paymentType: 'card',
      StripePaymentId: 12345
    };

    const res = await myRequest.post('/orders').set('Cookie', customerSession).send(order);

    expect(res.statusCode).to.equal(StatusCodes.OK);
    expect(res.body).to.have.property('result');
    expect(res.body.result).to.have.property('_id');

    const createdOrder = await Order.findById(res.body.result._id);
    expect(createdOrder).to.exist;
  });

  it('should fail if not authenticated', async () => {
    const order = {
      userId: customer.id,
      products: [
        {
          id: 'product_id',
          price: 10,
          count: 2,
          color: 'red',
          size: 'M'
        }
      ]
      // Rest of the order data...
    };

    const res = await myRequest.post('/orders').send(order);

    expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
  });

  // Add more test cases for edge cases and validation checks
});

// describe('GET /orders/:id', () => {
//     let adminSession;
//     beforeAll(async () => {
//         adminSession = await admin.getSession();
//     });

//     it('should get a specific order', async () => {
//         const orderId = 'order_id';

//         const res = await myRequest.get(`/orders/${orderId}`).set('Cookie', adminSession);

//         expect(res.statusCode).to.equal(StatusCodes.OK);
//         expect(res.body).to.have.property('result');
//         expect(res.body.result).to.have.property('_id', orderId);
//     });

//     // Add more test cases for different scenarios
// });

// describe('GET /orders/search', () => {
//     let sellerSession;
//     beforeAll(async () => {
//         sellerSession = await seller.getSession();
//     });

//     it('should search for orders', async () => {
//         const searchQuery = {
//             status: 'Shipped',
//             paymentType: 'card'
//         };

//         const res = await myRequest.get('/orders/search').query(searchQuery).set('Cookie', sellerSession);

//         expect(res.statusCode).to.equal(StatusCodes.OK);
//         expect(res.body).to.have.property('results');
//         expect(res.body.results).to.be.an('array');
//     });

//     // Add more test cases for different search scenarios
// });

// describe('PUT /orders/:id/cancel', () => {
//     let sellerSession;
//     beforeAll(async () => {
//         sellerSession = await seller.getSession();
//     });

//     it('should cancel an order', async () => {
//         const orderId = 'order_id';

//         const res = await myRequest.put(`/orders/${orderId}/cancel`).set('Cookie', sellerSession);

//         expect(res.statusCode).to.equal(StatusCodes.OK);
//         expect(res.body).to.have.property('result');
//         expect(res.body.result).to.have.property('status', 'Cancelled');

//         const updatedOrder = await Order.findById(orderId);
//         expect(updatedOrder.status).to.equal('Cancelled');
//     });

//     // Add more test cases for different scenarios
// });

// describe('PUT /orders/:id/status', () => {
//     let adminSession;
//     beforeAll(async () => {
//         adminSession = await admin.getSession();
//     });

//     it('should update the status of an order', async () => {
//         const orderId = 'order_id';
//         const updatedStatus = 'Shipped';

//         const res = await myRequest
//             .put(`/orders/${orderId}/status`)
//             .set('Cookie', adminSession)
//             .send({ status: updatedStatus });

//         expect(res.statusCode).to.equal(StatusCodes.OK);
//         expect(res.body).to.have.property('result');
//         expect(res.body.result).to.have.property('status', updatedStatus);

//         const updatedOrder = await Order.findById(orderId);
//         expect(updatedOrder.status).to.equal(updatedStatus);
//     });

//     // Add more test cases for different scenarios
// });
