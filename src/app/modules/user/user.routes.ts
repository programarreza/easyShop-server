import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getMyProfile,
  getSingleUser,
  updateProfile,
  userStatusChange,
} from "./user.controller";
import {
  createUserValidationSchema,
  updateUserValidationSchema,
} from "./user.validation";

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

userRoutes.patch(
  "/me-update",
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER),
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(updateUserValidationSchema),
  updateProfile
);

userRoutes.patch("/change-status/:id", auth(UserRole.ADMIN), userStatusChange);
userRoutes.delete("/:id", auth(UserRole.ADMIN), deleteUser);

userRoutes.get("/:id", getSingleUser);

export default userRoutes;
