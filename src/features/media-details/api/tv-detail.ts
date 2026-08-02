import { NextRequest } from "next/server";
import { getCurrentUser } from "@/features/auth/lib/session";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { consumeRateLimit } from "@/shared/lib/rate-limit";
import { TmdbApiError, tmdbFetch } from "@/shared/lib/tmdb/client";
import type { TmdbTvDetailRaw } from "@/shared/lib/tmdb/types";
import { mapTvShowDetails } from "../lib/mappers";
import { mediaDetailsRateLimiter } from "../lib/rate-limit-config";
import { mediaIdParamSchema } from "../model/validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/media/tv/[id]
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

  const { id } = await params;
  const parsed = mediaIdParamSchema.safeParse({ id });
  if (!parsed.success) {
    return apiError(
      "شناسه‌ی سریال نامعتبر است",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    const raw = await tmdbFetch<TmdbTvDetailRaw>({
      path: `/tv/${parsed.data.id}`,
      searchParams: { language: "en-US" },
    });

    return apiSuccess(mapTvShowDetails(raw));
  } catch (error) {
    if (error instanceof TmdbApiError) {
      if (error.status === 404) {
        return apiError("سریالی با این شناسه پیدا نشد", 404);
      }
      const status =
        error.status === 504 || error.status === 503 ? error.status : 502;
      return apiError(error.message, status);
    }
    console.error("[media/tv] unexpected error", error);
    return apiError("خطای غیرمنتظره‌ای رخ داد", 500);
  }
}
