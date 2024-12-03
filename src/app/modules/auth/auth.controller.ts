import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import {
  changePasswordIntoDB,
  forgotPasswordIntoDB,
  loginUserFromDB,
  refreshTokenIntoDB,
  resetPasswordIntoDB,
} from "./auth.services";

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await loginUserFromDB(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully!",
    data: {
      accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await refreshTokenIntoDB(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "token generate successfully!",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await changePasswordIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "password changed successfully!",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await forgotPasswordIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "forgot password link send successfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization || "";
  const result = await resetPasswordIntoDB(token, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "reset password successfully!",
    data: result,
  });
});

export {
  changePassword,
  forgotPassword,
  loginUser,
  refreshToken,
  resetPassword,
};
