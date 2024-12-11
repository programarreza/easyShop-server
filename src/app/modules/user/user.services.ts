import { Prisma, User, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import { calculatePagination } from "../../helpers/calculatePagination";
import { TPaginationOptions } from "../../interfaces/TPasination";
import prisma from "../../shared/prisma";
import { userSearchableFields } from "./user.constant";

const createUserIntoDB = async (payload: any) => {
  const isExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "This user already exist!");
  }

  // hashed password
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const result = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });

  return result;
};

const getAllUsersFromDB = async (filters: any, options: TPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(
    options as any
  );

  const { searchTerm, ...filterData } = filters;
  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: { ...whereConditions, isDeleted: false },
    select: {
      name: true,
      email: true,
      address: true,
      id: true,
      phoneNumber: true,
      profilePhoto: true,
      role: true,
      status: true,
      createdAt: true,
      isDeleted: true,
      updatedAt: true,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.user.count({
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

const getSingleUserFromDB = async (id: string) => {
  // find user
  const result = await prisma.user.findUniqueOrThrow({
    where: { id, status: UserStatus.ACTIVE },
    select: {
      name: true,
      email: true,
      address: true,
      id: true,
      phoneNumber: true,
      profilePhoto: true,
      role: true,
      status: true,
      createdAt: true,
      isDeleted: true,
      updatedAt: true,
    },
  });

  return result;
};

const getMyProfileFromDB = async (user: JwtPayload) => {
  // find user
  const result = await prisma.user.findUniqueOrThrow({
    where: { email: user.email, status: UserStatus.ACTIVE },
    // include: {
    //   shop: true,
    // },
    select: {
      name: true,
      email: true,
      address: true,
      id: true,
      phoneNumber: true,
      profilePhoto: true,
      role: true,
      status: true,
      createdAt: true,
      isDeleted: true,
      updatedAt: true,
      shop: {
        include: {
          coupon: true,
        },
      },
    },
  });

  return result;
};

const updateProfileFromDB = async (user: JwtPayload, payload: User) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const userInfo = await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: payload,
  });

  return userInfo;
};

const deleteUserIntoDB = async (id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: { isDeleted: true, status: UserStatus.DELETED },
  });

  return result;
};

const userStatusChangeIntoDB = async (
  id: string,
  payload: { status: UserStatus }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: payload,
  });

  return result;
};

const userRoleChangeIntoDB = async (
  id: string,
  payload: { role: UserRole }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: payload,
  });

  return result;
};

export {
  createUserIntoDB,
  deleteUserIntoDB,
  getAllUsersFromDB,
  getMyProfileFromDB,
  getSingleUserFromDB,
  updateProfileFromDB,
  userRoleChangeIntoDB,
  userStatusChangeIntoDB,
};
