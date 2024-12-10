import { UserStatus } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
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

  //   create coupon by shop
  const result = await prisma.coupon.create({
    data: { ...payload, shopId: shopData.id },
  });

  return result;
};

export { createCouponIntoDB };
