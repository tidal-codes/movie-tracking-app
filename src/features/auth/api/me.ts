import { apiError, apiSuccess } from "@/shared/lib/api-response";
import { getCurrentUser } from "../lib/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return apiError("Unauthorized.", 401);
  }

  return apiSuccess({ user });
}