import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import {
  createOrder,
  failedOrder,
  getAllShopsOrdersHistory,
  getCustomerOrderHistory,
  getMyCustomersOrdersHistory,
  paymentConfirmation,
} from "./order.controller";

const orderRoutes = Router();

orderRoutes.post("/create-order", auth(UserRole.CUSTOMER), createOrder);
orderRoutes.post("/confirmation", paymentConfirmation);
orderRoutes.post("/failed", failedOrder);

// get customer order history
orderRoutes.get(
  "/customer-history",
  auth(UserRole.CUSTOMER),
  getCustomerOrderHistory
);

// get ve order history
orderRoutes.get(
  "/my-customer-history",
  auth(UserRole.VENDOR),
  getMyCustomersOrdersHistory
);

orderRoutes.get(
  "/shops-orders-history",
  auth(UserRole.ADMIN),
  getAllShopsOrdersHistory
);

export default orderRoutes;
