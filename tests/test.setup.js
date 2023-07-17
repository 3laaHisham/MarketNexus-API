const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const request = require('supertest');
const app = require('../app');
const myRequest = request(app);

jest.setTimeout(600000); // Increase the timeout for the tests

const customerDetails = {
  name: 'Test Customer',
  email: 'customer@example.com',
  password: 'password',
  address: {
    country: 'egy',
    city: 'zeft',
    street: 'sakha',
    flatNumber: '3'
  },
  phone: 10000000000,
  role: 'customer'
};

const sellerDetails = {
  name: 'Test Seller',
  email: 'seller@example.com',
  password: 'password',
  address: {
    country: 'egy',
    city: 'zeft',
    street: 'sakha',
    flatNumber: '3'
  },
  phone: 11000000000,
  role: 'seller',
  isCompany: false
};

let mongoServer;
let customerToken;
let sellerToken;

const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

const registerUsers = async () => {
  await myRequest.post('/auth/register').send(customerDetails);
  await myRequest.post('/auth/register').send(sellerDetails);
};

const loginUsers = async () => {
  const customerRes = await myRequest.post('/auth/login').send({
    email: customerDetails.email,
    password: customerDetails.password
  });
  const sellerRes = await myRequest.post('/auth/login').send({
    email: sellerDetails.email,
    password: sellerDetails.password
  });

  customerToken = customerRes.headers['set-cookie'];
  sellerToken = sellerRes.body.token;
};

beforeAll(async () => {
  await mongoose.disconnect();
  await connectDB();

  await registerUsers();
  await loginUsers();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// token must be dynamically inside of tests, as beforeAll will execute just before they run
const getCustomerToken = () => customerToken;
const getSellerToken = () => sellerToken;

module.exports = {
  customer: { getToken: getCustomerToken, details: customerDetails },
  seller: { getToken: getSellerToken, details: sellerDetails }
};
