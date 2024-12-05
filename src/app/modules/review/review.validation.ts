import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    productId: z.string({
      required_error: "productId  is required",
    }),
    rating: z.number({
      required_error: "rating  is required",
    }),
    reviewText: z.string({
      required_error: "reviewText  is required",
    }),
  }),
});

export { createReviewValidationSchema };
