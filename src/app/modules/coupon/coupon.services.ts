import { UserStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import prisma from "../../shared/prisma";

const createCouponIntoDB = async (user: JwtPayload, payload: any) => {
  // find vendor data
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      shop: true,
    },
  });

  //   find shop data
  const shopData = await prisma.shop.findUniqueOrThrow({
    where: {
      id: vendorData.shop?.id,
      isDeleted: false,
    },
  });

  // Check if a coupon already exists for this shop
  const existingCoupon = await prisma.coupon.findFirst({
    where: {
      shopId: shopData.id,
      isDeleted: false,
    },
  });

  if (existingCoupon) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "This shop coupon already exists."
    );
  }

  //   create coupon by shop
  const result = await prisma.coupon.create({
    data: { ...payload, shopId: shopData.id },
  });

  return result;
};

const getCouponFromDB = async (shopId: string) => {
  // Find shop data
  const shopData = await prisma.shop.findUniqueOrThrow({
    where: {
      id: shopId,
    },
  });

  // Fetch coupon data
  const coupon = await prisma.coupon.findUnique({
    where: {
      shopId: shopData.id,
    },
    include: {
      shop: true, // Optional: Include shop data if needed
    },
  });

  // Ensure the coupon exists and is not deleted
  if (!coupon || coupon.isDeleted) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "No valid coupon found for this shop."
    );
  }

  // Validate the coupon's validFrom and validTo dates
  const currentDate = new Date();
  if (currentDate < coupon.validFrom || currentDate > coupon.validTo) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Coupon is not valid for the current date."
    );
  }

  return coupon;
};

export { createCouponIntoDB, getCouponFromDB };
