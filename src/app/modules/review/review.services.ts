import { Review, UserRole, UserStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import prisma from "../../shared/prisma";

const createReviewIntoDB = async (user: JwtPayload, payload: Review) => {
  // find user
  const customerData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
  });

  const isExist = await prisma.review.findFirst({
    where: { reviewText: payload.reviewText },
  });

  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "This review already exist!");
  }

  const productExists = await prisma.product.findUnique({
    where: { id: payload.productId },
  });

  if (!productExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid product ID!");
  }

  const result = await prisma.review.create({
    data: { ...payload, customerId: customerData.id },
  });

  return result;
};

export { createReviewIntoDB };
