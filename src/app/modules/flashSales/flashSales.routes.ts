import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { createFlashSales } from "./flashSales.controller";

const flashSalesRoutes = Router();

flashSalesRoutes.post("/create", auth(UserRole.VENDOR), createFlashSales);

export default flashSalesRoutes;
