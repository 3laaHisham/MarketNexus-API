const request = require('supertest');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const app = require('../../app');
const myRequest = request(app);

const { customer, seller, admin } = require('../test.setup');
const { Cart } = require('../../models');

const { productDetails } = require('../FakeData/products.json');
const { cartDetails } = require('../FakeData/carts.json');

let productID, cartID, sellerId, customerId;
const addProduct = async () => {
    productDetails.seller = sellerId;
    console.log("in add product ", sellerId);
    let sellerSession = seller.getSession();
    const res = await myRequest.post('products/').set('Cookie', sellerSession).send(productDetails);
    productID = res.body.result._id;
    productDetails._id = productID;
    // return productID;
};

const addCart = async () => {
    if (!productID)
        addProduct();
    console.log("Before cart");
    let cartProduct = {
        id: productDetails._id,
        price: productDetails.price,
        count: 1,
        color: 'Red',
        size: 'L'
    };
    cartDetails.userId = customerId;
    cartDetails.products[0] = cartProduct;
    console.log("In Cart 2 ", customerId);
    let customerSession = customer.getSession();
    const res = await myRequest.post('cart/products').set('Cookie', customerSession).send(cartProduct);
    cartID = res.body.result._id;
    // return cartID;
};

describe("Testing ", () => {
    beforeAll(async () => {
        sellerId = seller.id();
        customerId = customer.id();
        await addCart();
    });

    it("test a 1", () => {
        console.log("Before expect");
        expect(1).toBe(1);
    });


})