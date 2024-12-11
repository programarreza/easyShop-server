"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const categories_routes_1 = __importDefault(require("../modules/categories/categories.routes"));
const coupon_routes_1 = __importDefault(require("../modules/coupon/coupon.routes"));
const followed_routes_1 = __importDefault(require("../modules/followed/followed.routes"));
const product_routes_1 = __importDefault(require("../modules/product/product.routes"));
const review_routes_1 = __importDefault(require("../modules/review/review.routes"));
const shop_routes_1 = __importDefault(require("../modules/shop/shop.routes"));
const user_routes_1 = __importDefault(require("../modules/user/user.routes"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/users",
        route: user_routes_1.default,
    },
    {
        path: "/auth",
        route: auth_routes_1.default,
    },
    {
        path: "/categories",
        route: categories_routes_1.default,
    },
    {
        path: "/shops",
        route: shop_routes_1.default,
    },
    {
        path: "/products",
        route: product_routes_1.default,
    },
    {
        path: "/reviews",
        route: review_routes_1.default,
    },
    {
        path: "/followed",
        route: followed_routes_1.default,
    },
    {
        path: "/coupons",
        route: coupon_routes_1.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
