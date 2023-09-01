const request = require('supertest');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const { customer, seller, admin } = require('../test.setup');
const { User } = require('../../models');

const app = require('../../app');
const myRequest = request(app);

describe('User Test Suite', () => {
  describe('GET /users/:id', () => {
    it('should fail: not found', async () => {
      const res = await myRequest.get(`/users/000000000000000000000000`).send();

      expect(res.statusCode).to.equal(StatusCodes.NOT_FOUND);
      expect(res.body).not.to.have.property('result');
    });

    it('should succeed', async () => {
      const res = await myRequest.get(`/users/${customer.id()}`).send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('name');
      expect(res.body.result).to.have.property('email');
      expect(res.body.result).not.to.have.property('password');
      expect(res.body.result.name).to.equal(customer.details.name);
      expect(res.body.result.email).to.equal(customer.details.email);
    });

    it('should succeed: fromCache', async () => {
      const res = await myRequest.get(`/users/${customer.id()}`).send();

      expect(res.body.status).to.equal(StatusCodes.NOT_MODIFIED);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('name');
      expect(res.body.result).to.have.property('email');
      expect(res.body.result).not.to.have.property('password');
      expect(res.body.result.name).to.equal(customer.details.name);
      expect(res.body.result.email).to.equal(customer.details.email);

      expect(res.body.message).to.equal('Retrieved data from cache');
    });
  });

  describe('GET /users/search', () => {
    it('should succeed: All results', async () => {
      const res = await myRequest.get('/users/search').send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.be.of.length(3);
    });

    it('should succeed', async () => {
      let { name, phone, email } = admin.details;
      const res = await myRequest.get(`/users/search?name=${name}&phone=${phone}`).send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('name');
      expect(res.body.result).to.have.property('email');
      expect(res.body.result).not.to.have.property('password');
      expect(res.body.result.name).to.equal(name);
      expect(res.body.result.email).to.equal(email);
    });

    it('should succeed: results admin with select name, email', async () => {
      const admin2Details = { ...admin.details };
      admin2Details.email = 'admin@mail.com';
      admin2Details.phone = 11100000001;

      let admin2 = new User(admin2Details);
      await admin2.save();

      const res = await myRequest.get(`/users/search?role=admin&select=email,role`).send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.be.of.length(2);
      expect(res.body.result[0].role).to.equal('admin');
      expect(res.body.result.phone).to.be.undefined;
    });

    it('should succeed: results from cache', async () => {
      const res = await myRequest.get(`/users/search?role=admin&select=email,role`).send();

      expect(res.body.status).to.equal(StatusCodes.NOT_MODIFIED);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.be.of.length(2);
      expect(res.body.result[0].role).to.equal('admin');
      expect(res.body.result.phone).to.be.undefined;

      expect(res.body.message).to.equal('Retrieved data from cache');
    });
  });

  let customerSession;

  describe('GET /users/me', () => {
    // Login as customer
    beforeAll(async () => {
      customerSession = await customer.getSession();
    });

    it('should fail: not authenticated', async () => {
      const res = await myRequest.get('/users/me').send();

      expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should succeed: authenticated as customer', async () => {
      const res = await myRequest.get('/users/me').set('Cookie', customerSession).send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('name');
      expect(res.body.result).to.have.property('email');
      expect(res.body.result).not.to.have.property('password');
      expect(res.body.result.name).to.equal(customer.details.name);
      expect(res.body.result.email).to.equal(customer.details.email);
    });
  });

  describe('PUT /users/me', () => {
    it('should fail: not authenticated', async () => {
      const res = await myRequest.put('/users/me').send();

      expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should fail: not valid schema', async () => {
      const res = await myRequest
        .put('/users/me')
        .set('Cookie', customerSession)
        .send({ password: '3laa' });

      expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    });

    it('should succeed: authenticated as customer', async () => {
      const updatedDetails = {
        name: 'John Doe',
        email: 'john.doe@example.com'
      };

      const res = await myRequest
        .put('/users/me')
        .set('Cookie', customerSession)
        .send(updatedDetails);

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('name');
      expect(res.body.result).to.have.property('email');
      expect(res.body.result.name).to.equal(updatedDetails.name);
      expect(res.body.result.email).to.equal(updatedDetails.email);
    });
  });

  describe('DELETE /users/me', () => {
    it('should fail: not authenticated', async () => {
      const res = await myRequest.delete('/users/me').send();

      expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should succeed: authenticated as customer', async () => {
      const res = await myRequest.delete('/users/me').set('Cookie', customerSession).send();

      expect(res.statusCode).to.equal(StatusCodes.OK);

      const userExist = await User.findById(customer.id());
      expect(userExist).to.be.null;
    });
  });

  describe('DELETE /users/:id', () => {
    it('should fail: not authenticated', async () => {
      const res = await myRequest.delete(`/users/${customer.id()}`).send();

      expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should fail: not authorized', async () => {
      const res = await myRequest
        .delete(`/users/${admin.id()}`)
        .set('Cookie', await seller.getSession())
        .send();

      expect(res.statusCode).to.equal(StatusCodes.FORBIDDEN);
    });

    it('should succeed: authenticated as admin', async () => {
      const res = await myRequest
        .delete(`/users/${seller.id()}`)
        .set('Cookie', await admin.getSession())
        .send();

      expect(res.statusCode).to.equal(StatusCodes.OK);

      const userExist = await User.findById(seller.id());
      expect(userExist).to.be.null;
    });
  });
});
