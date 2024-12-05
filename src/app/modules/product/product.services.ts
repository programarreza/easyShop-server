import { Prisma, Product, UserRole, UserStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import { calculatePagination } from "../../helpers/calculatePagination";
import { TPaginationOptions } from "../../interfaces/TPasination";
import prisma from "../../shared/prisma";
import { productSearchableFields } from "./product.constant";

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

const getAllProductsFromDB = async (
  filters: any,
  options: TPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(
    options as any
  );

  const { searchTerm, ...filterData } = filters;
  const andConditions: Prisma.ProductWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: productSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    where: { ...whereConditions, isDeleted: false },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.product.count({
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

const getSingleProductFromDB = async (id: string) => {
  await prisma.product.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // find product
  const result = await prisma.product.findUnique({
    where: { id, isDeleted: false },
  });

  return result;
};

export { createProductIntoDB, getAllProductsFromDB, getSingleProductFromDB };
