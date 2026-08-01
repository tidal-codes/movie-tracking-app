import { NextRequest } from "next/server";
import { getCurrentUser } from "@/features/auth/lib/session";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { consumeRateLimit } from "@/shared/lib/rate-limit";
import { TmdbApiError, tmdbFetch } from "@/shared/lib/tmdb/client";
import type {
  TmdbMultiSearchRaw,
  TmdbPaginatedResponse,
} from "@/shared/lib/tmdb/types";
import { mapMultiSearchResults } from "../lib/mappers";
import { searchRateLimiter } from "../lib/rate-limit-config";
import type { ExploreMediaSummary, PaginatedResult } from "../model/types";
import { searchQuerySchema } from "../model/validation";

// GET /api/explore/search?query=...&page=1
// نیازمند لاگین. صفحه از کلاینت گرفته میشه و مستقیم به TMDB پاس داده میشه.
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("برای این عملیات باید لاگین کنید", 401);
  }

  const rl = await consumeRateLimit(searchRateLimiter, user.id);
  if (!rl.success) {
    return apiError(
      "تعداد درخواست‌های جستجو بیش از حد مجاز است، کمی بعد تلاش کنید.",
      429,
    );
  }

  const parsed = searchQuerySchema.safeParse({
    query: req.nextUrl.searchParams.get("query") ?? undefined,
    page: req.nextUrl.searchParams.get("page") ?? undefined,
  });

  if (!parsed.success) {
    return apiError(
      "پارامترهای جستجو نامعتبرند",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const { query, page } = parsed.data;

  try {
    const raw = await tmdbFetch<TmdbPaginatedResponse<TmdbMultiSearchRaw>>({
      path: "/search/multi",
      searchParams: {
        query,
        page,
        include_adult: false,
        language: "en-US",
      },
    });

    const result: PaginatedResult<ExploreMediaSummary> = {
      page: raw.page,
      results: mapMultiSearchResults(raw.results),
      totalPages: raw.total_pages,
      totalResults: raw.total_results,
    };

    return apiSuccess(result);
  } catch (error) {
    if (error instanceof TmdbApiError) {
      // 504/503 (timeout یا قطعی شبکه) رو همون‌طور پاس میدیم، بقیه‌ی
      // خطاهای TMDB (مثلاً 4xx/5xx خودش) رو به‌صورت یکدست 502 برمی‌گردونیم
      const status =
        error.status === 504 || error.status === 503 ? error.status : 502;
      return apiError(error.message, status);
    }
    console.error("[explore/search] unexpected error", error);
    return apiError("خطای غیرمنتظره‌ای رخ داد", 500);
  }
}
