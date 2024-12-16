import { Review, UserRole, UserStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import prisma from "../../shared/prisma";

const createReviewIntoDB = async (user: JwtPayload, payload: Review) => {
  // find the customer
  const customerData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
  });

  // Check if the review already exists for this product
  const isExist = await prisma.review.findFirst({
    where: { customerId: customerData.id, productId: payload.productId },
  });

  if (isExist) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "This product review can only be submitted once."
    );
  }

  // Check if the customer has purchased this product
  const orderExists = await prisma.order.findFirst({
    where: {
      customerId: customerData.id,
      orderItems: {
        some: {
          productId: payload.productId,
        },
      },
    },
  });

  if (!orderExists) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This product does not belong to your order history."
    );
  }

  // create the review
  const newReview = await prisma.review.create({
    data: {
      ...payload,
      customerId: customerData.id,
    },
  });

  // calculate the average rating
  const averageRating = await prisma.review.aggregate({
    where: {
      productId: payload.productId,
    },
    _avg: {
      rating: true,
    },
  });

  // Convert Decimal to number
  const avgRating = averageRating._avg.rating?.toNumber() || 0;

  // update the products rating field
  await prisma.product.update({
    where: {
      id: payload.productId,
    },
    data: {
      rating: Math.floor(avgRating),
    },
  });

  return newReview;
};

const getAllReviewsFromDB = async () => {
  const result = await prisma.review.findMany();

  return result;
};

const getMyReviewsFromDB = async (user: JwtPayload) => {
  const customerData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const result = await prisma.review.findMany({
    where: {
      customerId: customerData.id,
    },
    include: {
      product: true,
    },
  });

  return result;
};

const getMyProductReviewsFromDB = async (user: JwtPayload) => {
  // find the vendor
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  // find the shop associated width the vendor
  const shopData = await prisma.shop.findUniqueOrThrow({
    where: {
      vendorId: vendorData.id,
    },
    include: {
      product: true,
    },
  });

  // get the product IDs from the shop
  const productIds = shopData.product.map((product) => product.id);

  const result = await prisma.review.findMany({
    where: {
      productId: { in: productIds },
    },
    include: {
      product: true,
    },
  });

  return result;
};

export {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getMyProductReviewsFromDB,
  getMyReviewsFromDB,
};
