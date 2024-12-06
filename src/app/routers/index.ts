import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import categoriesRoutes from "../modules/categories/categories.routes";
import followedRoutes from "../modules/followed/followed.routes";
import productRoutes from "../modules/product/product.routes";
import reviewRoutes from "../modules/review/review.routes";
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
  {
    path: "/products",
    route: productRoutes,
  },
  {
    path: "/reviews",
    route: reviewRoutes,
  },
  {
    path: "/followed",
    route: followedRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
