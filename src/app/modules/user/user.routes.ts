import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createUser,
  getAllUsers,
  getMyProfile,
  getSingleUser,
} from "./user.controller";
import { createUserValidationSchema } from "./user.validation";

const userRoutes = Router();
userRoutes.post(
  "/create-user",
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createUserValidationSchema),
  createUser
);

userRoutes.get("/", auth(UserRole.ADMIN, UserRole.VENDOR), getAllUsers);
userRoutes.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER),
  getMyProfile
);

userRoutes.get("/:id", getSingleUser);

export default userRoutes;
