import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { createCategory } from "./categories.controller";
import { createCategoryValidationSchema } from "./categories.validation";

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

export default categoriesRoutes;
