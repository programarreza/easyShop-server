import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import {
  createOrder,
  failedOrder,
  paymentConfirmation,
} from "./order.controller";

const orderRoutes = Router();

orderRoutes.post("/create-order", auth(UserRole.CUSTOMER), createOrder);
orderRoutes.post("/confirmation", paymentConfirmation);
orderRoutes.post("/failed", failedOrder);

export default orderRoutes;