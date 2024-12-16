"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const order_controller_1 = require("./order.controller");
const orderRoutes = (0, express_1.Router)();
orderRoutes.post("/create-order", (0, auth_1.default)(client_1.UserRole.CUSTOMER), order_controller_1.createOrder);
orderRoutes.post("/confirmation", order_controller_1.paymentConfirmation);
orderRoutes.post("/failed", order_controller_1.failedOrder);
// get customer order history
orderRoutes.get("/customer-history", (0, auth_1.default)(client_1.UserRole.CUSTOMER), order_controller_1.getCustomerOrderHistory);
// get ve order history
orderRoutes.get("/my-customer-history", (0, auth_1.default)(client_1.UserRole.VENDOR), order_controller_1.getMyCustomersOrdersHistory);
orderRoutes.get("/shops-orders-history", (0, auth_1.default)(client_1.UserRole.ADMIN), order_controller_1.getAllShopsOrdersHistory);
exports.default = orderRoutes;
