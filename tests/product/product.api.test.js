const request = require('supertest');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const app = require('../../app');
const myRequest = request(app);

const { seller } = require('../test.setup');
const { Product } = require('../../models');

describe('GET /products/:id', () => {
  let product;

  before(async () => {
    // Create a product and store its ID
    const response = await myRequest
      .post('/products')
      .set('Cookie', await seller.getSession())
      .send({
        seller: seller.id,
        name: 'Test Product',
        description: 'This is a test product',
        specification: { color: 'Red', size: 'M' },
        category: 'Electronics',
        price: 20,
        colors: ['Red', 'Blue', 'Green'],
        sizes: ['S', 'M', 'L'],
        numStock: 50
      });

    product = response.body.result;
  });

  it('should get a specific product', async () => {
    const response = await myRequest.get(`/products/${product._id}`);

    expect(response.statusCode).to.equal(StatusCodes.OK);
    expect(response.body).to.have.property('result');
    expect(response.body.result).to.have.property('_id', product._id);
  });

  // Add more test cases for different scenarios
});

describe('GET /products/search', () => {
  it('should search for products', async () => {
    const query = { category: 'Electronics' };

    const response = await myRequest.get('/products/search').query(query);

    expect(response.statusCode).to.equal(StatusCodes.OK);
    expect(response.body).to.have.property('results');
    expect(response.body.results).to.be.an('array');
  });

  // Add more test cases for different search scenarios
});

describe('GET /products/top10-cheapest', () => {
  it('should get the top 10 cheapest products', async () => {
    const response = await myRequest.get('/products/top10-cheapest');

    expect(response.statusCode).to.equal(StatusCodes.OK);
    expect(response.body).to.have.property('results');
    expect(response.body.results).to.be.an('array');
    expect(response.body.results).to.have.lengthOf(10);
  });

  // Add more test cases for different scenarios
});

describe('GET /products/top10-rated', () => {
  it('should get the top 10 highest-rated products', async () => {
    const response = await myRequest.get('/products/top10-rated');

    expect(response.statusCode).to.equal(StatusCodes.OK);
    expect(response.body).to.have.property('results');
    expect(response.body.results).to.be.an('array');
    expect(response.body.results).to.have.lengthOf(10);
  });

  // Add more test cases for different scenarios
});

describe('GET /products/most10-sold', () => {
  it('should get the top 10 most-sold products', async () => {
    const response = await myRequest.get('/products/most10-sold');

    expect(response.statusCode).to.equal(StatusCodes.OK);
    expect(response.body).to.have.property('results');
    expect(response.body.results).to.be.an('array');
    expect(response.body.results).to.have.lengthOf(10);
  });

  // Add more test cases for different scenarios
});

describe('POST /products', () => {
  it('should add a new product', async () => {
    const newProduct = {
      seller: seller.id,
      name: 'New Product',
      description: 'This is a new product',
      specification: { color: 'Blue', size: 'L' },
      category: 'Electronics',
      price: 30,
      colors: ['Red', 'Blue', 'Green'],
      sizes: ['S', 'M', 'L'],
      numStock: 100
    };

    const response = await myRequest
      .post('/products')
      .set('Cookie', await seller.getSession())
      .send(newProduct);

    expect(response.statusCode).to.equal(StatusCodes.CREATED);
    expect(response.body).to.have.property('result');
    expect(response.body.result).to.have.property('_id');

    const createdProduct = await Product.findById(response.body.result._id);
    expect(createdProduct).to.exist;
  });

  // Add more test cases for different scenarios
});

describe('PUT /products/:id', () => {
  it('should update a product', async () => {
    const productId = 'product_id';
    const updatedProduct = {
      name: 'Updated Product',
      description: 'This is an updated product'
    };

    const response = await myRequest
      .put(`/products/${productId}`)
      .set('Cookie', await seller.getSession())
      .send(updatedProduct);

    expect(response.statusCode).to.equal(StatusCodes.OK);
    expect(response.body).to.have.property('result');
    expect(response.body.result).to.have.property('name', updatedProduct.name);
    expect(response.body.result).to.have.property('description', updatedProduct.description);
  });

  // Add more test cases for different scenarios
});

describe('DELETE /products/:id', () => {
  it('should delete a product', async () => {
    const productId = 'product_id';

    const response = await myRequest
      .delete(`/products/${productId}`)
      .set('Cookie', await seller.getSession());

    expect(response.statusCode).to.equal(StatusCodes.OK);

    const deletedProduct = await Product.findById(productId);
    expect(deletedProduct).to.not.exist;
  });

  // Add more test cases for different scenarios
});
