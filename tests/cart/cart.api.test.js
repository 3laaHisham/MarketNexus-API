const request = require('supertest');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const app = require('../../app');
const myRequest = request(app);

const { customer, seller, admin } = require('../test.setup');
const { Cart } = require('../../models');

const { productDetails } = require('../FakeData/products.json');
const { cartDetails } = require('../FakeData/carts.json');

let productID, cartID, sellerId, customerId, customerSession, sellerSession;
let cartProduct = {
    id: productDetails._id,
    price: productDetails.price,
    count: 1,
    color: 'Red',
    size: 'L'
};
const addProduct = async () => {
    productDetails.seller = sellerId;
    // console.log("in add product ", sellerId);
    // sellerSession = seller.getSession();
    const res = await myRequest.post('products/').set('Cookie', sellerSession).send(productDetails);
    productID = res.body.result._id;
    productDetails._id = productID;
    cartProduct.id = productID;
    return productID;
};

const addCart = async () => {

    // console.log("Before cart");
    // console.log("In Cart 2 ", customerId);
    //This a joke we use the endpoint to test itself :)
    const res = await myRequest.post('cart/products').set('Cookie', customerSession).send(cartProduct);
    cartID = res.body.result._id;
    // return cartID;
};


describe("Cart Get/ Test", () => {
    beforeAll(async () => {
        sellerId = seller.id();
        customerId = customer.id();
        if (!productID) {
            if (!sellerSession)
                sellerSession = seller.getSession();
            await addProduct();
        }
        cartDetails.userId = customerId;
        cartDetails.products[0] = cartProduct;
        customerSession = customer.getSession();
        await addCart();
    });

    it("should succeed - get the cart ", async () => {
        // console.log("Before expect");
        const res = await myRequest.get('/cart').set('Cookie', customerSession).send();
        expect(res.statusCode).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property('result');
        expect(res.body.result).to.have.property('products');
        expect(res.body.result.products).to.be.of.length(1);
        expect(res.body.result).to.have.property('userId');
        expect(res.body.result.userId).to.equal(customerId);
        productIdFromResponse = res.body.result.products[0].productId;
        expect(productIdFromResponse).to.equal(productID);
        //     totalPriceOfProducts = Number((Number(res.body.result.totalAmount)).toFixed(2));
        //     expect(totalPriceOfProducts).to.equal(Number((Number(productDetails.price)).toFixed(2)));
        //     quantityAddedToCart = res.body.result.quantityTotal;
        //     expect(quantityAddedToCart).to.equal(1);        

    });
    it("should fail - get the cart without authorization", async () => {

        const res = await myRequest.get('/cart').send();
        expect(res.statusCode).not.to.equal(StatusCodes.OK);
    })


});


describe("Cart Post/ Testing ", () => {

    beforeAll(async () => {
        sellerId = seller.id();
        customerId = customer.id();
        if (!productID) {
            if (!sellerSession)
                sellerSession = seller.getSession();
            await addProduct();
        }
        cartDetails.userId = customerId;
        cartDetails.products[0] = cartProduct;
        customerSession = customer.getSession();
        // await addCart();
    });
    it("should succeed - add a product to the cart ", async () => {
        // console.log("Before expect");
        const res = await myRequest.get('/cart/products').set('Cookie', customerSession).send(cartProduct);
        expect(res.statusCode).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property('result');
        expect(res.body.result).to.have.property('products');
        expect(res.body.result.products).to.be.of.length(1);
        expect(res.body.result).to.have.property('userId');
        expect(res.body.result.userId).to.equal(customerId);
        productIdFromResponse = res.body.result.products[0].productId;
        expect(productIdFromResponse).to.equal(productID);

    });
    it("should fail - adding a product to the cart without authorization", async () => {

        const res = await myRequest.get('/cart/products').send();
        expect(res.statusCode).not.to.equal(StatusCodes.OK);
    });

    it("should fail - sending a product with id that do not exist", async () => {
        let tempCartProduct = cartProduct;
        tempCartProduct.id = '0v1';
        const res = await myRequest.get('/cart/products').set('Cookie', customerSession).send(cartProduct);
        expect(res.statusCode).not.to.equal(StatusCodes.OK);
    });


});



describe("Cart put/ Testing ", () => {

    beforeAll(async () => {
        sellerId = seller.id();
        customerId = customer.id();
        if (!productID) {
            if (!sellerSession)
                sellerSession = seller.getSession();
            await addProduct();
        }
        cartDetails.userId = customerId;
        cartDetails.products[0] = cartProduct;
        customerSession = customer.getSession();
        await addCart();
    });
    // count = 1 now
    it("should succeed - increase product count in the cart ", async () => {
        // console.log("Before expect");
        const res = await myRequest.get(`/cart/products/${productID}}/increase`).set('Cookie', customerSession).send(cartProduct);
        expect(res.statusCode).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property('result');
        expect(res.body.result).to.have.property('products');
        expect(res.body.result.products).to.be.of.length(1);
        expect(res.body.result).to.have.property('userId');
        expect(res.body.result.userId).to.equal(customerId);
        productIdFromResponse = res.body.result.products[0].productId;
        expect(productIdFromResponse).to.equal(productID);
        expect(res.body.result.products[0].count - 1).to.equal(cartProduct.count);
    });

    // count = 2 now
    it("should succeed - decrease product count in the cart ", async () => {
        // console.log("Before expect");
        const res = await myRequest.get(`/cart/products/${productID}}/decrease`).set('Cookie', customerSession).send();
        expect(res.statusCode).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property('result');
        expect(res.body.result).to.have.property('products');
        expect(res.body.result.products).to.be.of.length(1);
        expect(res.body.result).to.have.property('userId');
        expect(res.body.result.userId).to.equal(customerId);
        productIdFromResponse = res.body.result.products[0].productId;
        expect(productIdFromResponse).to.equal(productID);
        expect(res.body.result.products[0].count).to.equal(cartProduct.count);
    });
    // count = 1 now
    it("should succeed - make the count = 0", async () => {
        // console.log("Before expect");
        expect(res.statusCode).to.equal(StatusCodes.OK);
        expect(productIdFromResponse).to.equal(productID);
        expect(res.body.result.products).to.be.of.length(0);
    });

    // count = 0 now


    it("should fail - sending a product with id that do not exist", async () => {
        const res = await myRequest.get(`/cart/products/0000/decrease`).set('Cookie', customerSession).send();
        expect(res.statusCode).not.to.equal(StatusCodes.OK);
    });


});

describe("Cart delete/ Testing ", () => {

    beforeEach(async () => {
        sellerId = seller.id();
        customerId = customer.id();
        if (!productID) {
            if (!sellerSession)
                sellerSession = seller.getSession();
            await addProduct();
        }
        cartDetails.userId = customerId;
        cartDetails.products[0] = cartProduct;
        // if(!customerSession)
        customerSession = customer.getSession();
        await addCart();
    });
    it("should succeed - deleting a specific product", async () => {
        // console.log("Before expect");
        const res = await myRequest.delete(`/cart/products/${productID}}/`).set('Cookie', customerSession).send();
        expect(res.statusCode).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property('result');
        expect(res.body.result).to.have.property('products');
        expect(res.body.result.products).to.be.of.length(0);
    });

    it("should succeed - emptying the cart", async () => {

        const res = await myRequest.delete(`/cart/`).set('Cookie', customerSession).send();
        expect(res.statusCode).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property('result');
        expect(res.body.result).to.have.property('products');
        expect(res.body.result.products).to.be.of.length(0);


    });


    it("should fail - deleting a product with id that do not exist", async () => {
        const res = await myRequest.delete(`/cart/products/${productID}}/`).set('Cookie', customerSession).send();
        expect(res.statusCode).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property('result');
        expect(res.body.result).to.have.property('products');
        expect(res.body.result.products).to.be.of.length(1);
    });


});


