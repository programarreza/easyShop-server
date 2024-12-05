import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createShop,
  deleteMyShop,
  getAllShops,
  getMyShop,
  getSingleShop,
  updateMyShop,
} from "./shop.controller";
import {
  createShopValidationSchema,
  updateShopValidationSchema,
} from "./shop.validation";

const shopsRoutes = Router();

shopsRoutes.post(
  "/create-shop",
  auth(UserRole.VENDOR),
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createShopValidationSchema),
  createShop
);

shopsRoutes.get("/", getAllShops);
shopsRoutes.get("/my-shop", auth(UserRole.VENDOR), getMyShop);

shopsRoutes.patch(
  "/my-shop",
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(updateShopValidationSchema),
  auth(UserRole.VENDOR),
  updateMyShop
);

shopsRoutes.delete("/my-shop", auth(UserRole.VENDOR), deleteMyShop);

shopsRoutes.get("/:id", getSingleShop);

export default shopsRoutes;
