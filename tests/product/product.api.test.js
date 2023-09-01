const request = require('supertest');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const { seller, admin, loginUser } = require('../test.setup');
const { Product } = require('../../models');

const app = require('../../app');
const myRequest = request(app);

const fakeProducts = require('../FakeData/products.json');

let products;
let product;
describe('Product Test Suite', () => {
  beforeAll(async () => {
    const sellerId = seller.id();

    const fakeProductsArray = Object.values(fakeProducts);
    // Add seller's id to products
    products = fakeProductsArray.map((product) => ({ ...product, seller: sellerId }));

    // Add products to database
    products = await Product.insertMany(products);

    product = products[5];
  });

  describe('GET /products/:id', () => {
    it('should return 404 if product ID not found', async () => {
      const res = await myRequest.get(`/products/000000000000000000000000`).send();

      expect(res.statusCode).to.equal(StatusCodes.NOT_FOUND);
    });

    it('should get a product by ID', async () => {
      const res = await myRequest.get(`/products/${product.id}`).send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('name');
      expect(res.body.result).to.have.property('price');
      expect(res.body.result).to.have.property('description');
      expect(res.body.result.name).to.equal(product.name);
      expect(res.body.result.price).to.equal(product.price);
    });

    it('should succeed: fromCache', async () => {
      const res = await myRequest.get(`/products/${product.id}`).send();

      expect(res.body.status).to.equal(StatusCodes.NOT_MODIFIED);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('name');
      expect(res.body.result).to.have.property('price');
      expect(res.body.result).to.have.property('description');
      expect(res.body.result.name).to.equal(product.name);
      expect(res.body.result.price).to.equal(product.price);

      expect(res.body.message).to.equal('Retrieved data from cache');
    });
  });

  describe('GET /products/search', () => {
    it('should get all products', async () => {
      const res = await myRequest.get('/products/search').send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.be.an('array').of.length(15);
    });

    it('should get products based on specific criteria', async () => {
      const res = await myRequest.get('/products/search?price.gte=70&sort=-numStock').send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.be.an('array').of.length(6);

      const areSatisfying = res.body.result.every((product, index, arr) => {
        if (index === 0) return product.price >= 70;
        return product.price >= 70 && product.numStock <= arr[index - 1].numStock;
      });
      expect(areSatisfying).to.be.true;
    });

    it('should get products using full text search', async () => {
      const res = await myRequest.get('/products/search?txtSearch=Lenovo').send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.be.an('array');
      expect(res.body.result).to.have.lengthOf(2);
      expect(res.body.result[0]).to.satisfy(() => res.body.result[0].name.includes('Lenovo'));
    });

    it('should return an error 404 if no products match the criteria', async () => {
      const res = await myRequest.get('/products/search?name=Non-existent').send();

      expect(res.statusCode).to.equal(StatusCodes.NOT_FOUND);
      expect(res.body).not.to.have.property('result');
    });
  });

  describe('GET /top10-', () => {
    it('should get top 10 cheapest products', async () => {
      const res = await myRequest.get('/products/top10-cheapest').send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.be.an('array');
      expect(res.body.result).to.have.lengthOf.at.most(10);

      const arePricesSorted = res.body.result.every((product, index, arr) => {
        if (index === 0) return true;
        return product.price >= arr[index - 1].price;
      });

      expect(arePricesSorted).to.be.true;
    });

    // Needs reviews to be tested
    it.skip('should get top 10 rated products', async () => {
      const res = await myRequest.get('/products/top10-rated').send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.be.an('array');
      expect(res.body.result).to.have.lengthOf.at.most(10);
      // expect(res.body.result[0].name).to.equal(newProduct2.name);
      // expect(res.body.result[0].price).to.equal(newProduct2.price);
    });

    // Needs to make orders to be tested
    it.skip('should get top 10 sold products', async () => {
      const res = await myRequest.get('/products/top10-sold').send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.be.an('array');
      // expect(res.body.result).to.have.lengthOf(1);
      // expect(res.body.result[0].name).to.equal(newProduct2.name);
      // expect(res.body.result[0].price).to.equal(newProduct2.price);
    });
  });

  describe('POST /products', () => {
    let newProduct;
    beforeAll(() => {
      newProduct = {
        seller: seller.id(),
        name: 'Test Product',
        description: 'Sample product for testing',
        specification: { brand: 'Casio' },
        category: 'Clothes',
        price: 25.0,
        colors: ['black', 'white'],
        sizes: ['X', 'XL'],
        numStock: 5
      };
    });

    it('should fail: not authenticated', async () => {
      const res = await myRequest.post('/products').send(newProduct);

      expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should return 403 if authenticated as non-seller user', async () => {
      // console.log(await admin.getSession());
      const res = await myRequest
        .post('/products')
        .set('Cookie', await admin.getSession())
        .send(newProduct);

      expect(res.statusCode).to.equal(StatusCodes.FORBIDDEN);
    });

    it('should return 400 if product data is invalid', async () => {
      const invalidProduct = {
        name: 'Test Product',
        // e.g. missing price field
        description: 'Sample product for testing'
      };

      const res = await myRequest
        .post('/products')
        .set('Cookie', await seller.getSession())
        .send(invalidProduct);

      expect(res.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    });

    it('should add a new product for authenticated seller', async () => {
      const res = await myRequest
        .post('/products')
        .set('Cookie', await seller.getSession())
        .send(newProduct);

      expect(res.statusCode).to.equal(StatusCodes.CREATED);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('name');
      expect(res.body.result).to.have.property('price');
      expect(res.body.result).to.have.property('description');
      expect(res.body.result.name).to.equal(newProduct.name);
      expect(res.body.result.price).to.equal(newProduct.price);

      // Verify the product is added to the database
      const addedProduct = await Product.findOne({
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category
      });
      expect(addedProduct).to.not.be.null;
      expect(addedProduct.name).to.equal(newProduct.name);
      expect(addedProduct.price).to.equal(newProduct.price);
    });
  });

  let seller2;
  describe('PUT /products/:id', () => {
    let updatedProduct;
    beforeAll(async () => {
      seller2 = { ...seller.details };
      seller2.email = 'seller2@mail.com';
      seller2.phone = 11000000005;

      await myRequest.post('/auth/register').send(seller2);

      updatedProduct = {
        name: 'Updated Product',
        price: 60.0
      };
    });

    it('should update a product', async () => {
      const res = await myRequest
        .put(`/products/${product.id}`)
        .set('Cookie', await seller.getSession())
        .send(updatedProduct);

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('name');
      expect(res.body.result).to.have.property('price');
      expect(res.body.result).to.have.property('description');
      expect(res.body.result.name).to.equal(updatedProduct.name);
      expect(res.body.result.price).to.equal(updatedProduct.price);

      // Verify the changes are reflected in the database
      const updatedProductInDB = await Product.findById(product.id);
      expect(updatedProductInDB.name).to.equal(updatedProduct.name);
      expect(updatedProductInDB.price).to.equal(updatedProduct.price);
    });

    it('should return 404 if product ID not found during update', async () => {
      const res = await myRequest
        .put(`/products/000000000000000000000000`)
        .set('Cookie', await seller.getSession())
        .send(updatedProduct);

      expect(res.statusCode).to.equal(StatusCodes.NOT_FOUND);
    });

    it('should return 401 if not authenticated during update', async () => {
      const res = await myRequest.put(`/products/${product.id}`).send(updatedProduct);

      expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should return 403 if not product owner', async () => {
      const res = await myRequest
        .put(`/products/${product.id}`)
        .set('Cookie', await loginUser(seller2.email, seller2.password))
        .send(updatedProduct);

      expect(res.statusCode).to.equal(StatusCodes.FORBIDDEN);
    });

    it('should return 403 if not authorized during update', async () => {
      const updatedProduct = {
        name: 'Updated Product',
        price: 60.0
      };

      const res = await myRequest
        .put(`/products/${product.id}`)
        .set('Cookie', await admin.getSession()) // Authenticate as admin (not seller)
        .send(updatedProduct);

      expect(res.statusCode).to.equal(StatusCodes.FORBIDDEN);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should return 404 if product ID not found during delete', async () => {
      const res = await myRequest
        .delete(`/products/000000000000000000000000`)
        .set('Cookie', await seller.getSession());

      expect(res.statusCode).to.equal(StatusCodes.NOT_FOUND);
    });

    it('should return 401 if not authenticated during delete', async () => {
      const res = await myRequest.delete(`/products/${product.id}`);

      expect(res.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should return 403 if not product owner', async () => {
      const res = await myRequest
        .delete(`/products/${product.id}`)
        .set('Cookie', await loginUser(seller2.email, seller2.password))
        .send();

      expect(res.statusCode).to.equal(StatusCodes.FORBIDDEN);
    });

    it('should return 403 if not authorized during delete', async () => {
      const res = await myRequest
        .delete(`/products/${product.id}`)
        .set('Cookie', await admin.getSession());

      expect(res.statusCode).to.equal(StatusCodes.FORBIDDEN);
    });

    it('should delete a product', async () => {
      const res = await myRequest
        .delete(`/products/${product.id}`)
        .set('Cookie', await seller.getSession()); // Authenticate as admin

      expect(res.statusCode).to.equal(StatusCodes.OK);

      // Verify the product is deleted from the database
      const deletedProduct = await Product.findById(product.id);
      expect(deletedProduct).to.be.null;
    });
  });
});
