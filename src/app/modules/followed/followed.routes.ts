import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { createFollow, getMyFollowed } from "./followed.controller";

const followedRoutes = Router();

followedRoutes.post("/create-follow", auth(UserRole.CUSTOMER), createFollow);
followedRoutes.get("/me", auth(UserRole.VENDOR), getMyFollowed);

export default followedRoutes;
