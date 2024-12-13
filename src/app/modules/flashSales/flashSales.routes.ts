import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import {
  createFlashSales,
  deleteMyFlashSalesProduct,
  getAllFlashSales,
  getMyFlashSalesProducts,
} from "./flashSales.controller";

const flashSalesRoutes = Router();

flashSalesRoutes.post("/create", auth(UserRole.VENDOR), createFlashSales);
flashSalesRoutes.get("/", getAllFlashSales);

flashSalesRoutes.get(
  "/my-flash-sales-products",
  auth(),
  auth(UserRole.VENDOR),
  getMyFlashSalesProducts
);

flashSalesRoutes.delete(
  "/my-flash-sales-products/:id",
  auth(UserRole.VENDOR),
  deleteMyFlashSalesProduct
);

export default flashSalesRoutes;
