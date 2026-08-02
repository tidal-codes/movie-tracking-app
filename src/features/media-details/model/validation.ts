import { z } from "zod";

export const mediaIdParamSchema = z.object({
  id: z.coerce.number().int().positive("شناسه نامعتبر است"),
});

export const seasonParamsSchema = z.object({
  id: z.coerce.number().int().positive("شناسه‌ی سریال نامعتبر است"),
  seasonNumber: z.coerce.number().int().min(0, "شماره‌ی فصل نامعتبر است"),
});

export type MediaIdParamInput = z.infer<typeof mediaIdParamSchema>;
export type SeasonParamsInput = z.infer<typeof seasonParamsSchema>;
