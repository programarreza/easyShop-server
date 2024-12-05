import { Prisma, Shop, UserRole, UserStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import { calculatePagination } from "../../helpers/calculatePagination";
import { TPaginationOptions } from "../../interfaces/TPasination";
import prisma from "../../shared/prisma";
import { shopSearchableFields } from "./shop.constant";

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

const getAllShopsFromDB = async (filters: any, options: TPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(
    options as any
  );

  const { searchTerm } = filters;
  const andConditions: Prisma.ShopWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: shopSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.ShopWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.shop.findMany({
    where: { ...whereConditions, isDeleted: false },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.shop.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleShopFromDB = async (id: string) => {
  await prisma.shop.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // find user
  const result = await prisma.shop.findUnique({
    where: { id, isDeleted: false },
  });

  return result;
};

const getMyShopFromDB = async (user: JwtPayload) => {
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      role: UserRole.VENDOR,
      status: UserStatus.ACTIVE,
    },
  });

  // find user
  const result = await prisma.shop.findUnique({
    where: { vendorId: vendorData.id, isDeleted: false },
  });

  return result;
};

export { createShopIntoDB, getAllShopsFromDB, getSingleShopFromDB, getMyShopFromDB };
