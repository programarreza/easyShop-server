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
exports.resetPasswordIntoDB = exports.refreshTokenIntoDB = exports.loginUserFromDB = exports.forgotPasswordIntoDB = exports.changePasswordIntoDB = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const emailSender_1 = __importDefault(require("./emailSender"));
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const accessToken = (0, jwtHelpers_1.generateToken)({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, jwtHelpers_1.generateToken)({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.loginUserFromDB = loginUserFromDB;
const refreshTokenIntoDB = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = (0, jwtHelpers_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const accessToken = (0, jwtHelpers_1.generateToken)({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
exports.refreshTokenIntoDB = refreshTokenIntoDB;
const changePasswordIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // check password
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Password incorrect!");
    }
    // hashed password
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 10);
    // update password
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return {
        message: "Password changed successfully!",
    };
});
exports.changePasswordIntoDB = changePasswordIntoDB;
const forgotPasswordIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const userInfo = {
        email: userData.email,
        role: userData.role,
    };
    const resetPassToken = (0, jwtHelpers_1.generateToken)(userInfo, config_1.default.jwt_reset_pass_secret, config_1.default.jwt_reset_pass_token_expires_in);
    // http://localhost:3000/reset-pass?email=reza@gmail.com&token=ncnlcnzxncznccnxzc
    const resetPassLink = config_1.default.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
    yield (0, emailSender_1.default)(userData.email, `
    <div>
    <p>Dear User </p>
    <p>You requested a password reset for your EasyShop account. Please click the link below to reset your password:</p>
    <a href=${resetPassLink}>
      <button>
        Reset Password Link
      </button>
    </a>

    <p>Note: This link is valid for only 10 minutes. If you did not request this change, please ignore this message.</p>

    <p>Stay safe,</p>
    <p>The EasyShop Team</p>
    
    </div>
    `);
});
exports.forgotPasswordIntoDB = forgotPasswordIntoDB;
const resetPasswordIntoDB = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isValidToken = (0, jwtHelpers_1.verifyToken)(token, config_1.default.jwt_reset_pass_secret);
    if (!isValidToken) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Forbidden!");
    }
    // hash password
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    // update password
    yield prisma_1.default.user.update({
        where: {
            id: userData.id,
        },
        data: {
            password: hashedPassword,
        },
    });
    return {
        message: "Password reset successfully!",
    };
});
exports.resetPasswordIntoDB = resetPasswordIntoDB;
