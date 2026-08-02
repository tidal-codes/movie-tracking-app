import { createRateLimiter } from "@/shared/lib/rate-limit";

export const mediaDetailsRateLimiter = createRateLimiter(60, 60); // ۶۰ درخواست در دقیقه به ازای هر کاربر
