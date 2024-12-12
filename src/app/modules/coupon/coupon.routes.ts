import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { createCoupon, deleteCoupon } from "./coupon.controller";

const couponRoutes = Router();

couponRoutes.post("/create-coupon", auth(UserRole.VENDOR), createCoupon);

couponRoutes.delete("/", auth(UserRole.VENDOR), deleteCoupon);

export default couponRoutes;
