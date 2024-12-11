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
exports.userRoleChange = exports.userStatusChange = exports.updateProfile = exports.getSingleUser = exports.getMyProfile = exports.getAllUsers = exports.deleteUser = exports.createUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const user_constant_1 = require("./user.constant");
const user_services_1 = require("./user.services");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield (0, user_services_1.createUserIntoDB)(Object.assign(Object.assign({}, req.body), { profilePhoto: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User created successfully!",
        data: result,
    });
}));
exports.createUser = createUser;
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, user_constant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield (0, user_services_1.getAllUsersFromDB)(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Users retrieved successfully!",
        data: result,
    });
}));
exports.getAllUsers = getAllUsers;
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, user_services_1.getSingleUserFromDB)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User retrieved successfully!",
        data: result,
    });
}));
exports.getSingleUser = getSingleUser;
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield (0, user_services_1.getMyProfileFromDB)(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "My profile retrieved successfully!",
        data: result,
    });
}));
exports.getMyProfile = getMyProfile;
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    const result = yield (0, user_services_1.updateProfileFromDB)(user, Object.assign(Object.assign({}, req.body), { profilePhoto: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Profile updated successfully!",
        data: result,
    });
}));
exports.updateProfile = updateProfile;
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, user_services_1.deleteUserIntoDB)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User deleted successfully!",
        data: result,
    });
}));
exports.deleteUser = deleteUser;
const userStatusChange = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, user_services_1.userStatusChangeIntoDB)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User status changed successfully!",
        data: result,
    });
}));
exports.userStatusChange = userStatusChange;
const userRoleChange = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, user_services_1.userRoleChangeIntoDB)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User role changed successfully!",
        data: result,
    });
}));
exports.userRoleChange = userRoleChange;
