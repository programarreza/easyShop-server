import { Categories } from "@prisma/client";
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
  const result = await prisma.categories.findMany({
    where: {
      isDeleted: false,
    },
  });

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

const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<Categories>
) => {
  const categoryData = await prisma.categories.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.categories.update({
    where: {
      id: categoryData.id,
    },
    data: payload,
  });

  return result;
};

const deleteCategoryIntoDB = async (id: string) => {
  const categoryData = await prisma.categories.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const categoryBelongToProductIn = await prisma.product.findMany({
    where: {
      categoryId: categoryData.id,
    },
  });

  if (categoryBelongToProductIn.length > 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This category already used");
  }

  const result = await prisma.categories.update({
    where: {
      id: categoryData.id,
    },
    data: { isDeleted: true },
  });

  return result;
};

export {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryIntoDB
};
