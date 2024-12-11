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
exports.deleteCategoryIntoDB = exports.updateCategoryIntoDB = exports.getSingleCategoryFromDB = exports.getAllCategoriesFromDB = exports.createCategoryIntoDB = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../error/AppError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createCategoryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.categories.findUnique({
        where: { name: payload.name },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "This category already exist!");
    }
    const result = yield prisma_1.default.categories.create({
        data: payload,
    });
    return result;
});
exports.createCategoryIntoDB = createCategoryIntoDB;
const getAllCategoriesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.categories.findMany({
        where: {
            isDeleted: false,
        },
    });
    return result;
});
exports.getAllCategoriesFromDB = getAllCategoriesFromDB;
const getSingleCategoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.categories.findUniqueOrThrow({
        where: {
            id,
        },
    });
    return result;
});
exports.getSingleCategoryFromDB = getSingleCategoryFromDB;
const updateCategoryIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryData = yield prisma_1.default.categories.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.default.categories.update({
        where: {
            id: categoryData.id,
        },
        data: payload,
    });
    return result;
});
exports.updateCategoryIntoDB = updateCategoryIntoDB;
const deleteCategoryIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryData = yield prisma_1.default.categories.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const categoryBelongToProductIn = yield prisma_1.default.product.findMany({
        where: {
            categoryId: categoryData.id,
        },
    });
    if (categoryBelongToProductIn.length > 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This category already used");
    }
    const result = yield prisma_1.default.categories.update({
        where: {
            id: categoryData.id,
        },
        data: { isDeleted: true },
    });
    return result;
});
exports.deleteCategoryIntoDB = deleteCategoryIntoDB;
