import { z } from "zod";

export const collegeListQuerySchema = z.object({
  q: z.string().optional(),
  state: z.string().optional(),
  minFees: z.coerce.number().int().min(0).optional(),
  maxFees: z.coerce.number().int().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sort: z.enum(["rating", "fees", "name"]).default("rating"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const compareQuerySchema = z.object({
  ids: z
    .string()
    .min(1)
    .transform((value) => value.split(",").map((id) => id.trim()).filter(Boolean))
    .pipe(z.array(z.string()).min(2, "Select at least 2 colleges").max(3, "Maximum 3 colleges")),
});

export const saveComparisonSchema = z.object({
  collegeIds: z.array(z.string()).min(2).max(3),
  name: z.string().min(1).max(100).optional(),
});

export const saveCollegeSchema = z.object({
  collegeId: z.string().min(1),
});
