import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { createCoupon, getCoupon } from "./coupon.controller";

const couponRoutes = Router();

couponRoutes.post("/create-coupon", auth(UserRole.VENDOR), createCoupon);

couponRoutes.get("/:id", getCoupon);

export default couponRoutes;
