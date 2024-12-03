import { UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../error/AppError";
import { generateToken, verifyToken } from "../../helpers/jwtHelpers";
import prisma from "../../shared/prisma";
import { TChangePassword } from "./auth.interface";
import emailSender from "./emailSender";

const loginUserFromDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshTokenIntoDB = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, config.jwt_refresh_secret as string);
  } catch (error) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { accessToken };
};

const changePasswordIntoDB = async (
  user: JwtPayload,
  payload: TChangePassword
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  // check password
  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Password incorrect!");
  }

  // hashed password
  const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

  // update password
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};

const forgotPasswordIntoDB = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const userInfo = {
    email: userData.email,
    role: userData.role,
  };

  const resetPassToken = generateToken(
    userInfo,
    config.jwt_reset_pass_secret as string,
    config.jwt_reset_pass_token_expires_in as string
  );

  // http://localhost:3000/reset-pass?email=reza@gmail.com&token=ncnlcnzxncznccnxzc

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  await emailSender(
    userData.email,
    `
    <div>
    <p>Dear User </p>
    <p>You requested a password reset for your EasyShop account. Please click the link below to reset your password:</p>
    <a href=${resetPassLink}>
      <button>
        Reset Password Link
      </button>
    </a>

    <p>Note: This link is valid for only 10 minutes. If you did not request this change, please ignore this message.</p>

    <p>Stay safe,</p>
    <p>The EasyShop Team</p>
    
    </div>
    `
  );
};

const resetPasswordIntoDB = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = verifyToken(
    token,
    config.jwt_reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new AppError(StatusCodes.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // update password
  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password reset successfully!",
  };
};

export {
  changePasswordIntoDB,
  forgotPasswordIntoDB,
  loginUserFromDB,
  refreshTokenIntoDB,
  resetPasswordIntoDB,
};
