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
exports.deleteCouponIntoDB = exports.createCouponIntoDB = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../error/AppError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createCouponIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // find vendor data
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        include: {
            shop: true,
        },
    });
    //   find shop data
    const shopData = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: (_a = vendorData.shop) === null || _a === void 0 ? void 0 : _a.id,
            isDeleted: false,
        },
    });
    // Check if a coupon already exists for this shop
    const existingCoupon = yield prisma_1.default.coupon.findFirst({
        where: {
            shopId: shopData.id,
            isDeleted: false,
        },
    });
    if (existingCoupon) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "This shop coupon already exists.");
    }
    //   create coupon by shop
    const result = yield prisma_1.default.coupon.create({
        data: Object.assign(Object.assign({}, payload), { shopId: shopData.id }),
    });
    return result;
});
exports.createCouponIntoDB = createCouponIntoDB;
const deleteCouponIntoDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // find vendor data
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        include: {
            shop: true,
        },
    });
    //   find shop data
    const shopData = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: (_a = vendorData.shop) === null || _a === void 0 ? void 0 : _a.id,
            isDeleted: false,
        },
    });
    // Fetch coupon data
    const result = yield prisma_1.default.coupon.delete({
        where: {
            shopId: shopData.id,
        },
    });
    return result;
});
exports.deleteCouponIntoDB = deleteCouponIntoDB;
