import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { createProductIntoDB } from "./product.services";

const createProduct = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await createProductIntoDB(user, {
    ...req.body,
    images: req.file?.path,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product created successfully!",
    data: result,
  });
});

export { createProduct };
