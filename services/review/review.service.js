const { StatusCodes } = require("http-status-codes");
const reviewSchema = require("./review.schema");
const validateReview = require("./review.schema");
const { HttpError, isValid } = require("../../utils");
const reviewModel = require("../../models");

async function createNewreview(review) {
  const isReviewValid = await isValid(reviewSchema, review);
  if (!isReviewValid)
    throw new HttpError(StatusCodes.BAD_REQUEST, "review fields are not valid");

  try {
    const newReview = new reviewModel({ review });

    const savedReview = await newReview.save();
    return {
      status: StatusCodes.OK,
      message: "review created successfully",
      result: savedReview,
    };
  } catch (error) {
    throw new HttpError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Can not create review"
    );
  }
}

async function getAllReviews() {
  const reviews = await reviewModel.find({}).populate("userID", "name email");
  if (!reviews) throw new HttpError(StatusCodes.NOT_FOUND, "No reviews found");

  return {
    status: StatusCodes.OK,
    message: "All reviews are retrieved successfully ",
    result: reviews,
  };
}

async function getReviewById(id) {
  const review = await reviewModel
    .findOne({ _id: id })
    .populate("userID", "name email");
  if (!review) throw new HttpError(StatusCodes.NOT_FOUND, "No review found");

  return {
    status: StatusCodes.OK,
    message: "review retrieved successfully",
    result: review,
  };
}
async function updateReview(reviewID, newMessage, newNumberOfStars) {
  let updatedReview;

  if (newMessage) {
    updatedReview = await reviewModel.findOneAndUpdate(
      { _id: reviewID },
      { message: newMessage },
      { new: true }
    );
    if (!updatedReview)
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        "review message update failed"
      );
  }
  if (newNumberOfStars) {
    updatedReview = await reviewModel.findOneAndUpdate(
      { _id: reviewID },
      { message: newMessage },
      { new: true }
    );
    if (!updatedReview)
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        "review number of stars update failed"
      );
  }
  if (!updateReview)
    throw new HttpError(StatusCodes.NOT_FOUND, "review was not updated");
  return {
    status: StatusCodes.OK,
    message: "review updated successfully",
    result: updatedReview,
  };
}
async function deleteReview(reviewID) {
  const deletedReview = await Review.findOneAndDelete({ _id: reviewID });
  if (!deletedReview)
    throw new HttpError(
      StatusCodes.NOT_FOUND,
      "review was not found to be deleted"
    );

  return {
    status: StatusCodes.OK,
    message: "review deleted successfully",
    result: deletedReview,
  };
}
