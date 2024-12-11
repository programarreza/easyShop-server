"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShopValidationSchema = exports.createShopValidationSchema = void 0;
const zod_1 = require("zod");
const createShopValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name  is required",
        }),
        description: zod_1.z.string({
            required_error: "description  is required",
        }),
    }),
});
exports.createShopValidationSchema = createShopValidationSchema;
const updateShopValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "name  is required",
        })
            .optional(),
        description: zod_1.z
            .string({
            required_error: "description  is required",
        })
            .optional(),
    }),
});
exports.updateShopValidationSchema = updateShopValidationSchema;
