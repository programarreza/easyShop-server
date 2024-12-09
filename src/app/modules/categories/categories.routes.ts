import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "./categories.controller";
import {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
} from "./categories.validation";

const categoriesRoutes = Router();

categoriesRoutes.post(
  "/create-category",
  auth(UserRole.ADMIN),
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createCategoryValidationSchema),
  createCategory
);

categoriesRoutes.get(
  "/",
  getAllCategories
);

categoriesRoutes.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  getSingleCategory
);

categoriesRoutes.patch(
  "/:id",
  auth(UserRole.ADMIN),
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(updateCategoryValidationSchema),
  updateCategory
);

categoriesRoutes.delete("/:id", auth(UserRole.ADMIN), deleteCategory);

export default categoriesRoutes;
