import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { userFilterableFields } from "./user.constant";
import {
  createUserIntoDB,
  deleteUserIntoDB,
  getAllUsersFromDB,
  getMyProfileFromDB,
  getSingleUserFromDB,
  updateProfileFromDB,
  userStatusChangeIntoDB,
} from "./user.services";

const createUser = catchAsync(async (req, res) => {
  const result = await createUserIntoDB({
    ...req.body,
    profilePhoto: req.file?.path,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User created successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await getAllUsersFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users retrieved successfully!",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await getSingleUserFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await getMyProfileFromDB(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My profile retrieved successfully!",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await updateProfileFromDB(user, {
    ...req.body,
    profilePhoto: req.file?.path,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Profile updated successfully!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await deleteUserIntoDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User deleted successfully!",
    data: result,
  });
});

const userStatusChange = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userStatusChangeIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User status changed successfully!",
    data: result,
  });
});

export {
  createUser,
  deleteUser,
  getAllUsers,
  getMyProfile,
  getSingleUser,
  updateProfile,
  userStatusChange
};
