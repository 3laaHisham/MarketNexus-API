const { StatusCodes } = require('http-status-codes');

const { createReviewSchema, queryReviewsSchema, updateReviewSchema } = require('./review.schema');

const { APIFeatures, HttpError, verifySchema, putRedis, keyGenerator } = require('../../utils');
const { Review, Product } = require('../../models');

async function createNewReview(userId, productId, review) {
  const isReviewValid = await verifySchema(createReviewSchema, review);
  if (!isReviewValid) throw new HttpError(StatusCodes.BAD_REQUEST, 'Review schema is not valid');

  // Check if user & product exist
  const existingProduct = await Product.findById(productId);
  if (!existingProduct) throw new HttpError(StatusCodes.NOT_FOUND, 'User was not found');

  const newReview = new Review({
    userId,
    productId,
    date: Date.now(),
    ...review
  });
  const savedReview = await newReview.save();

  // Modify reviewed product
  const product = await Product.findById(productId);
  product.numReviews += 1;

  product.avgRating =
    (product.avgRating * (product.numReviews - 1) + review.numStars) / product.numReviews;
  product.avgRating = Math.round(product.avgRating * 2) / 2; // Round to nearest 0.5

  await product.save();

  return {
    status: StatusCodes.OK,
    message: 'Review created successfully',
    result: savedReview
  };
}

async function getReviews(query) {
  const isQueryValid = await verifySchema(queryReviewsSchema, query);
  if (!isQueryValid) throw new HttpError(StatusCodes.BAD_REQUEST, 'Review schema is not valid');

  const apiFeatures = new APIFeatures(Review, query);

  const reviews = await apiFeatures
    .getQueryObj()
    .populate('productId', 'name description')
    .populate('userId', 'name email');
  if (reviews.length == 0) throw new HttpError(StatusCodes.NOT_FOUND, 'No reviews found');
  if (reviews.length == 1) reviews = reviews[0];

  const key = { route: 'review', ...query };
  const sortedKey = keyGenerator(key);
  await putRedis(sortedKey, reviews);

  return {
    status: StatusCodes.OK,
    message: 'All reviews are retrieved successfully ',
    result: reviews
  };
}

async function updateReview(reviewID, newReview) {
  const isReviewValid = await verifySchema(updateReviewSchema, newReview);
  if (!isReviewValid) throw new HttpError(StatusCodes.BAD_REQUEST, 'Review schema is not valid');

  const review = await Review.findById(reviewID);
  const oldRating = review.numStars;
  const updateReview = await review.updateOne(newReview, { new: true });
  if (!review) throw new HttpError(StatusCodes.NOT_FOUND, 'Review update failed');

  if (newReview.numStars) {
    const product = await Product.findById(review.productId);

    product.avgRating =
      (product.avgRating * product.numReviews - oldRating + newReview.numStars) /
      product.numReviews;
    product.avgRating = Math.round(product.avgRating * 2) / 2; // Round to nearest 0.5

    await product.save();
  }

  return {
    status: StatusCodes.OK,
    message: 'Review updated successfully',
    result: updateReview
  };
}
async function deleteReview(reviewID) {
  const deletedReview = await Review.findByIdAndDelete(reviewID);
  if (!deletedReview)
    throw new HttpError(StatusCodes.NOT_FOUND, 'Review was not found to be deleted');

  const product = await Product.findById(deletedReview.productId);
  product.numReviews -= 1;

  product.avgRating =
    (product.avgRating * product.numReviews - deletedReview.numStars) / (product.numReviews - 1);
  product.avgRating = Math.round(product.avgRating * 2) / 2; // Round to nearest 0.5

  await product.save();

  return {
    status: StatusCodes.OK,
    message: 'Review deleted successfully',
    result: deletedReview
  };
}

module.exports = { getReviews, createNewReview, updateReview, deleteReview };
