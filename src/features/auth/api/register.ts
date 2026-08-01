import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { consumeRateLimit, getClientIp } from "@/shared/lib/rate-limit";
import { hashPassword } from "../lib/password";
import { prisma } from "@/shared/lib/prisma";
import { registerRateLimiter } from "../lib/rate-limit-config";
import { createSession, setSessionCookie } from "../lib/session";
import { emailExists, publicUserSelect, usernameExists } from "../lib/user";
import { registerSchema } from "../model/validation";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const rl = await consumeRateLimit(registerRateLimiter, ip);
  if (!rl.success) {
    return apiError(
      "Too many registration attempts. Please try again later.",
      429,
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return apiError("Invalid request body.", 400);
  }

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(
      "Invalid input data.",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const { firstName, lastName, email, username, password } = parsed.data;

  const [emailTaken, usernameTaken] = await Promise.all([
    emailExists(email),
    usernameExists(username),
  ]);

  const fieldErrors: Record<string, string[]> = {};

  if (emailTaken) {
    fieldErrors.email = ["This email is already registered."];
  }

  if (usernameTaken) {
    fieldErrors.username = ["This username is already taken."];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return apiError("Registration failed.", 409, fieldErrors);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      username,
      passwordHash,
    },
    select: publicUserSelect,
  });

  const { token, expiresAt } = await createSession({
    userId: user.id,
    userAgent: req.headers.get("user-agent"),
    ipAddress: ip,
  });

  await setSessionCookie(token, expiresAt);

  return apiSuccess({ user }, 201);
}