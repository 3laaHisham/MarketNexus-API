const { StatusCodes } = require("http-status-codes");
const cartSchema = require("./cart.schema");
const { HttpError, verifySchema } = require("../../utils");
const cartModel = require("../../models");
const productModel = require("../../models");


async function createNewCart(userId) {
    const newCart = new cartModel({
        userId: userId,
        products: []
    });
    const savedCart = await newCart.save();
    return savedCart
}

async function isAvailableAndUpdate(productID, color, size) {

    const product = await productModel.findOne({ _id: productID, "product.color": color, "product.size": size });
    if (product) {
        //TODO remove it from products document(-1 from size and remove the size and the color)
    }
    return product;
}


async function addProduct(userID, newProduct) {
    if (await !verifySchema(cartSchema, newProduct))
        throw new HttpError(StatusCodes.BAD_REQUEST, "product is not valid");
    if (await !isAvailableAndUpdate(product.id, product.color, product.size))
        throw new HttpError(StatusCodes.NOT_FOUND, "product is not available");


    //start transaction

    let currentCart = await cartModel.findOneAndUpdate({ userId: userID }, { $push: newProduct }, { new: true });

    if (!currentCart)
        currentCart = await createNewCart(userId);

    currentCart = await cartModel.findOneAndUpdate({ userId: userID }, { $push: newProduct }, { new: true });
    if (!currentCart) {
        //TODO
        // add the removed product to products model
        await returnProduct(product.id, product.color, product.size);
        throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "product can not be added to the cart");
    }
    return {
        status: StatusCodes.OK,
        message: "product is added to cart successfully",
        result: currentCart
    }
}

async function g() {
    const carts = await cartModel
        .find({})
        .populate("userID", "name email")
        .populate("products.id", "name")
        .populate("StripePaymentId");
    if (!carts) throw new HttpError(StatusCodes.NOT_FOUND, "No carts found");

    return {
        status: StatusCodes.OK,
        message: "All cart are retrieved successfully",
        result: carts,
    };
}