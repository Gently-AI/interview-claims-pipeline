import dotenv from "dotenv";
import { z } from "zod";

// .env.local wins; .env is a fallback. Values already in the real environment
// are never overwritten by either.
dotenv.config({ path: ".env.local" });
dotenv.config();

/**
 * The only value you need to set is AZURE_SAS_URL, in .env.local.
 * Everything else already has a working default.
 */
const EnvSchema = z.object({
  AZURE_SAS_URL: z.string().default(""),
  AZURE_STORAGE_CONTAINERS: z
    .string()
    .min(1)
    .default("division-a,division-b,division-c"),
  SQLITE_PATH: z.string().min(1).default("claims.db"),
  PORT: z.coerce.number().int().positive().default(8787),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const SQLITE_PATH = env.SQLITE_PATH;
export const PORT = env.PORT;

/** Containers to read from. */
export const CONTAINERS: readonly string[] = env.AZURE_STORAGE_CONTAINERS.split(",")
  .map((c) => c.trim())
  .filter((c) => c.length > 0);

export function assertBlobCredentials(): void {
  if (!env.AZURE_SAS_URL) {
    throw new Error(
      "AZURE_SAS_URL is empty. Copy .env.example to .env.local and paste the SAS URL we sent you.",
    );
  }
}

/**
 * Build a container URL from the SAS URL we gave you.
 *
 * The SAS URL points at the account root; the container name belongs in the
 * path, before the query string.
 */
export function containerUrl(container: string): string {
  assertBlobCredentials();
  const url = new URL(env.AZURE_SAS_URL);
  return `${url.origin}/${container}${url.search}`;
}
