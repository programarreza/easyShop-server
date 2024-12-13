import { UserStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import prisma from "../../shared/prisma";

const createFlashSalesIntoDB = async (user: JwtPayload, payload: any) => {
  const { productId, startDate, endDate, discount } = payload;

  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isExist = await prisma.flashSales.findMany({
    where: {
      productId,
      isDeleted: false,
    },
  });

  if (isExist?.length > 0) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "This product already exist on flash sale"
    );
  }

  // Ensure required fields are present
  if (!productId || !startDate || !endDate || !discount) {
    throw new Error(
      "All fields (productId, startDate, endDate, discount) are required."
    );
  }

  // Parse and validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (end <= start) {
    throw new Error("endDate must be after startDate.");
  }

  // Find product data
  const productData = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
    },
    select: {
      id: true,
      isDeleted: true,
    },
  });

  // Ensure the product is not deleted
  if (productData.isDeleted) {
    throw new Error("Cannot create a flash sale for a deleted product.");
  }

  // Create the flash sale
  const flashSale = await prisma.flashSales.create({
    data: {
      vendorId: vendorData?.id,
      productId,
      discount,
      startDate,
      endDate,
    },
  });

  return flashSale;
};

const getAllFlashSalesFromDB = async () => {
  const currentDate = new Date();

  // Fetch flash sales that are currently active
  const flashSales = await prisma.flashSales.findMany({
    where: {
      startDate: {
        lte: currentDate, // Flash sale has started
      },
      endDate: {
        gte: currentDate, // Flash sale has not ended
      },
      isDeleted: false, // Optional: Exclude soft-deleted entries
    },
    include: {
      product: true, // Include associated product details
    },
  });

  if (!flashSales.length) {
    throw new Error("No active flash sales found.");
  }

  return flashSales;
};

const getMyFlashSalesProductsFromDB = async (user: JwtPayload) => {
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const result = await prisma.flashSales.findMany({
    where: {
      vendorId: vendorData.id,
      isDeleted: false,
    },
  });

  return result;
};

export {
  createFlashSalesIntoDB,
  getAllFlashSalesFromDB,
  getMyFlashSalesProductsFromDB,
};
