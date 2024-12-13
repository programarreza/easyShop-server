"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const flashSales_controller_1 = require("./flashSales.controller");
const flashSalesRoutes = (0, express_1.Router)();
flashSalesRoutes.post("/create", (0, auth_1.default)(client_1.UserRole.VENDOR), flashSales_controller_1.createFlashSales);
flashSalesRoutes.get("/", flashSales_controller_1.getAllFlashSales);
flashSalesRoutes.get("/my-flash-sales-products", (0, auth_1.default)(), (0, auth_1.default)(client_1.UserRole.VENDOR), flashSales_controller_1.getMyFlashSalesProducts);
flashSalesRoutes.delete("/my-flash-sales-products/:id", (0, auth_1.default)(client_1.UserRole.VENDOR), flashSales_controller_1.deleteMyFlashSalesProduct);
exports.default = flashSalesRoutes;
