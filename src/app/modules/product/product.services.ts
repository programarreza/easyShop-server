import {
  Prisma,
  Product,
  ShopStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";
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

  if (vendorData.shop?.status === ShopStatus.BLOCKED) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Access Denied: Your shop has been blocked. Please contact support for further assistance."
    );
  }

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

  const { searchTerm, categories, minPrice, maxPrice, ...filterData } = filters;
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

  if (categories) {
    andConditions.push({
      categories: {
        name: {
          contains: categories,
          mode: "insensitive",
        },
      },
    });
  }

  // Price range conditions (based only on the slider)
  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        ...(minPrice && { gte: parseInt(minPrice, 10) }),
        ...(maxPrice && { lte: parseInt(maxPrice, 10) }),
      },
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
    where: { ...whereConditions, isDeleted: false, isFlashSales: false },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: {
      categories: true,
      shop: {
        include: {
          coupon: true,
        },
      },
    },
  });

  const total = await prisma.product.count({
    where: { ...whereConditions, isDeleted: false, isFlashSales: false },
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

const getShopProductsFromDB = async (
  filters: any,
  options: TPaginationOptions,
  shopId: string
) => {
  await prisma.shop.findUniqueOrThrow({
    where: {
      id: shopId,
      isDeleted: false,
    },
  });

  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(
    options as any
  );

  const { searchTerm, categories, ...filterData } = filters;
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

  if (categories) {
    andConditions.push({
      categories: {
        name: {
          contains: categories,
          mode: "insensitive",
        },
      },
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
    where: { shopId, ...whereConditions, isDeleted: false },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: {
      categories: true,
      shop: {
        include: {
          coupon: true,
        },
      },
    },
  });

  const total = await prisma.product.count({
    where: { shopId, ...whereConditions },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };

  // // find product
  // const result = await prisma.product.findMany({
  //   where: { shopId, isDeleted: false },
  //   include: {
  //     categories: true,
  //     shop: {
  //       include: {
  //         coupon: true,
  //       },
  //     },
  //   },
  // });

  return result;
};
const getSingleProductFromDB = async (id: string) => {
  await prisma.product.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  // find product
  const result = await prisma.product.findUnique({
    where: { id, isDeleted: false },
    include: {
      review: {
        include: {
          customer: true,
        },
      },
      categories: true,
      shop: {
        include: {
          coupon: true,
        },
      },
    },
  });

  return result;
};

const getMyProductsFromDB = async (user: JwtPayload) => {
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      shop: true,
    },
  });

  // find my product
  const result = await prisma.product.findMany({
    where: {
      shopId: vendorData.shop?.id,
      isDeleted: false,
    },
    include: {
      categories: true,
    },
  });

  return result;
};

const updateProductFromDB = async (id: string, payload: Partial<Product>) => {
  await prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  // update product
  const result = await prisma.product.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteProductIntoDB = async (id: string) => {
  await prisma.product.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  // update product
  const result = await prisma.product.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

// create flash sales product
const createFlashSalesProductIntoDB = async (payload: Partial<Product>) => {
  const { startDate, endDate, discount } = payload;
  // find product
  const productData = await prisma.product.findUniqueOrThrow({
    where: {
      id: payload.id,
      isDeleted: false,
    },
  });

  // update ==> startDate, endDate, discount, isFlashSales=true
  const result = await prisma.product.update({
    where: { id: productData.id },
    data: { startDate, endDate, discount, isFlashSales: true },
  });

  return result;
};

const getMyFlashSalesProductsFromDB = async (user: JwtPayload) => {
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      shop: true,
    },
  });

  // find my flash sales products
  const result = await prisma.product.findMany({
    where: {
      shopId: vendorData.shop?.id,
      isDeleted: false,
      isFlashSales: true,
    },
    include: {
      categories: true,
    },
  });

  return result;
};

const getAllFlashSalesProductsFromDB = async () => {
  // find all flash sales products
  const result = await prisma.product.findMany({
    where: {
      isDeleted: false,
      isFlashSales: true,
    },
    include: {
      categories: true,
    },
  });

  return result;
};

const getRelevantProductsFromDB = async (payload: any) => {
  const result = await prisma.product.findMany({
    where: {
      categoryId: {
        in: payload.categories,
      },
      isDeleted: false,
    },
    include: {
      categories: true,
    },
  });

  return result;
};

const deleteMyFlashSalesProductsIntoDB = async (
  user: JwtPayload,
  productId: string
) => {
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      shop: true,
    },
  });

  // delete my flash sales products
  const result = await prisma.product.update({
    where: {
      shopId: vendorData.shop?.id,
      id: productId,
      isDeleted: false,
      isFlashSales: true,
    },
    data: { isFlashSales: false, discount: 0 },
  });

  return result;
};

// product compare
const productCompareIntoDB = async (payload: any) => {
  const { productIds } = payload;

  if (!productIds || productIds.length < 2 || productIds.length > 3) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You can compare between 2 and 3 products"
    );
  }

  // Check for duplicate product IDs in the input array
  const uniqueProductIds = new Set(productIds);
  if (uniqueProductIds.size !== productIds.length) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Duplicate products are not allowed for comparison."
    );
  }

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isDeleted: false,
    },
    include: {
      categories: true,
      shop: true,
    },
  });

  // Validate that all products are from the same category
  const categories = new Set(products.map((item) => item.categories.id));
  if (categories.size > 1) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "All products must be from the same category to compare."
    );
  }

  return products;
};

export {
  createFlashSalesProductIntoDB,
  createProductIntoDB,
  deleteMyFlashSalesProductsIntoDB,
  deleteProductIntoDB,
  getAllFlashSalesProductsFromDB,
  getAllProductsFromDB,
  getMyFlashSalesProductsFromDB,
  getMyProductsFromDB,
  getRelevantProductsFromDB,
  getShopProductsFromDB,
  getSingleProductFromDB,
  productCompareIntoDB,
  updateProductFromDB
};

