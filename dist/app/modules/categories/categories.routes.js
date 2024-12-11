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
const categories_controller_1 = require("./categories.controller");
const categories_validation_1 = require("./categories.validation");
const categoriesRoutes = (0, express_1.Router)();
categoriesRoutes.post("/create-category", (0, auth_1.default)(client_1.UserRole.ADMIN), multer_config_1.multerUpload.single("image"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(categories_validation_1.createCategoryValidationSchema), categories_controller_1.createCategory);
categoriesRoutes.get("/", categories_controller_1.getAllCategories);
categoriesRoutes.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), categories_controller_1.getSingleCategory);
categoriesRoutes.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), multer_config_1.multerUpload.single("image"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(categories_validation_1.updateCategoryValidationSchema), categories_controller_1.updateCategory);
categoriesRoutes.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), categories_controller_1.deleteCategory);
exports.default = categoriesRoutes;
