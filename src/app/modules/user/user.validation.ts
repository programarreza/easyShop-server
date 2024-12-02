import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    email: z.string({
      required_error: "email is required",
    }),
    password: z.string({
      required_error: "password is required",
    }),
    phoneNumber: z.string({
      required_error: "phoneNumber is required",
    }),
    address: z.string({
      required_error: "address is required",
    }),
  }),
});

export { createUserValidationSchema };
