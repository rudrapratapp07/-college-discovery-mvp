import { Pool } from "pg";

/** Shared pg pool for Supabase (avoids TLS cert issues on Windows dev). */
export function createPgPool() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }

  const url = new URL(raw);
  url.searchParams.delete("sslmode");

  return new Pool({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
}
