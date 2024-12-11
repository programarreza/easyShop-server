"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const followed_controller_1 = require("./followed.controller");
const followedRoutes = (0, express_1.Router)();
followedRoutes.post("/create-follow", (0, auth_1.default)(client_1.UserRole.CUSTOMER), followed_controller_1.createFollow);
followedRoutes.get("/me", (0, auth_1.default)(client_1.UserRole.VENDOR), followed_controller_1.getMyFollowed);
exports.default = followedRoutes;
