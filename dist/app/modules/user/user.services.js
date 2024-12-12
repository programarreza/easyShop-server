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
exports.userStatusChangeIntoDB = exports.userRoleChangeIntoDB = exports.updateProfileFromDB = exports.getSingleUserFromDB = exports.getMyProfileFromDB = exports.getAllUsersFromDB = exports.deleteUserIntoDB = exports.createUserIntoDB = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../error/AppError"));
const calculatePagination_1 = require("../../helpers/calculatePagination");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const user_constant_1 = require("./user.constant");
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "This user already exist!");
    }
    // hashed password
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    const result = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, payload), { password: hashedPassword }),
    });
    return result;
});
exports.createUserIntoDB = createUserIntoDB;
const getAllUsersFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.calculatePagination)(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
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
    const result = yield prisma_1.default.user.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { isDeleted: false }),
        select: {
            name: true,
            email: true,
            address: true,
            id: true,
            phoneNumber: true,
            profilePhoto: true,
            role: true,
            status: true,
            createdAt: true,
            isDeleted: true,
            updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    });
    const total = yield prisma_1.default.user.count({
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
exports.getAllUsersFromDB = getAllUsersFromDB;
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // find user
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id, status: client_1.UserStatus.ACTIVE },
        select: {
            name: true,
            email: true,
            address: true,
            id: true,
            phoneNumber: true,
            profilePhoto: true,
            role: true,
            status: true,
            createdAt: true,
            isDeleted: true,
            updatedAt: true,
        },
    });
    return result;
});
exports.getSingleUserFromDB = getSingleUserFromDB;
const getMyProfileFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // find user
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: { email: user.email, status: client_1.UserStatus.ACTIVE },
        // include: {
        //   shop: true,
        // },
        select: {
            name: true,
            email: true,
            address: true,
            id: true,
            phoneNumber: true,
            profilePhoto: true,
            role: true,
            status: true,
            createdAt: true,
            isDeleted: true,
            updatedAt: true,
            shop: {
                include: {
                    coupon: true,
                },
            },
        },
    });
    return result;
});
exports.getMyProfileFromDB = getMyProfileFromDB;
const updateProfileFromDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const userInfo = yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: payload,
    });
    return userInfo;
});
exports.updateProfileFromDB = updateProfileFromDB;
const deleteUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.default.user.update({
        where: {
            id: userData.id,
        },
        data: { isDeleted: true, status: client_1.UserStatus.DELETED },
    });
    return result;
});
exports.deleteUserIntoDB = deleteUserIntoDB;
const userStatusChangeIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.user.update({
        where: {
            id: userData.id,
        },
        data: payload,
    });
    return result;
});
exports.userStatusChangeIntoDB = userStatusChangeIntoDB;
const userRoleChangeIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.user.update({
        where: {
            id: userData.id,
        },
        data: payload,
    });
    return result;
});
exports.userRoleChangeIntoDB = userRoleChangeIntoDB;
