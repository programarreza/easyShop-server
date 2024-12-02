import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createUser } from "./user.controller";
import { createUserValidationSchema } from "./user.validation";

const userRoutes = Router();
userRoutes.post(
  "/create-user",
  validateRequest(createUserValidationSchema),
  createUser
);

export default userRoutes;
