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
exports.updateProductFromDB = exports.productCompareIntoDB = exports.getSingleProductFromDB = exports.getShopProductsFromDB = exports.getRelevantProductsFromDB = exports.getMyProductsFromDB = exports.getMyFlashSalesProductsFromDB = exports.getAllProductsFromDB = exports.getAllFlashSalesProductsFromDB = exports.deleteProductIntoDB = exports.deleteMyFlashSalesProductsIntoDB = exports.createProductIntoDB = exports.createFlashSalesProductIntoDB = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../error/AppError"));
const calculatePagination_1 = require("../../helpers/calculatePagination");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const product_constant_1 = require("./product.constant");
const createProductIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
    if (((_a = vendorData.shop) === null || _a === void 0 ? void 0 : _a.status) === client_1.ShopStatus.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Access Denied: Your shop has been blocked. Please contact support for further assistance.");
    }
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
        where: Object.assign(Object.assign({}, whereConditions), { isDeleted: false, isFlashSales: false }),
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
        where: Object.assign(Object.assign({}, whereConditions), { isDeleted: false, isFlashSales: false }),
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
// create flash sales product
const createFlashSalesProductIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, discount } = payload;
    // find product
    const productData = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: payload.id,
            isDeleted: false,
        },
    });
    // update ==> startDate, endDate, discount, isFlashSales=true
    const result = yield prisma_1.default.product.update({
        where: { id: productData.id },
        data: { startDate, endDate, discount, isFlashSales: true },
    });
    return result;
});
exports.createFlashSalesProductIntoDB = createFlashSalesProductIntoDB;
const getMyFlashSalesProductsFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
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
    // find my flash sales products
    const result = yield prisma_1.default.product.findMany({
        where: {
            shopId: (_a = vendorData.shop) === null || _a === void 0 ? void 0 : _a.id,
            isDeleted: false,
            isFlashSales: true,
        },
        include: {
            categories: true,
        },
    });
    return result;
});
exports.getMyFlashSalesProductsFromDB = getMyFlashSalesProductsFromDB;
const getAllFlashSalesProductsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // find all flash sales products
    const result = yield prisma_1.default.product.findMany({
        where: {
            isDeleted: false,
            isFlashSales: true,
        },
        include: {
            categories: true,
        },
    });
    return result;
});
exports.getAllFlashSalesProductsFromDB = getAllFlashSalesProductsFromDB;
const getRelevantProductsFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findMany({
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
});
exports.getRelevantProductsFromDB = getRelevantProductsFromDB;
const deleteMyFlashSalesProductsIntoDB = (user, productId) => __awaiter(void 0, void 0, void 0, function* () {
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
    // delete my flash sales products
    const result = yield prisma_1.default.product.update({
        where: {
            shopId: (_a = vendorData.shop) === null || _a === void 0 ? void 0 : _a.id,
            id: productId,
            isDeleted: false,
            isFlashSales: true,
        },
        data: { isFlashSales: false, discount: 0 },
    });
    return result;
});
exports.deleteMyFlashSalesProductsIntoDB = deleteMyFlashSalesProductsIntoDB;
// product compare
const productCompareIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { productIds } = payload;
    if (!productIds || productIds.length < 2 || productIds.length > 3) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can compare between 2 and 3 products");
    }
    // Check for duplicate product IDs in the input array
    const uniqueProductIds = new Set(productIds);
    if (uniqueProductIds.size !== productIds.length) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Duplicate products are not allowed for comparison.");
    }
    const products = yield prisma_1.default.product.findMany({
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
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "All products must be from the same category to compare.");
    }
    return products;
});
exports.productCompareIntoDB = productCompareIntoDB;
