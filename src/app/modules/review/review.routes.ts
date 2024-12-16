import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createReview,
  getAllReviews,
  getMyProductReviews,
  getMyReviews,
} from "./review.controller";
import { createReviewValidationSchema } from "./review.validation";

const reviewRoutes = Router();

reviewRoutes.post(
  "/create-review",
  auth(UserRole.CUSTOMER),
  validateRequest(createReviewValidationSchema),
  createReview
);

reviewRoutes.get("/", getAllReviews);
reviewRoutes.get("/me", auth(UserRole.CUSTOMER), getMyReviews);
reviewRoutes.get(
  "/my-product-reviews",
  auth(UserRole.VENDOR),
  getMyProductReviews
);

export default reviewRoutes;
