"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const multer_config_1 = require("../../config/multer.config");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const userRoutes = (0, express_1.Router)();
userRoutes.post("/create-user", multer_config_1.multerUpload.single("image"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.createUserValidationSchema), user_controller_1.createUser);
userRoutes.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), user_controller_1.getAllUsers);
userRoutes.get("/me", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), user_controller_1.getMyProfile);
userRoutes.patch("/me-update", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), multer_config_1.multerUpload.single("image"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.updateUserValidationSchema), user_controller_1.updateProfile);
userRoutes.patch("/change-status/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.userStatusChange);
userRoutes.patch("/change-role/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.userRoleChange);
userRoutes.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.deleteUser);
userRoutes.get("/:id", user_controller_1.getSingleUser);
exports.default = userRoutes;
