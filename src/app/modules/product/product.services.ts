import { Product, UserRole, UserStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import prisma from "../../shared/prisma";

const createProductIntoDB = async (user: JwtPayload, payload: Product) => {
  // find vendor
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      role: UserRole.VENDOR,
      status: UserStatus.ACTIVE,
    },
    include: {
      shop: true,
    },
  });

  const isExist = await prisma.product.findFirst({
    where: { name: payload.name },
  });

  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "This product already exist!");
  }

  const categoryExists = await prisma.categories.findUnique({
    where: { id: payload.categoryId },
  });

  if (!categoryExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid category ID!");
  }

  const result = await prisma.product.create({
    data: { ...payload, shopId: vendorData.shop!.id },
  });

  return result;
};

export { createProductIntoDB };
