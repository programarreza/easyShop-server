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

const deleteCouponIntoDB = async (user: JwtPayload) => {
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

  // Fetch coupon data
  const result = await prisma.coupon.delete({
    where: {
      shopId: shopData.id,
    },
  });

  return result;
};

export { createCouponIntoDB, deleteCouponIntoDB };
