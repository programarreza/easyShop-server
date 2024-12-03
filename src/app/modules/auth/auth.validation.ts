import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "email is required",
    }),
    password: z.string({
      required_error: "password is required",
    }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "oldPassword is required",
    }),

    newPassword: z.string({
      required_error: "newPassword is required",
    }),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "email is required",
    }),
  }),
});

export {
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  loginValidationSchema,
};
