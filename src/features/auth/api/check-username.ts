import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { consumeRateLimit, getClientIp } from "@/shared/lib/rate-limit";
import { checkUsernameRateLimiter } from "../lib/rate-limit-config";
import { usernameExists } from "../lib/user";
import { checkUsernameSchema } from "../model/validation";

// GET /api/auth/check-username?username=taha
export async function GET(req: NextRequest) {
  const ip = getClientIp(req);

  const rl = await consumeRateLimit(checkUsernameRateLimiter, ip);
  if (!rl.success) {
    return apiError("Too many requests. Please try again later.", 429);
  }

  const username = req.nextUrl.searchParams.get("username") ?? "";

  const parsed = checkUsernameSchema.safeParse({ username });

  if (!parsed.success) {
    return apiError(
      "Invalid username.",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const exists = await usernameExists(parsed.data.username);

  return apiSuccess({ available: !exists });
}
