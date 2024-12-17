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
exports.replayMyProductReviewFromDB = exports.getMyReviewsFromDB = exports.getMyProductReviewsFromDB = exports.getAllReviewsFromDB = exports.createReviewIntoDB = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../error/AppError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createReviewIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // find the customer
    const customerData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            role: client_1.UserRole.CUSTOMER,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // Check if the review already exists for this product
    const isExist = yield prisma_1.default.review.findFirst({
        where: { customerId: customerData.id, productId: payload.productId },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "This product review can only be submitted once.");
    }
    // Check if the customer has purchased this product
    const orderExists = yield prisma_1.default.order.findFirst({
        where: {
            customerId: customerData.id,
            orderItems: {
                some: {
                    productId: payload.productId,
                },
            },
        },
    });
    if (!orderExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This product does not belong to your order history.");
    }
    // create the review
    const newReview = yield prisma_1.default.review.create({
        data: Object.assign(Object.assign({}, payload), { customerId: customerData.id }),
    });
    // calculate the average rating
    const averageRating = yield prisma_1.default.review.aggregate({
        where: {
            productId: payload.productId,
        },
        _avg: {
            rating: true,
        },
    });
    // Convert Decimal to number
    const avgRating = ((_a = averageRating._avg.rating) === null || _a === void 0 ? void 0 : _a.toNumber()) || 0;
    // update the products rating field
    yield prisma_1.default.product.update({
        where: {
            id: payload.productId,
        },
        data: {
            rating: Math.floor(avgRating),
        },
    });
    return newReview;
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
        include: {
            product: true,
        },
    });
    return result;
});
exports.getMyReviewsFromDB = getMyReviewsFromDB;
const getMyProductReviewsFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // find the vendor
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // find the shop associated width the vendor
    const shopData = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            vendorId: vendorData.id,
        },
        include: {
            product: true,
        },
    });
    // get the product IDs from the shop
    const productIds = shopData.product.map((product) => product.id);
    const result = yield prisma_1.default.review.findMany({
        where: {
            productId: { in: productIds },
        },
        include: {
            product: true,
        },
    });
    return result;
});
exports.getMyProductReviewsFromDB = getMyProductReviewsFromDB;
const replayMyProductReviewFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ payload });
    const isExist = yield prisma_1.default.review.findUnique({
        where: {
            id: payload.reviewId,
            reviewReplay: payload.reviewReplay,
        },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Already replayed ");
    }
    const result = yield prisma_1.default.review.update({
        where: {
            id: payload.reviewId,
        },
        data: {
            reviewReplay: payload.reviewReplay,
        },
    });
    return result;
});
exports.replayMyProductReviewFromDB = replayMyProductReviewFromDB;
