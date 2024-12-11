"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const reviewRoutes = (0, express_1.Router)();
reviewRoutes.post("/create-review", (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(review_validation_1.createReviewValidationSchema), review_controller_1.createReview);
reviewRoutes.get("/", review_controller_1.getAllReviews);
reviewRoutes.get("/me", (0, auth_1.default)(client_1.UserRole.CUSTOMER), review_controller_1.getMyReviews);
exports.default = reviewRoutes;
