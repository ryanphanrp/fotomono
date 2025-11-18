import dotenv from "dotenv";

dotenv.config({
  path: "../../apps/server/.env",
});

import { drizzle } from "drizzle-orm/node-postgres";

// Export database instance
export const db = drizzle(process.env.DATABASE_URL || "");

// Export all schema tables
export * from "./schema";
