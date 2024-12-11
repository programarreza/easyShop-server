"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductFromDB = exports.getSingleProductFromDB = exports.getShopProductsFromDB = exports.getMyProductsFromDB = exports.getAllProductsFromDB = exports.deleteProductIntoDB = exports.createProductIntoDB = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../error/AppError"));
const calculatePagination_1 = require("../../helpers/calculatePagination");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const product_constant_1 = require("./product.constant");
const createProductIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // find vendor
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            role: client_1.UserRole.VENDOR,
            status: client_1.UserStatus.ACTIVE,
        },
        include: {
            shop: true,
        },
    });
    const isExist = yield prisma_1.default.product.findFirst({
        where: { name: payload.name },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "This product already exist!");
    }
    const categoryExists = yield prisma_1.default.categories.findUnique({
        where: { id: payload.categoryId },
    });
    if (!categoryExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid category ID!");
    }
    const result = yield prisma_1.default.product.create({
        data: Object.assign(Object.assign({}, payload), { shopId: vendorData.shop.id }),
    });
    return result;
});
exports.createProductIntoDB = createProductIntoDB;
const getAllProductsFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.calculatePagination)(options);
    const { searchTerm, categories } = filters, filterData = __rest(filters, ["searchTerm", "categories"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: product_constant_1.productSearchableFields.map((field) => ({
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
                equals: filterData[key],
            },
        }));
        andConditions.push(...filterConditions);
    }
    andConditions.push({
        isDeleted: false,
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.product.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { isDeleted: false }),
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
            categories: true,
            shop: {
                include: {
                    coupon: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.product.count({
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
});
exports.getAllProductsFromDB = getAllProductsFromDB;
const getShopProductsFromDB = (filters, options, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: shopId,
            isDeleted: false,
        },
    });
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.calculatePagination)(options);
    const { searchTerm, categories } = filters, filterData = __rest(filters, ["searchTerm", "categories"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: product_constant_1.productSearchableFields.map((field) => ({
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
                equals: filterData[key],
            },
        }));
        andConditions.push(...filterConditions);
    }
    andConditions.push({
        isDeleted: false,
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.product.findMany({
        where: Object.assign(Object.assign({ shopId }, whereConditions), { isDeleted: false }),
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
            categories: true,
            shop: {
                include: {
                    coupon: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.product.count({
        where: Object.assign({ shopId }, whereConditions),
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
});
exports.getShopProductsFromDB = getShopProductsFromDB;
const getSingleProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    // find product
    const result = yield prisma_1.default.product.findUnique({
        where: { id, isDeleted: false },
        include: {
            categories: true,
            shop: {
                include: {
                    coupon: true,
                },
            },
        },
    });
    return result;
});
exports.getSingleProductFromDB = getSingleProductFromDB;
const getMyProductsFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        include: {
            shop: true,
        },
    });
    // find my product
    const result = yield prisma_1.default.product.findMany({
        where: {
            shopId: (_a = vendorData.shop) === null || _a === void 0 ? void 0 : _a.id,
            isDeleted: false,
        },
        include: {
            categories: true,
        },
    });
    return result;
});
exports.getMyProductsFromDB = getMyProductsFromDB;
const updateProductFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.product.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    // update product
    const result = yield prisma_1.default.product.update({
        where: { id },
        data: payload,
    });
    return result;
});
exports.updateProductFromDB = updateProductFromDB;
const deleteProductIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    // update product
    const result = yield prisma_1.default.product.update({
        where: { id },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
exports.deleteProductIntoDB = deleteProductIntoDB;
