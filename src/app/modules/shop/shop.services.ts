import { Shop, UserRole, UserStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import prisma from "../../shared/prisma";

const createShopIntoDB = async (user: JwtPayload, payload: Shop) => {
  // find vendor
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      role: UserRole.VENDOR,
      status: UserStatus.ACTIVE,
    },
  });

  const isExist = await prisma.shop.findFirst({
    where: { name: payload.name },
  });

  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "This shop already exist!");
  }

  const result = await prisma.shop.create({
    data: { ...payload, vendorId: vendorData.id },
  });

  return result;
};

export { createShopIntoDB };
