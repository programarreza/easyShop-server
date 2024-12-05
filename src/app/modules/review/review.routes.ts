import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { createReview } from "./review.controller";
import { createReviewValidationSchema } from "./review.validation";

const reviewRoutes = Router();

reviewRoutes.post(
  "/create-review",
  auth(UserRole.CUSTOMER),
  validateRequest(createReviewValidationSchema),
  createReview
);

export default reviewRoutes;
