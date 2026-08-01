import { apiSuccess } from "@/shared/lib/api-response";
import {
  clearSessionCookie,
  deleteSessionByToken,
  getSessionTokenFromCookies,
} from "../lib/session";

export async function POST() {
  const token = await getSessionTokenFromCookies();
  if (token) {
    await deleteSessionByToken(token);
  }
  await clearSessionCookie();

  return apiSuccess({ loggedOut: true });
}
