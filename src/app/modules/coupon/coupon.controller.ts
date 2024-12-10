import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { createCouponIntoDB, getCouponFromDB } from "./coupon.services";

const createCoupon = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await createCouponIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon created successfully!",
    data: result,
  });
});

const getCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getCouponFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon retrieved successfully!",
    data: result,
  });
});

export { createCoupon, getCoupon };
