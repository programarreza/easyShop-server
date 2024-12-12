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
exports.default = orderRoutes;
