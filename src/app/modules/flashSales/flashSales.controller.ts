import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import {
  createFlashSalesIntoDB,
  getAllFlashSalesFromDB,
  getMyFlashSalesProductsFromDB,
} from "./flashSales.services";

const createFlashSales = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await createFlashSalesIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Flash sale created successfully!",
    data: result,
  });
});

const getAllFlashSales = catchAsync(async (req, res) => {
  const result = await getAllFlashSalesFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Flash sales retrieved successfully!",
    data: result,
  });
});

const getMyFlashSalesProducts = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await getMyFlashSalesProductsFromDB(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My flash sales retrieved successfully!",
    data: result,
  });
});

export { createFlashSales, getAllFlashSales, getMyFlashSalesProducts };
