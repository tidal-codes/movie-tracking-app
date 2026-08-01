import { createRateLimiter } from "@/shared/lib/rate-limit";

export const searchRateLimiter = createRateLimiter(40, 60); 
export const trendingRateLimiter = createRateLimiter(20, 60); 
