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

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "name is required",
      })
      .optional(),
    description: z
      .string({
        required_error: "description  is required",
      })
      .optional(),
  }),
});

export { createCategoryValidationSchema, updateCategoryValidationSchema };
