import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import prisma from "../../shared/prisma";

const createCategoryIntoDB = async (payload: any) => {
  const isExist = await prisma.categories.findUnique({
    where: { name: payload.name },
  });

  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "This category already exist!");
  }

  const result = await prisma.categories.create({
    data: payload,
  });

  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.categories.findMany();

  return result;
};

const getSingleCategoryFromDB = async (id: string) => {
  const result = await prisma.categories.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return result;
};

export {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
};
