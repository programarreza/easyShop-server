import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  changePassword,
  forgotPassword,
  loginUser,
  refreshToken,
  resetPassword,
} from "./auth.controller";
import {
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  loginValidationSchema,
} from "./auth.validation";

const authRoutes = Router();
authRoutes.post("/login", validateRequest(loginValidationSchema), loginUser);
authRoutes.post("/refresh-token", refreshToken);

authRoutes.post(
  "/change-password",
  validateRequest(changePasswordValidationSchema),
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER),
  changePassword
);

authRoutes.post(
  "/forgot-password",
  validateRequest(forgotPasswordValidationSchema),
  forgotPassword
);

authRoutes.post("/reset-password", resetPassword);

export default authRoutes;
