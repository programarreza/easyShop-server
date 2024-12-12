import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { createCouponIntoDB, deleteCouponIntoDB } from "./coupon.services";

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

const deleteCoupon = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await deleteCouponIntoDB(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon deleted successfully!",
    data: result,
  });
});

export { createCoupon, deleteCoupon };
