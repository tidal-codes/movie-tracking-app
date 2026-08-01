import { NextRequest } from "next/server";
import { getCurrentUser } from "@/features/auth/lib/session";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { consumeRateLimit } from "@/shared/lib/rate-limit";
import { TmdbApiError, tmdbFetch } from "@/shared/lib/tmdb/client";
import type { TmdbPaginatedResponse, TmdbTvRaw } from "@/shared/lib/tmdb/types";
import { mapTvShowSummary } from "../lib/mappers";
import { trendingRateLimiter } from "../lib/rate-limit-config";
import type { PaginatedResult, TvShowSummary } from "../model/types";
import { trendingQuerySchema } from "../model/validation";

// GET /api/explore/trend/tv?page=1
// بازه‌ی زمانی طبق تصمیم گرفته‌شده ثابته: week (هماهنگ با روت فیلم‌ها)
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("برای این عملیات باید لاگین کنید", 401);
  }

  const rl = await consumeRateLimit(trendingRateLimiter, user.id);
  if (!rl.success) {
    return apiError(
      "تعداد درخواست‌ها بیش از حد مجاز است، کمی بعد تلاش کنید.",
      429,
    );
  }

  const parsed = trendingQuerySchema.safeParse({
    page: req.nextUrl.searchParams.get("page") ?? undefined,
  });
  if (!parsed.success) {
    return apiError(
      "پارامتر page نامعتبر است",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    const raw = await tmdbFetch<TmdbPaginatedResponse<TmdbTvRaw>>({
      path: "/trending/tv/week",
      searchParams: { language: "en-US", page: parsed.data.page },
    });

    const result: PaginatedResult<TvShowSummary> = {
      page: raw.page,
      results: raw.results.map(mapTvShowSummary),
      totalPages: raw.total_pages,
      totalResults: raw.total_results,
    };

    return apiSuccess(result);
  } catch (error) {
    if (error instanceof TmdbApiError) {
      const status =
        error.status === 504 || error.status === 503 ? error.status : 502;
      return apiError(error.message, status);
    }
    console.error("[explore/trend/tv] unexpected error", error);
    return apiError("خطای غیرمنتظره‌ای رخ داد", 500);
  }
}
