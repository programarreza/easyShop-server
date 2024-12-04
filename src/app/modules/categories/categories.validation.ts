import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    description: z.string({
      required_error: "description  is required",
    }),
  }),
});

export { createCategoryValidationSchema };
