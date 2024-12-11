"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const coupon_controller_1 = require("./coupon.controller");
const couponRoutes = (0, express_1.Router)();
couponRoutes.post("/create-coupon", (0, auth_1.default)(client_1.UserRole.VENDOR), coupon_controller_1.createCoupon);
couponRoutes.get("/:id", coupon_controller_1.getCoupon);
exports.default = couponRoutes;
