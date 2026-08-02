import { NextRequest } from "next/server";
import { getCurrentUser } from "@/features/auth/lib/session";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { consumeRateLimit } from "@/shared/lib/rate-limit";
import { TmdbApiError, tmdbFetch } from "@/shared/lib/tmdb/client";
import type { TmdbSeasonDetailRaw } from "@/shared/lib/tmdb/types";
import { mapSeasonDetails } from "../lib/mappers";
import { mediaDetailsRateLimiter } from "../lib/rate-limit-config";
import { seasonParamsSchema } from "../model/validation";

interface RouteContext {
  params: Promise<{ id: string; seasonNumber: string }>;
}

// GET /api/media/tv/[id]/season/[seasonNumber]
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("برای این عملیات باید لاگین کنید", 401);
  }

  const rl = await consumeRateLimit(mediaDetailsRateLimiter, user.id);
  if (!rl.success) {
    return apiError(
      "تعداد درخواست‌ها بیش از حد مجاز است، کمی بعد تلاش کنید.",
      429,
    );
  }

  const { id, seasonNumber } = await params;
  const parsed = seasonParamsSchema.safeParse({ id, seasonNumber });
  if (!parsed.success) {
    return apiError(
      "پارامترهای فصل نامعتبرند",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    const raw = await tmdbFetch<TmdbSeasonDetailRaw>({
      path: `/tv/${parsed.data.id}/season/${parsed.data.seasonNumber}`,
      searchParams: { language: "en-US" },
    });

    return apiSuccess(mapSeasonDetails(raw, parsed.data.id));
  } catch (error) {
    if (error instanceof TmdbApiError) {
      if (error.status === 404) {
        return apiError("این فصل پیدا نشد", 404);
      }
      const status =
        error.status === 504 || error.status === 503 ? error.status : 502;
      return apiError(error.message, status);
    }
    console.error("[media/tv/season] unexpected error", error);
    return apiError("خطای غیرمنتظره‌ای رخ داد", 500);
  }
}
