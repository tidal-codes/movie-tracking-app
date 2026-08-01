import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/shared/lib/prisma";
import { publicUserSelect, type PublicUser } from "./user";

export const SESSION_COOKIE_NAME = "session_token";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; 
const SESSION_REFRESH_THRESHOLD_MS = 1000 * 60 * 60 * 24; 


function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export interface CreateSessionOptions {
  userId: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}

export interface CreatedSession {
  token: string;
  expiresAt: Date;
}

export async function createSession({
  userId,
  userAgent,
  ipAddress,
}: CreateSessionOptions): Promise<CreatedSession> {
  const token = generateSessionToken();
  const id = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      id,
      userId,
      userAgent: userAgent ?? null,
      ipAddress: ipAddress ?? null,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function setSessionCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionTokenFromCookies(): Promise<
  string | undefined
> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export interface ValidatedSession {
  user: PublicUser;
  session: { id: string; expiresAt: Date };
}

export async function validateSessionToken(
  token: string,
): Promise<ValidatedSession | null> {
  const id = hashToken(token);

  const session = await prisma.session.findUnique({
    where: { id },
    include: { user: { select: publicUserSelect } },
  });

  if (!session) return null;

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { id } }).catch(() => {});
    return null;
  }

  let { expiresAt } = session;
  if (expiresAt.getTime() - Date.now() < SESSION_REFRESH_THRESHOLD_MS) {
    expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await prisma.session.update({ where: { id }, data: { expiresAt } });
  }

  return { user: session.user, session: { id: session.id, expiresAt } };
}

export async function deleteSessionByToken(token: string): Promise<void> {
  const id = hashToken(token);
  await prisma.session.delete({ where: { id } }).catch(() => {});
}

export async function deleteAllSessionsForUser(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const token = await getSessionTokenFromCookies();
  if (!token) return null;

  const result = await validateSessionToken(token);
  return result?.user ?? null;
}
