import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { createFlashSales, getAllFlashSales } from "./flashSales.controller";

const flashSalesRoutes = Router();

flashSalesRoutes.post("/create", auth(UserRole.VENDOR), createFlashSales);
flashSalesRoutes.get("/", getAllFlashSales);
flashSalesRoutes.get("/my-flash-sales-products", getAllFlashSales);

export default flashSalesRoutes;
