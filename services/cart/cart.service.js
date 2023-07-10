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

async function isAvailable(productID, color, size) {

    const product = await productModel.findOne({ _id: productID, "product.color": color, "product.size": size });

    return product;
}


async function addProduct(userID, newProduct) {
    if (await !verifySchema(cartSchema, newProduct))
        throw new HttpError(StatusCodes.BAD_REQUEST, "product is not valid");
    if (await !isAvailable(product.id, product.color, product.size))
        throw new HttpError(StatusCodes.NOT_FOUND, "product is not available");


    //start transaction

    let currentCart = await cartModel.findOneAndUpdate({ userId: userID }, { $push: newProduct }, { new: true });

    if (!currentCart)
        currentCart = await createNewCart(userId);

    currentCart = await cartModel.findOneAndUpdate({ userId: userID }, { $push: newProduct }, { new: true });
    if (!currentCart) {
        //TODO
        await returnProduct(product.id, product.color, product.size);
        throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "product can not be added to the cart");
    }
    return {
        status: StatusCodes.OK,
        message: "product is added to cart successfully",
        result: currentCart
    }
}
async function changeCountOfProduct(productId, amount, userID) {

    const updatedCart = await cartModel.findOneAndUpdate({ userID: userID, 'product.id': productId }, { $inc: { "product.$[].count": amount } }, { new: true });

    if (!updatedCart)
        throw new HttpError(StatusCodes.NOT_FOUND, "product is not found in the cart. Count update failed ");

    return {
        status: StatusCodes.OK,
        message: "product count is updated successfully",
        result: updatedCart
    }
}
async function getCurrentCart(userID) {
    const cart = await cartModel.find({ userID: userID })
    if (!cart) throw new HttpError(StatusCodes.NOT_FOUND, "No carts found");

    return {
        status: StatusCodes.OK,
        message: "cart is retrieved successfully",
        result: cart,
    };
}
async function deleteCurrentCart(userID) {
    const cart = await cartModel.deleteOne({ userID: userID })
    if (!cart) throw new HttpError(StatusCodes.NOT_FOUND, "No carts found to be deleted");

    return {
        status: StatusCodes.OK,
        message: "cart is deleted successfully",
        result: cart,
    };
}

async function deleteProduct(productID, userID) {
    //TODO
    return {
        status: StatusCodes.OK,
        message: "cart is deleted successfully",
        result: cart,
    };
}
