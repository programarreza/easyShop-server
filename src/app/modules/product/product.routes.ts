import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createFlashSalesProduct,
  createProduct,
  deleteMyFlashSalesProduct,
  deleteProduct,
  getAllFlashSalesProducts,
  getAllProducts,
  getMyFlashSalesProducts,
  getMyProducts,
  getRelevantProducts,
  getShopProducts,
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
productRoutes.get("/my-products", auth(UserRole.VENDOR), getMyProducts);

// Flash sales products
productRoutes.post(
  "/flash-sales-create",
  auth(UserRole.VENDOR),
  createFlashSalesProduct
);

productRoutes.get(
  "/my-flash-sales-products",
  auth(UserRole.VENDOR),
  getMyFlashSalesProducts
);

productRoutes.get("/flash-sales-products", getAllFlashSalesProducts);
productRoutes.post("/relevant-products", getRelevantProducts);

productRoutes.delete(
  "/my-flash-sales-products/:id",
  auth(UserRole.VENDOR),
  deleteMyFlashSalesProduct
);

productRoutes.delete("/:id", deleteProduct);

productRoutes.get("/:id/shop-product", getShopProducts);

productRoutes.get("/:id", getSingleProduct);

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
