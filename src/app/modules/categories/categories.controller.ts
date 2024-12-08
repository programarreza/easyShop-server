import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import {
  createCategoryIntoDB,
  deleteCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
} from "./categories.services";

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

const getAllCategories = catchAsync(async (req, res) => {
  const result = await getAllCategoriesFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "categories retrieved successfully!",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleCategoryFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "category retrieved successfully!",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateCategoryIntoDB(id, {
    ...req.body,
    images: req.file?.path,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "category updated successfully!",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteCategoryIntoDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "category deleted successfully!",
    data: result,
  });
});

export {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
};
