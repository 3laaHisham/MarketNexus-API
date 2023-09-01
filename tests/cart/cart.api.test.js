const request = require('supertest');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const { customer, seller } = require('../test.setup');
const { Cart, Product } = require('../../models');

const app = require('../../app');
const myRequest = request(app);

const fakeCarts = require('../FakeData/carts.json');
const fakeProducts = require('../FakeData/products.json');
var productID, cartID, sellerId, customerId, customerSession, sellerSession;

sellerId = seller.id();
customerId = customer.id();

let products;
let product;
let cart;
let fakeCartProduct;
function str(obj) {
  return new String(obj).toString();
}
const addProduct = async () => {
  sellerId = seller.id();

  const fakeProductsArray = Object.values(fakeProducts);
  products = fakeProductsArray.map((product) => ({ ...product, seller: sellerId }));
  products = await Product.insertMany(products);

  product = products[14];
  productID = product._id;
  fakeCartProduct = {
    id: productID,
    price: product.price,
    count: 1,
    color: product.colors[0],
    size: product.sizes[0]
  };

  return productID;
};

const addCart = async () => {
  if (cartID) return cartID;
  customerId = customer.id();

  const cartArray = Object.values(fakeCarts);
  cart = cartArray[0];
  cart.userId = customerId;
  cart.products[0] = fakeCartProduct;
  await Cart.deleteMany({});

  const newCart = new Cart(cart);
  await newCart.save();

  cart = newCart;
  cartID = cart.id;

  return cartID;
};

describe('Cart Test Suite', () => {
  beforeAll(async () => {
    if (!productID) await addProduct();
    customerSession = await customer.getSession();
    if (!cartID) await addCart();
  });

  describe('Cart Get/ Test', () => {
    it('should succeed - get the cart ', async () => {
      customerSession = await customer.getSession();
      const res = await myRequest.get('/cart').set('Cookie', customerSession).send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result.products).to.be.an('array').of.length(1);
      expect(res.body.result).to.have.property('userId');
      expect(res.body.result.userId).to.equal(customerId);
      const productIdFromResponse = res.body.result.products[0].id;
      expect(str(productIdFromResponse)).to.equal(str(productID));
    });

    it('should fail - get the cart without authentication', async () => {
      const res = await myRequest.get('/cart').send();
      expect(res.statusCode).not.to.equal(StatusCodes.OK);
    });
  });

  describe('Cart Post/ Testing ', () => {
    beforeAll(async () => {
      await Cart.updateOne({}, { $set: { products: [] } });
    });

    it('should succeed - add a product to the cart ', async () => {
      customerSession = await customer.getSession();

      const res = await myRequest
        .post('/cart/products')
        .set('Cookie', customerSession)
        .send(fakeCartProduct);

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('products');
      expect(res.body.result.products).to.be.an('array').of.length(1);
      expect(res.body.result).to.have.property('userId');
      expect(res.body.result.userId).to.equal(customerId);
      const productIdFromResponse = res.body.result.products[0].id;
      expect(str(productIdFromResponse)).to.equal(str(productID));
    });

    it('should fail - adding a product to the cart without authentication', async () => {
      const res = await myRequest.post('/cart/products').send();

      expect(res.statusCode).not.to.equal(StatusCodes.OK);
    });

    it('should fail - sending a product with id that do not exist', async () => {
      let tempFakeCartProduct = fakeCartProduct;
      tempFakeCartProduct._id = '18';
      customerSession = await customer.getSession();

      const res = await myRequest
        .post('/cart/products')
        .set('Cookie', customerSession)
        .send(tempFakeCartProduct);

      expect(res.statusCode).not.to.equal(StatusCodes.OK);
    });
  });

  describe('Cart put/ Testing ', () => {
    // count = 1 now
    it('should succeed - increase product count in the cart ', async () => {
      customerSession = await customer.getSession();
      const res = await myRequest
        .put(`/cart/products/${productID}/increase`)
        .set('Cookie', customerSession)
        .send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res._body).to.have.property('result');
      expect(res._body.result).to.have.property('products');
      expect(res._body.result.products).to.be.of.length(1);
      expect(res._body.result).to.have.property('userId');
      expect(res._body.result.userId).to.equal(customerId);
      productIdFromResponse = res.body.result.products[0].id;
      expect(str(productIdFromResponse)).to.eql(str(productID));
      expect(res._body.result.products[0].count).to.equal(fakeCartProduct.count + 1);
    });

    // // count = 2 now
    it('should succeed - decrease product count in the cart ', async () => {
      customerSession = await customer.getSession();
      const res = await myRequest
        .put(`/cart/products/${productID}/reduce`)
        .set('Cookie', customerSession)
        .send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res._body).to.have.property('result');
      expect(res._body.result).to.have.property('products');
      expect(res._body.result.products).to.be.of.length(1);
      expect(res._body.result).to.have.property('userId');
      expect(res._body.result.userId).to.equal(customerId);
      productIdFromResponse = res.body.result.products[0].id;
      expect(str(productIdFromResponse)).to.equal(str(productID));
      expect(res.body.result.products[0].count).to.equal(fakeCartProduct.count);
    });
    // count = 1 now
    it('should fail - make the count = 0', async () => {
      customerSession = await customer.getSession();
      const res = await myRequest
        .put(`/cart/products/${productID}/reduce`)
        .set('Cookie', customerSession)
        .send();

      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body.result.products).to.have.length(0);
    });

    // count = 0 now
    it('should fail - make the count = -1', async () => {
      customerSession = await customer.getSession();
      const res = await myRequest
        .put(`/cart/products/${productID}/reduce`)
        .set('Cookie', customerSession)
        .send();

      expect(res.statusCode).to.equal(StatusCodes.NOT_FOUND);
    });

    it('should fail - sending a product with id that do not exist', async () => {
      const res = await myRequest
        .put(`/cart/products/000000000000000000000000/reduce`)
        .set('Cookie', customerSession)
        .send();

      expect(res.statusCode).not.to.equal(StatusCodes.OK);
    });
  });

  describe('Cart delete/ Testing ', () => {
    beforeEach(async () => {
      if (!productID) await addProduct();
      customerSession = await customer.getSession();
      await addCart();
    });

    it('should succeed - deleting a specific product', async () => {
      customerSession = await customer.getSession();
      const res = await myRequest
        .delete(`/cart/products/${productID}/`)
        .set('Cookie', customerSession)
        .send();
      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('products');
      expect(res.body.result.products).to.be.of.length(0);
    });

    it('should succeed - emptying the cart', async () => {
      const res = await myRequest.delete(`/cart/`).set('Cookie', customerSession).send();
      expect(res.statusCode).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property('result');
      expect(res.body.result).to.have.property('products');
      expect(res.body.result.products).to.be.of.length(0);
    });

    it('should fail - deleting a product with id that do not exist', async () => {
      const res = await myRequest
        .delete(`/cart/products/000000000000000000000000/`)
        .set('Cookie', customerSession)
        .send();
      expect(res.statusCode).to.equal(StatusCodes.OK);
    });
  });
});
