import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { createFlashSalesIntoDB } from "./flashSales.services";

const createFlashSales = catchAsync(async (req, res) => {
  const result = await createFlashSalesIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Flash sale created successfully!",
    data: result,
  });
});

export { createFlashSales };
