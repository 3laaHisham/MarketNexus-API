const { StatusCodes } = require('http-status-codes');
const Product = require('../../models');
const { HttpError, verifySchema } = require('../../utils');

const {
  queryProductsSchema,
  updateProductSchema,
  addProductSchema
} = require('./product.schema');

const getProducts = async (query) => {
  const isValidSchema = await verifySchema(queryProductsSchema, query);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Not valid query');

  const fullTextSearch = { name: query.name, description: query.description };
  delete query.name;
  delete query.description;

  const products = Product.find(query).populate('reviews');
  if (query.name || query.description) products.search(fullTextSearch);
  products = products.exec();

  if (!products)
    throw new HttpError(StatusCodes.NOT_FOUND, 'No products for given query');

  return {
    status: StatusCodes.OK,
    message: 'Product retrieved successfully',
    result: products
  };
};

const addProduct = async (product) => {
  const isValidSchema = await verifySchema(addProductSchema, product);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Schema not satisfied');

  const newProduct = new Product(product);
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
  const product = await Product.findByIdfindByIdAndDelete(id);
  if (!product) throw new HttpError(StatusCodes.NOT_FOUND, 'Product not found');

  return {
    status: StatusCodes.OK,
    message: 'Product deleted successfully'
  };
};

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };
