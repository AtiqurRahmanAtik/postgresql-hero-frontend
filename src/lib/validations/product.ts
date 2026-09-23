import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  category: z.string().max(50).optional(),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormData = z.output<typeof productSchema>;