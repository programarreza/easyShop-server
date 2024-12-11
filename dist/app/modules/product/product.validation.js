"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductValidationSchema = exports.createProductValidationSchema = void 0;
const zod_1 = require("zod");
const createProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name  is required",
        }),
        price: zod_1.z.number({
            required_error: "price  is required",
        }),
        categoryId: zod_1.z.string({
            required_error: "categoryId  is required",
        }),
        inventoryCount: zod_1.z.number({
            required_error: "inventoryCount  is required",
        }),
        discount: zod_1.z.number().optional(),
        description: zod_1.z.string({
            required_error: "description  is required",
        }),
    }),
});
exports.createProductValidationSchema = createProductValidationSchema;
const updateProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "name  is required",
        })
            .optional(),
        price: zod_1.z
            .number({
            required_error: "price  is required",
        })
            .optional(),
        categoryId: zod_1.z
            .string({
            required_error: "categoryId  is required",
        })
            .optional(),
        inventoryCount: zod_1.z
            .number({
            required_error: "inventoryCount  is required",
        })
            .optional(),
        discount: zod_1.z.number().optional(),
        description: zod_1.z
            .string({
            required_error: "description  is required",
        })
            .optional(),
    }),
});
exports.updateProductValidationSchema = updateProductValidationSchema;
