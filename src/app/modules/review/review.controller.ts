import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { createReviewIntoDB } from "./review.services";

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

export { createReview };
