const request = require('supertest');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

require('../test.setup');
const { customer2Details } = require('../FakeData/users.json');
const app = require('../../app');
const { User } = require('../../models');

const myRequest = request(app);

describe('Auth Test Suite', () => {
  describe('POST /register', () => {
    it('should fail: undefined body', async () => {
      const res = await myRequest.post('/auth/register').send();

      expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
      expect(res.body).not.to.have.property('user');
    });

    it('should fail: not valid schema', async () => {
      const { name, email, password } = customer2Details;
      const res = await myRequest.post('/auth/register').send({ name, email, password });

      expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
      expect(res.body).not.to.have.property('user');
    });

    it('should succeed', async () => {
      const res = await myRequest.post('/auth/register').send(customer2Details);

      expect(res.statusCode).to.equal(StatusCodes.CREATED);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('name');
      expect(res.body.result).to.have.property('email');
      expect(res.body.result).to.have.property('password');
      expect(res.body.result.name).to.equal(customer2Details.name);
      expect(res.body.result.email).to.equal(customer2Details.email);

      const userExist = await User.findById(res.body.result._id);
      expect(userExist).to.exist;
    });

    it('should fail: email already exists', async () => {
      const res = await myRequest.post('/auth/register').send(customer2Details);

      expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    });
  });

  let customerSession;
  describe('POST /login', () => {
    it('should fail: undefined', async () => {
      const res = await myRequest.post('/auth/login').send();

      expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    });

    it('should fail: not valid schema', async () => {
      const res = await myRequest.post('/auth/login').send({ email: customer2Details.email });

      expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    });

    it("should fail: email doesn't exist", async () => {
      const res = await myRequest
        .post('/auth/login')
        .send({ email: 'email@mail.com', password: 'randomPassword' });

      expect(res.statusCode).to.equal(StatusCodes.NOT_FOUND);
    });

    it('should fail: wrong password', async () => {
      const res = await myRequest
        .post('/auth/login')
        .send({ email: customer2Details.email, password: 'wrongPassword' });

      expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should succeed', async () => {
      const { email, password } = customer2Details;
      const res = await myRequest.post('/auth/login').send({ email, password });

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('token');
      expect(res.body.token).to.exist;

      customerSession = res.headers['set-cookie'];
    });

    it('should fail: already logged in', async () => {
      const { email, password } = customer2Details;
      const res = await myRequest
        .post('/auth/login')
        .set('Cookie', customerSession)
        .send({ email, password });

      expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
      expect(res.body).not.to.have.property('token');
    });
  });

  describe('PUT /change-password', () => {
    it('should fail: not authenticated', async () => {
      const res = await myRequest.put('/auth/change-password').send();

      expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should fail: not valid schema', async () => {
      const res = await myRequest
        .put('/auth/change-password')
        .set('Cookie', customerSession)
        .send({ oldPassword: 'password' });

      expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    });

    it('should fail: wrong password', async () => {
      const res = await myRequest.put('/auth/change-password').set('Cookie', customerSession).send({
        oldPassword: 'wrong',
        newPassword: 'newPassword',
        newPasswordConfirm: 'newPassword'
      });

      expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should succeed', async () => {
      const res = await myRequest.put('/auth/change-password').set('Cookie', customerSession).send({
        oldPassword: customer2Details.password,
        newPassword: 'newPassword',
        newPasswordConfirm: 'newPassword'
      });

      expect(res.statusCode).to.equal(StatusCodes.OK);
    });
  });

  describe('POST /logout', () => {
    it('should fail: not authenticated', async () => {
      const res = await myRequest.post('/auth/logout').send();

      expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should succeed', async () => {
      const res = await myRequest.post('/auth/logout').set('Cookie', customerSession).send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
    });

    it('should fail: already logged out', async () => {
      const res = await myRequest.post('/auth/logout').set('Cookie', customerSession).send();

      expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    });
  });
});
