import { z } from "zod";

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "name  is required",
    }),
    price: z.number({
      required_error: "price  is required",
    }),
    categoryId: z.string({
      required_error: "categoryId  is required",
    }),
    inventoryCount: z.number({
      required_error: "inventoryCount  is required",
    }),
    discount: z.number().optional(),
    description: z.string({
      required_error: "description  is required",
    }),
  }),
});

export { createProductValidationSchema };
