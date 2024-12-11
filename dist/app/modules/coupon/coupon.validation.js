"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCouponValidationSchema = void 0;
const zod_1 = require("zod");
exports.createCouponValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        code: zod_1.z
            .string()
            .min(3, "Coupon code must be at least 3 characters long.")
            .max(20, "Coupon code must be at most 20 characters long."),
        discount: zod_1.z
            .number()
            .int()
            .min(1, "Discount must be at least 1%.")
            .max(100, "Discount cannot exceed 100%."),
        validFrom: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "validFrom must be a valid date.",
        }),
        validTo: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "validTo must be a valid date.",
        }),
    })
        .refine((data) => new Date(data.validFrom) <= new Date(data.validTo), {
        message: "validTo must be later than validFrom.",
        path: ["validTo"], // Targets the validTo field in error messages
    }),
});
