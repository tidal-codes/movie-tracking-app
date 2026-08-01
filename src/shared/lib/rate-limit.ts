import type { NextRequest } from "next/server";
import { RateLimiterMemory, type RateLimiterRes } from "rate-limiter-flexible";

export interface RateLimitResult {
  success: boolean;
  remainingPoints: number;
  resetInSeconds: number;
}

/**
 * یه instance جدید از RateLimiterMemory میسازه.
 * نکته‌ی مهم: این نوع ریت‌لیمیت کاملاً in-memory و مخصوص یک process هست
 * (بر خلاف Redis که بین چند instance مشترکه). برای اکثر پروژه‌های تک-سرور
 * کافیه؛ اگه بعداً پشت چند instance/سرور رفتی و خواستی ریت‌لیمیت مشترک
 * داشته باشی، باید یه store توزیع‌شده (مثل Redis) جایگزینش کنی.
 *
 * points = تعداد درخواست مجاز، duration = طول پنجره به ثانیه
 */
export function createRateLimiter(
  points: number,
  durationSeconds: number,
): RateLimiterMemory {
  return new RateLimiterMemory({ points, duration: durationSeconds });
}

export async function consumeRateLimit(
  limiter: RateLimiterMemory,
  key: string,
): Promise<RateLimitResult> {
  try {
    const res = await limiter.consume(key);
    return {
      success: true,
      remainingPoints: res.remainingPoints,
      resetInSeconds: Math.ceil(res.msBeforeNext / 1000),
    };
  } catch (rejected) {
    // وقتی سقف رد بشه، rate-limiter-flexible یه RateLimiterRes رو reject می‌کنه (نه Error)
    const rejRes = rejected as RateLimiterRes;
    return {
      success: false,
      remainingPoints: rejRes?.remainingPoints ?? 0,
      resetInSeconds: Math.ceil((rejRes?.msBeforeNext ?? 1000) / 1000),
    };
  }
}

export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}
