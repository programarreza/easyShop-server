"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidationSchema = exports.forgotPasswordValidationSchema = exports.changePasswordValidationSchema = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: "email is required",
        }),
        password: zod_1.z.string({
            required_error: "password is required",
        }),
    }),
});
exports.loginValidationSchema = loginValidationSchema;
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: "oldPassword is required",
        }),
        newPassword: zod_1.z.string({
            required_error: "newPassword is required",
        }),
    }),
});
exports.changePasswordValidationSchema = changePasswordValidationSchema;
const forgotPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: "email is required",
        }),
    }),
});
exports.forgotPasswordValidationSchema = forgotPasswordValidationSchema;
