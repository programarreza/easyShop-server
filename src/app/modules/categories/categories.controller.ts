import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { createCategoryIntoDB } from "./categories.services";

const createCategory = catchAsync(async (req, res) => {
  const result = await createCategoryIntoDB({
    ...req.body,
    images: req.file?.path,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category created successfully!",
    data: result,
  });
});

export { createCategory };
