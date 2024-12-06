import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { createFollow } from "./followed.controller";

const followedRoutes = Router();

followedRoutes.post("/create-follow", auth(UserRole.CUSTOMER), createFollow);

export default followedRoutes;
