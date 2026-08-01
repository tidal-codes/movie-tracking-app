import { createRateLimiter } from "@/shared/lib/rate-limit";


export const loginRateLimiter = createRateLimiter(5, 15 * 60);
export const registerRateLimiter = createRateLimiter(5, 60 * 60);
export const checkUsernameRateLimiter = createRateLimiter(30, 60); 
