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
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const productRoutes = (0, express_1.Router)();
productRoutes.post("/create-product", (0, auth_1.default)(client_1.UserRole.VENDOR), multer_config_1.multerUpload.single("image"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(product_validation_1.createProductValidationSchema), product_controller_1.createProduct);
productRoutes.get("/", product_controller_1.getAllProducts);
productRoutes.get("/my-products", (0, auth_1.default)(client_1.UserRole.VENDOR), product_controller_1.getMyProducts);
// Flash sales products
productRoutes.post("/flash-sales-create", (0, auth_1.default)(client_1.UserRole.VENDOR), product_controller_1.createFlashSalesProduct);
productRoutes.get("/my-flash-sales-products", (0, auth_1.default)(client_1.UserRole.VENDOR), product_controller_1.getMyFlashSalesProducts);
productRoutes.get("/flash-sales-products", product_controller_1.getAllFlashSalesProducts);
productRoutes.post("/relevant-products", product_controller_1.getRelevantProducts);
productRoutes.delete("/my-flash-sales-products/:id", (0, auth_1.default)(client_1.UserRole.VENDOR), product_controller_1.deleteMyFlashSalesProduct);
productRoutes.post("/compare", product_controller_1.productCompare);
productRoutes.delete("/:id", product_controller_1.deleteProduct);
productRoutes.get("/:id/shop-product", product_controller_1.getShopProducts);
productRoutes.get("/:id", product_controller_1.getSingleProduct);
productRoutes.patch("/:id", (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.ADMIN), multer_config_1.multerUpload.single("image"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(product_validation_1.updateProductValidationSchema), product_controller_1.updateProduct);
exports.default = productRoutes;
