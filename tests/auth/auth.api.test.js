const request = require('supertest');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const app = require('../../app');
const myRequest = request(app);

const { customer, seller } = require('../test.setup');
const { User } = require('../../models');

describe('POST /register', () => {
  it('should fail: undefined body', async () => {
    const res = await myRequest.post('/auth/register').send();

    expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    expect(res.body).not.to.have.property('user');
  });

  it('should fail: not valid schema', async () => {
    const { name, email, password } = customer.details;
    const res = await myRequest.post('/auth/register').send({ name, email, password });

    expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    expect(res.body).not.to.have.property('user');
  });

  it('should succeed', async () => {
    const user = { ...customer.details };
    user.email = 'random@mail.com';
    user.phone = 10000000001;

    const res = await myRequest.post('/auth/register').send(user);

    expect(res.statusCode).to.equal(StatusCodes.CREATED);
    expect(res.body).to.have.property('result');
    expect(res.body.result).to.have.property('name');
    expect(res.body.result).to.have.property('email');
    expect(res.body.result).to.have.property('password');
    expect(res.body.result.name).to.equal(user.name);
    expect(res.body.result.email).to.equal(user.email);

    const userExist = await User.findById(res.body.result._id);
    console.log(userExist);
    expect(userExist).to.exist;
  });

  it('should fail: email already exists', async () => {
    const res = await myRequest.post('/auth/register').send(customer.details);

    expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
  });
});

describe('POST /login', () => {
  it('should fail: undefined', async () => {
    const res = await myRequest.post('/auth/login').send();

    expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
  });

  it('should fail: not valid schema', async () => {
    const res = await myRequest.post('/auth/login').send({ email: customer.details.email });

    expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
  });

  it("should fail: email doesn't exist", async () => {
    const res = await myRequest
      .post('/auth/login')
      .send({ email: 'email@mail.com', password: customer.details.password });

    expect(res.statusCode).to.equal(StatusCodes.NOT_FOUND);
  });

  it('should fail: wrong password', async () => {
    const res = await myRequest
      .post('/auth/login')
      .send({ email: customer.details.email, password: 'user.password' });

    expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
  });

  it('should succeed', async () => {
    const { email, password } = { ...customer.details };
    const res = await myRequest.post('/auth/login').send({ email, password });

    expect(res.statusCode).to.equal(StatusCodes.OK);
    expect(res.body).to.have.property('token');
    expect(res.body.token).to.exist;
  });
});

describe('POST /logout', () => {
  it('should fail: not authenticated', async () => {
    const res = await myRequest.post('/auth/logout').send();

    expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
  });

  it.only('should succeed', async () => {
    console.log(customer.token);
    const res = await myRequest
      .post('/auth/logout')
      .set('Cookie', [`connect.sid=${customer.token}`])
      .send();

    // expect(authMiddleware).toHaveBeenCalled();
    expect(res.statusCode).to.equal(StatusCodes.OK);
  });

  it('should fail: already logged out', async () => {
    const res = await myRequest
      .post('/auth/logout')
      .set('Cookie', [`connect.sid=${customer.token}`])
      .send();

    expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
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
      .set('Cookie', [`connect.sid=${customer.token}`])
      .send({ oldPassword: 'password' });

    expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
  });

  it('should fail: wrong password', async () => {
    const res = await myRequest
      .put('/auth/change-password')
      .set('Cookie', [`connect.sid=${customer.token}`])
      .send({
        oldPassword: 'wrong',
        newPassword: 'newPassword',
        newPasswordConfirm: 'newPassword'
      });

    expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
  });

  it('should succeed', async () => {
    const res = await myRequest
      .put('/auth/change-password')
      .set('Cookie', [`connect.sid=${customer.token}`])
      .send({
        oldPassword: customer.details.password,
        newPassword: 'newPassword',
        newPasswordConfirm: 'newPassword'
      });

    expect(res.statusCode).to.equal(StatusCodes.OK);
  });
});
