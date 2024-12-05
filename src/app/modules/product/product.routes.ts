import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "./product.controller";
import {
  createProductValidationSchema,
  updateProductValidationSchema,
} from "./product.validation";

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

productRoutes.delete("/:id", deleteProduct);

productRoutes.get(
  "/:id",
  getSingleProduct
);

productRoutes.patch(
  "/:id",
  auth(UserRole.VENDOR, UserRole.ADMIN),
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(updateProductValidationSchema),
  updateProduct
);

export default productRoutes;
