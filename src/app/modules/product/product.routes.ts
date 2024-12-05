import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
} from "./product.controller";
import { createProductValidationSchema } from "./product.validation";

const productRoutes = Router();

productRoutes.post(
  "/create-product",
  auth(UserRole.VENDOR),
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createProductValidationSchema),
  createProduct
);

productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", getSingleProduct);

export default productRoutes;
