import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { userFilterableFields } from "./user.constant";
import {
  createUserIntoDB,
  getAllUsersFromDB,
  getMyProfileFromDB,
  getSingleUserFromDB,
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

export { createUser, getAllUsers, getMyProfile, getSingleUser };
