import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { createUser, getAllUsers, getSingleUser } from "./user.controller";
import { createUserValidationSchema } from "./user.validation";

const userRoutes = Router();
userRoutes.post(
  "/create-user",
  validateRequest(createUserValidationSchema),
  createUser
);

userRoutes.get("/", auth(UserRole.ADMIN, UserRole.VENDOR), getAllUsers);
userRoutes.get("/:id", getSingleUser);

export default userRoutes;
