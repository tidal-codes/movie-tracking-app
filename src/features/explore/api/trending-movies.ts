import { NextRequest } from "next/server";
import { getCurrentUser } from "@/features/auth/lib/session";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { consumeRateLimit } from "@/shared/lib/rate-limit";
import { TmdbApiError, tmdbFetch } from "@/shared/lib/tmdb/client";
import type { TmdbMovieRaw, TmdbPaginatedResponse } from "@/shared/lib/tmdb/types";
import { mapMovieSummary } from "../lib/mappers";
import { trendingRateLimiter } from "../lib/rate-limit-config";
import type { MovieSummary, PaginatedResult } from "../model/types";
import { trendingQuerySchema } from "../model/validation";

// GET /api/explore/trend/movies?page=1
// بازه‌ی زمانی طبق تصمیم گرفته‌شده ثابته: week
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("برای این عملیات باید لاگین کنید", 401);
  }

  const rl = await consumeRateLimit(trendingRateLimiter, user.id);
  if (!rl.success) {
    return apiError("تعداد درخواست‌ها بیش از حد مجاز است، کمی بعد تلاش کنید.", 429);
  }

  const parsed = trendingQuerySchema.safeParse({
    page: req.nextUrl.searchParams.get("page") ?? undefined,
  });
  if (!parsed.success) {
    return apiError("پارامتر page نامعتبر است", 400, parsed.error.flatten().fieldErrors);
  }

  try {
    const raw = await tmdbFetch<TmdbPaginatedResponse<TmdbMovieRaw>>({
      path: "/trending/movie/week",
      searchParams: { language: "en-US", page: parsed.data.page },
    });

    const result: PaginatedResult<MovieSummary> = {
      page: raw.page,
      results: raw.results.map(mapMovieSummary),
      totalPages: raw.total_pages,
      totalResults: raw.total_results,
    };

    return apiSuccess(result);
  } catch (error) {
    if (error instanceof TmdbApiError) {
      const status = error.status === 504 || error.status === 503 ? error.status : 502;
      return apiError(error.message, status);
    }
    console.error("[explore/trend/movies] unexpected error", error);
    return apiError("خطای غیرمنتظره‌ای رخ داد", 500);
  }
}