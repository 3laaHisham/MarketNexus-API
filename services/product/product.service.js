const { StatusCodes } = require('http-status-codes');
const { Product } = require('../../models');
const {
  APIFeatures,
  HttpError,
  verifySchema,
  setRedis
} = require('../../utils');

const {
  queryProductsSchema,
  updateProductSchema,
  addProductSchema
} = require('./product.schema');

const getProducts = async (query) => {
  const isValidSchema = await verifySchema(queryProductsSchema, query);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Not valid query');

  const apiFeatures = APIFeatures(Product, query);

  const products = await apiFeatures
    .query()
    .populate('reviews', 'message numStars')
    .populate('sellerId', 'name email');
  if (!products)
    throw new HttpError(StatusCodes.NOT_FOUND, 'No products found');

  const key = Object.assign('product', query);
  await setRedis(key, products);

  return {
    status: StatusCodes.OK,
    message: 'Product retrieved successfully',
    result: products
  };
};

const addProduct = async (sellerId, product) => {
  const isValidSchema = await verifySchema(addProductSchema, product);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Schema not satisfied');

  const newProduct = new Product({ sellerId, ...product });
  await newProduct.save();

  return {
    status: StatusCodes.CREATED,
    message: 'Product created successfully',
    result: newProduct
  };
};

const updateProduct = async (id, product) => {
  const isValidSchema = await verifySchema(updateProductSchema, product);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Not valid schema');

  const updatedProduct = await Product.findByIdAndUpdate(id, product, {
    new: true,
    runValidators: true
  });
  if (!updatedProduct)
    throw new HttpError(StatusCodes.NOT_FOUND, 'Product not found');

  return {
    status: StatusCodes.OK,
    message: 'Product updated successfully',
    result: updatedProduct
  };
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new HttpError(StatusCodes.NOT_FOUND, 'Product not found');

  return {
    status: StatusCodes.OK,
    message: 'Product deleted successfully'
  };
};

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };
