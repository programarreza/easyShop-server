"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewValidationSchema = void 0;
const zod_1 = require("zod");
const createReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string({
            required_error: "productId  is required",
        }),
        rating: zod_1.z.number({
            required_error: "rating  is required",
        }),
        reviewText: zod_1.z.string({
            required_error: "reviewText  is required",
        }),
    }),
});
exports.createReviewValidationSchema = createReviewValidationSchema;
