import { StatusCodes } from "http-status-codes";
import Product from "../../models";
import { HttpError, verifySchema } from "../../utils";

import {
  queryProductsSchema,
  updateProductSchema,
  addProductSchema,
} from "./product.schema";

const getProducts = async (query) => {
  let isValidSchema = await verifySchema(queryProductsSchema, query);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Not valid query");

  const fullTextSearch = { name: query.name, description: query.description };
  delete query.name;
  delete query.description;

  let products = Product.find(query).populate("reviews");
  if (query.name || query.description) products.search(fullTextSearch);
  products = products.exec();

  if (!products)
    throw new HttpError(StatusCodes.NOT_FOUND, "No products for given query");

  return {
    status: StatusCodes.OK,
    message: "Product retrieved successfully",
    result: products,
  };
};

const addProduct = async (body) => {
  let isValidSchema = await verifySchema(addProductSchema, body);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Schema not satisfied");

  const product = new Product(body);
  await product.save();

  return {
    status: StatusCodes.CREATED,
    message: "Product created successfully",
    result: product,
  };
};

const updateProduct = async (id, body) => {
  let isValidSchema =
    (await verifySchema(queryProductsSchema, id)) &&
    (await verifySchema(updateProductSchema, body));
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Not valid id or schema");

  let updatedProduct = await Product.findOneAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!updatedProduct)
    throw new HttpError(StatusCodes.NOT_FOUND, "Product not found");

  return {
    status: StatusCodes.OK,
    message: "Product updated successfully",
    result: updatedProduct,
  };
};

const deleteProduct = async (id) => {
  await verifySchema(queryProductsSchema, id);
  if (!isValidSchema)
    throw new HttpError(StatusCodes.BAD_REQUEST, "Not valid id");

  let product = await Product.findOneAndDelete(id);
  if (!product) throw new HttpError(StatusCodes.NOT_FOUND, "Product not found");

  return {
    status: StatusCodes.OK,
    message: "Product deleted successfully",
  };
};

export { getProducts, addProduct, updateProduct, deleteProduct };
