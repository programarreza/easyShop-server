import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import categoriesRoutes from "../modules/categories/categories.routes";
import shopsRoutes from "../modules/shop/shop.routes";
import userRoutes from "../modules/user/user.routes";
const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/categories",
    route: categoriesRoutes,
  },
  {
    path: "/shops",
    route: shopsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
