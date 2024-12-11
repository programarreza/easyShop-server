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
const shop_controller_1 = require("./shop.controller");
const shop_validation_1 = require("./shop.validation");
const shopsRoutes = (0, express_1.Router)();
shopsRoutes.post("/create-shop", (0, auth_1.default)(client_1.UserRole.VENDOR), multer_config_1.multerUpload.single("image"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(shop_validation_1.createShopValidationSchema), shop_controller_1.createShop);
shopsRoutes.get("/", shop_controller_1.getAllShops);
shopsRoutes.get("/my-shop", (0, auth_1.default)(client_1.UserRole.VENDOR), shop_controller_1.getMyShop);
shopsRoutes.patch("/my-shop", multer_config_1.multerUpload.single("image"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(shop_validation_1.updateShopValidationSchema), (0, auth_1.default)(client_1.UserRole.VENDOR), shop_controller_1.updateMyShop);
shopsRoutes.delete("/my-shop", (0, auth_1.default)(client_1.UserRole.VENDOR), shop_controller_1.deleteMyShop);
shopsRoutes.get("/:id", shop_controller_1.getSingleShop);
exports.default = shopsRoutes;
