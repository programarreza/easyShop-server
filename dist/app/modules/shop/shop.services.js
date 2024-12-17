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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyShopIntoDB = exports.shopStatusChangeIntoDB = exports.getSingleShopFromDB = exports.getMyShopFromDB = exports.getAllShopsFromDB = exports.deleteMyShopIntoDB = exports.createShopIntoDB = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../error/AppError"));
const calculatePagination_1 = require("../../helpers/calculatePagination");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const shop_constant_1 = require("./shop.constant");
const createShopIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // find vendor
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            role: client_1.UserRole.VENDOR,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isExist = yield prisma_1.default.shop.findFirst({
        where: { name: payload.name },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "This shop already exist!");
    }
    const result = yield prisma_1.default.shop.create({
        data: Object.assign(Object.assign({}, payload), { vendorId: vendorData.id }),
    });
    return result;
});
exports.createShopIntoDB = createShopIntoDB;
const getAllShopsFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.calculatePagination)(options);
    const { searchTerm } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: shop_constant_1.shopSearchableFields.map((field) => ({
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.shop.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { isDeleted: false }),
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
            vendor: {
                select: {
                    name: true,
                    email: true,
                    phoneNumber: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.shop.count({
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
exports.getAllShopsFromDB = getAllShopsFromDB;
const getSingleShopFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id,
        },
    });
    // find user
    const result = yield prisma_1.default.shop.findUnique({
        where: { id, isDeleted: false },
        include: {
            vendor: true,
            coupon: true,
        },
    });
    return result;
});
exports.getSingleShopFromDB = getSingleShopFromDB;
const getMyShopFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            role: client_1.UserRole.VENDOR,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // find user
    const result = yield prisma_1.default.shop.findUnique({
        where: { vendorId: vendorData.id, isDeleted: false },
    });
    return result;
});
exports.getMyShopFromDB = getMyShopFromDB;
const updateMyShopIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            role: client_1.UserRole.VENDOR,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // find user
    const shopData = yield prisma_1.default.shop.findUniqueOrThrow({
        where: { vendorId: vendorData.id, isDeleted: false },
    });
    const result = yield prisma_1.default.shop.update({
        where: {
            id: shopData.id,
        },
        data: payload,
    });
    return result;
});
exports.updateMyShopIntoDB = updateMyShopIntoDB;
const deleteMyShopIntoDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            role: client_1.UserRole.VENDOR,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // find user
    const shopData = yield prisma_1.default.shop.findUniqueOrThrow({
        where: { vendorId: vendorData.id, isDeleted: false },
    });
    const result = yield prisma_1.default.shop.update({
        where: {
            id: shopData.id,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
exports.deleteMyShopIntoDB = deleteMyShopIntoDB;
const shopStatusChangeIntoDB = (shopId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const shopData = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: shopId,
            isDeleted: false,
        },
    });
    if (shopData.status === payload.status) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `This shop status already ${payload.status}`);
    }
    const result = yield prisma_1.default.shop.update({
        where: {
            id: shopData.id,
        },
        data: payload,
    });
    return result;
});
exports.shopStatusChangeIntoDB = shopStatusChangeIntoDB;
