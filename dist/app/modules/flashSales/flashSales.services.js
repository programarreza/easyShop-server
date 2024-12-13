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
exports.getMyFlashSalesProductsFromDB = exports.getAllFlashSalesFromDB = exports.deleteMyFlashSalesProductIntoDB = exports.createFlashSalesIntoDB = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../error/AppError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createFlashSalesIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, startDate, endDate, discount } = payload;
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isExist = yield prisma_1.default.flashSales.findMany({
        where: {
            productId,
            isDeleted: false,
        },
    });
    if ((isExist === null || isExist === void 0 ? void 0 : isExist.length) > 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "This product already exist on flash sale");
    }
    // Ensure required fields are present
    if (!productId || !startDate || !endDate || !discount) {
        throw new Error("All fields (productId, startDate, endDate, discount) are required.");
    }
    // Parse and validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    if (end <= start) {
        throw new Error("endDate must be after startDate.");
    }
    // Find product data
    const productData = yield prisma_1.default.product.findUniqueOrThrow({
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
    const flashSale = yield prisma_1.default.flashSales.create({
        data: {
            vendorId: vendorData === null || vendorData === void 0 ? void 0 : vendorData.id,
            productId,
            discount,
            startDate,
            endDate,
        },
    });
    return flashSale;
});
exports.createFlashSalesIntoDB = createFlashSalesIntoDB;
const getAllFlashSalesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    // Fetch flash sales that are currently active
    const flashSales = yield prisma_1.default.flashSales.findMany({
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
});
exports.getAllFlashSalesFromDB = getAllFlashSalesFromDB;
const getMyFlashSalesProductsFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const result = yield prisma_1.default.flashSales.findMany({
        where: {
            vendorId: vendorData.id,
            isDeleted: false,
        },
        include: {
            product: true,
        },
    });
    return result;
});
exports.getMyFlashSalesProductsFromDB = getMyFlashSalesProductsFromDB;
const deleteMyFlashSalesProductIntoDB = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const result = yield prisma_1.default.flashSales.update({
        where: {
            vendorId: vendorData.id,
            id,
            isDeleted: false,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
exports.deleteMyFlashSalesProductIntoDB = deleteMyFlashSalesProductIntoDB;
