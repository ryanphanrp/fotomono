import { db } from "@fotomono/db";
import * as schema from "@fotomono/db/schema/auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../../apps/server/.env" });

export const auth = betterAuth<BetterAuthOptions>({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET || "",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    process.env.CORS_ORIGIN || "http://localhost:3001",
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax", // Changed from "none" for local development
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  },
});
