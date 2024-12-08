import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { productFilterableFields } from "./product.constant";
import {
  createProductIntoDB,
  deleteProductIntoDB,
  getAllProductsFromDB,
  getMyProductsFromDB,
  getSingleProductFromDB,
  updateProductFromDB,
} from "./product.services";

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

const getAllProducts = catchAsync(async (req, res) => {
  const filters = pick(req.query, productFilterableFields);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await getAllProductsFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "products retrieved successfully!",
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleProductFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "product retrieved successfully!",
    data: result,
  });
});

const getMyProducts = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await getMyProductsFromDB(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "my product retrieved successfully!",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateProductFromDB(id, {
    ...req.body,
    images: req.file?.path,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "product updated successfully!",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteProductIntoDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "product deleted successfully!",
    data: result,
  });
});

export {
  createProduct,
  deleteProduct,
  getAllProducts,
  getMyProducts,
  getSingleProduct,
  updateProduct,
};
