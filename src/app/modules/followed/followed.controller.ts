import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { createFollowIntoDB, getMyFollowedFromDB } from "./followed.services";

const createFollow = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await createFollowIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Followed successfully!",
    data: result,
  });
});

const getMyFollowed = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await getMyFollowedFromDB(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My followed retrieved successfully!",
    data: result,
  });
});

export { createFollow, getMyFollowed };
