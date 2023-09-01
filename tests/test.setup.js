const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.mock('ioredis', () => require('ioredis-mock'));

const { clearRedis } = require('../utils');

const { customerDetails, sellerDetails, adminDetails } = require('./FakeData/users.json');

const request = require('supertest');
const app = require('../app');

const myRequest = request(app);

let mongoServer;
const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

const registerUser = async (user) => {
  const res = await myRequest.post('/auth/register').send(user);

  return res.body.result._id;
};

const ids = {};
const registerUsers = async () => {
  const users = { customer: customerDetails, seller: sellerDetails, admin: adminDetails };

  for (const user in users) {
    const userID = await registerUser(users[user]);

    ids[user] = userID;
  }
};

const loginUser = async (email, password) => {
  const res = await myRequest.post('/auth/login').send({
    email,
    password
  });

  return res.headers['set-cookie'];
};

const sessions = {};
const loginUsers = async () => {
  const users = { customer: customerDetails, seller: sellerDetails, admin: adminDetails };

  for (const user in users) {
    const { email, password } = users[user];

    const userSession = await loginUser(email, password);

    sessions[user] = userSession;
  }
};

// token must be dynamically retrieved inside tests, as beforeAll will execute just after thet are exported
const getCustomerSession = () => sessions['customer'];
const getSellerSession = () => sessions['seller'];
const getAdminSession = () => sessions['admin'];

const getCustomerId = () => ids['customer'];
const getSellerId = () => ids['seller'];
const getAdminId = () => ids['admin'];

beforeAll(async () => {
  await connectDB();

  await registerUsers();
  await loginUsers();
});

afterAll(async () => {
  await clearRedis();

  await mongoose.disconnect();
  await mongoServer.stop();
});

module.exports = {
  customer: { id: getCustomerId, details: customerDetails, getSession: getCustomerSession },
  seller: { id: getSellerId, details: sellerDetails, getSession: getSellerSession },
  admin: { id: getAdminId, details: adminDetails, getSession: getAdminSession },
  registerUser,
  loginUser
};
