import { createNeonAuth } from "@neon/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL || "http://localhost:3000";
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET || "development-cookie-secret-change-me";

if (!process.env.NEON_AUTH_BASE_URL || !process.env.NEON_AUTH_COOKIE_SECRET) {
  console.warn(
    "NEON_AUTH_* environment variables are missing. Add them to .env.local before production deployment."
  );
}

export const auth = createNeonAuth({
  baseUrl,
  cookies: { secret: cookieSecret },
});
