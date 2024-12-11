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
exports.getMyFollowedFromDB = exports.createFollowIntoDB = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../error/AppError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createFollowIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const customerData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const followExist = yield prisma_1.default.followed.findUnique({
        where: {
            customerId_shopId: {
                customerId: customerData.id,
                shopId: payload.shopId,
            },
        },
    });
    if (followExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "you are already followed");
    }
    const result = yield prisma_1.default.followed.create({
        data: Object.assign(Object.assign({}, payload), { customerId: customerData.id }),
    });
    return result;
});
exports.createFollowIntoDB = createFollowIntoDB;
const getMyFollowedFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
    const result = yield prisma_1.default.followed.findMany({
        where: {
            shopId: (_a = vendorData.shop) === null || _a === void 0 ? void 0 : _a.id,
        },
        include: {
            shop: true,
        },
    });
    return result;
});
exports.getMyFollowedFromDB = getMyFollowedFromDB;
