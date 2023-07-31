const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const request = require('supertest');
const app = require('../app');
const myRequest = request(app);

const { clearRedis } = require('../utils');

const { customerDetails, sellerDetails, adminDetails } = require('./FakeData/users.json');
jest.setTimeout(10000);
let mongoServer;
let customerId, sellerId, adminId, productID, cartID;
let lastSession = '';

const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

const registerUsers = async () => {
  const customerRes = await myRequest.post('/auth/register').send(customerDetails);
  const sellerRes = await myRequest.post('/auth/register').send(sellerDetails);
  const adminRes = await myRequest.post('/auth/register').send(adminDetails);

  customerId = customerRes.body.result._id;
  sellerId = sellerRes.body.result._id;
  adminId = adminRes.body.result._id;
};

const loginUser = async (email, password) => {
  if (lastSession) await myRequest.post('/auth/logout').set('Cookie', lastSession).send();

  const res = await myRequest.post('/auth/login').send({
    email,
    password
  });

  return (lastSession = res.headers['set-cookie']);
};

// token must be dynamically retrieved inside tests, as beforeAll will execute just before they run
const getCustomerSession = async () => loginUser(customerDetails.email, customerDetails.password);
const getSellerSession = async () => loginUser(sellerDetails.email, sellerDetails.password);
const getAdminSession = async () => loginUser(adminDetails.email, adminDetails.password);
const getCustomerId = () => customerId;
const getSellerId = () => sellerId;
const getAdminId = () => adminId;

beforeAll(async () => {
  await clearRedis();
  await mongoose.disconnect();
  await connectDB();

  await registerUsers();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

module.exports = {
  customer: { id: getCustomerId, details: customerDetails, getSession: getCustomerSession },
  seller: { id: getSellerId, details: sellerDetails, getSession: getSellerSession },
  admin: { id: getAdminId, details: adminDetails, getSession: getAdminSession },
  loginUser
};
