import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { createOrderIntoDB } from "./order.services";

// controller
const createOrder = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await createOrderIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order created successfully!",
    data: result,
  });
});

export { createOrder };
