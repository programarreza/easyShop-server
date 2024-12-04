import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { createShopIntoDB } from "./shop.services";

const createShop = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await createShopIntoDB(user, {
    ...req.body,
    logo: req.file?.path,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shop created successfully!",
    data: result,
  });
});

export { createShop };
