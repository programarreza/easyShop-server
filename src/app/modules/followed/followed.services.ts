import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import prisma from "../../shared/prisma";

const createFollowIntoDB = async (
  user: JwtPayload,
  payload: { shopId: string }
) => {
  const customerData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const followExist = await prisma.followed.findUnique({
    where: {
      customerId_shopId: {
        customerId: customerData.id,
        shopId: payload.shopId,
      },
    },
  });

  if (followExist) {
    throw new AppError(StatusCodes.CONFLICT, "you are already followed");
  }

  const result = await prisma.followed.create({
    data: {
      ...payload,
      customerId: customerData.id,
    },
  });

  return result;
};

export { createFollowIntoDB };
