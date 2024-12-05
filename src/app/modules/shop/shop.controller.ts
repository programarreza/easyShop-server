import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import {
  createShopIntoDB,
  getAllShopsFromDB,
  getSingleShopFromDB,
} from "./shop.services";

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

const getAllShops = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["name"]);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await getAllShopsFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shops retrieved successfully!",
    data: result,
  });
});

const getSingleShop = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleShopFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shop retrieved successfully!",
    data: result,
  });
});

export { createShop, getAllShops, getSingleShop };
