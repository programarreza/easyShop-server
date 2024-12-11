"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidationSchema = exports.createUserValidationSchema = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name is required",
        }),
        email: zod_1.z.string({
            required_error: "email is required",
        }),
        password: zod_1.z.string({
            required_error: "password is required",
        }),
        phoneNumber: zod_1.z.string({
            required_error: "phoneNumber is required",
        }),
        address: zod_1.z.string({
            required_error: "address is required",
        }),
    }),
});
exports.createUserValidationSchema = createUserValidationSchema;
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "name is required",
        })
            .optional(),
        email: zod_1.z
            .string({
            required_error: "email is required",
        })
            .optional(),
        password: zod_1.z
            .string({
            required_error: "password is required",
        })
            .optional(),
        phoneNumber: zod_1.z
            .string({
            required_error: "phoneNumber is required",
        })
            .optional(),
        address: zod_1.z
            .string({
            required_error: "address is required",
        })
            .optional(),
    }),
});
exports.updateUserValidationSchema = updateUserValidationSchema;
