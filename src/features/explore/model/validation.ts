import { z } from "zod";

export const searchQuerySchema = z.object({
  query: z
    .string()
    .min(1, "عبارت جستجو الزامی است")
    .max(200, "عبارت جستجو خیلی طولانی است"),
  page: z.coerce.number().int().min(1).max(500).default(1),
});

export const trendingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(500).default(1),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type TrendingQueryInput = z.infer<typeof trendingQuerySchema>;
