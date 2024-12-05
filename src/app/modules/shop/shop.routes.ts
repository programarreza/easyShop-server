import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createShop,
  getAllShops,
  getMyShop,
  getSingleShop,
} from "./shop.controller";
import { createShopValidationSchema } from "./shop.validation";

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

shopsRoutes.get("/:id", getSingleShop);

export default shopsRoutes;
