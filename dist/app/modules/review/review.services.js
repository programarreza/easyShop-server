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
exports.getMyReviewsFromDB = exports.getAllReviewsFromDB = exports.createReviewIntoDB = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../error/AppError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createReviewIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // find user
    const customerData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            role: client_1.UserRole.CUSTOMER,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isExist = yield prisma_1.default.review.findFirst({
        where: { reviewText: payload.reviewText },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "This review already exist!");
    }
    const productExists = yield prisma_1.default.product.findUnique({
        where: { id: payload.productId },
    });
    if (!productExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid product ID!");
    }
    const result = yield prisma_1.default.review.create({
        data: Object.assign(Object.assign({}, payload), { customerId: customerData.id }),
    });
    return result;
});
exports.createReviewIntoDB = createReviewIntoDB;
const getAllReviewsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.findMany();
    return result;
});
exports.getAllReviewsFromDB = getAllReviewsFromDB;
const getMyReviewsFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const customerData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const result = yield prisma_1.default.review.findMany({
        where: {
            customerId: customerData.id,
        },
    });
    return result;
});
exports.getMyReviewsFromDB = getMyReviewsFromDB;
