const { StatusCodes } = require('http-status-codes');

const { createReviewSchema, queryReviewsSchema, updateReviewSchema } = require('./review.schema');

const { APIFeatures, HttpError, verifySchema, setRedis, keyGenerator } = require('../../utils');
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

  const reviews = await apiFeatures.getQueryObj().populate('userId', 'name email');
  if (!reviews) throw new HttpError(StatusCodes.NOT_FOUND, 'No reviews found');

  const key = { route: 'review', ...query };
  const sortedKey = keyGenerator(key);
  await setRedis(sortedKey, reviews);

  return {
    status: StatusCodes.OK,
    message: 'All reviews are retrieved successfully ',
    result: reviews
  };
}

async function updateReview(reviewID, newReview) {
  const isReviewValid = await verifySchema(updateReviewSchema, newReview);
  if (!isReviewValid) throw new HttpError(StatusCodes.BAD_REQUEST, 'Review schema is not valid');

  const updatedReview = await Review.findByIdAndUpdate(reviewID, newReview, {
    new: true
  });
  if (!updatedReview) throw new HttpError(StatusCodes.NOT_FOUND, 'Review update failed');

  return {
    status: StatusCodes.OK,
    message: 'Review updated successfully',
    result: updatedReview
  };
}
async function deleteReview(reviewID) {
  const deletedReview = await Review.findByIdAndDelete(reviewID);
  if (!deletedReview)
    throw new HttpError(StatusCodes.NOT_FOUND, 'Review was not found to be deleted');

  return {
    status: StatusCodes.OK,
    message: 'Review deleted successfully',
    result: deletedReview
  };
}

module.exports = { getReviews, createNewReview, updateReview, deleteReview };
