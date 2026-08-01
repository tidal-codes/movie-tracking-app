import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { consumeRateLimit, getClientIp } from "@/shared/lib/rate-limit";
import { verifyPassword } from "../lib/password";
import { loginRateLimiter } from "../lib/rate-limit-config";
import { createSession, setSessionCookie } from "../lib/session";
import { findUserByEmailOrUsername } from "../lib/user";
import { loginSchema } from "../model/validation";

// POST /api/auth/login
// body: { identifier, password }
// `identifier` can be either an email or a username.
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const rl = await consumeRateLimit(loginRateLimiter, ip);
  if (!rl.success) {
    return apiError("Too many login attempts. Please try again later.", 429);
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return apiError("Invalid request body.", 400);
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(
      "Invalid input data.",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const { identifier, password } = parsed.data;

  const user = await findUserByEmailOrUsername(identifier);

  // Intentionally return the same error message for both
  // "user not found" and "invalid password" to prevent
  // user enumeration attacks.
  if (!user) {
    return apiError("Invalid email/username or password.", 401);
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    return apiError("Invalid email/username or password.", 401);
  }

  const { token, expiresAt } = await createSession({
    userId: user.id,
    userAgent: req.headers.get("user-agent"),
    ipAddress: ip,
  });

  await setSessionCookie(token, expiresAt);

  const { passwordHash: _passwordHash, ...publicUser } = user;
  void _passwordHash;

  return apiSuccess({ user: publicUser });
}
