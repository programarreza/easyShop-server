"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const authRoutes = (0, express_1.Router)();
authRoutes.post("/login", (0, validateRequest_1.default)(auth_validation_1.loginValidationSchema), auth_controller_1.loginUser);
authRoutes.post("/refresh-token", auth_controller_1.refreshToken);
authRoutes.post("/change-password", (0, validateRequest_1.default)(auth_validation_1.changePasswordValidationSchema), (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), auth_controller_1.changePassword);
authRoutes.post("/forgot-password", (0, validateRequest_1.default)(auth_validation_1.forgotPasswordValidationSchema), auth_controller_1.forgotPassword);
authRoutes.post("/reset-password", auth_controller_1.resetPassword);
exports.default = authRoutes;
