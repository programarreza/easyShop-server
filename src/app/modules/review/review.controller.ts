import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getMyProductReviewsFromDB,
  getMyReviewsFromDB,
} from "./review.services";

const createReview = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await createReviewIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review created successfully!",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const result = await getAllReviewsFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews retrieved successfully!",
    data: result,
  });
});

const getMyReviews = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await getMyReviewsFromDB(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My reviews retrieved successfully!",
    data: result,
  });
});

const getMyProductReviews = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await getMyProductReviewsFromDB(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My products reviews retrieved successfully!",
    data: result,
  });
});

export { createReview, getAllReviews, getMyProductReviews, getMyReviews };
