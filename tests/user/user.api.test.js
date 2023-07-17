const request = require('supertest');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const app = require('../../app');
const myRequest = request(app);

const { customer, seller } = require('../test.setup');
const { User } = require('../../models');

// write tests for routes at '../../routes/user.route.js'
describe('GET /me', () => {
  it('should fail: not authenticated', async () => {
    const res = await myRequest.get('/users/me').send();

    expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
  });

  it('should succeed', async () => {
    const res = await myRequest.get('/users/me').set('Cookie', customer.getToken()).send();

    expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
  });
});
