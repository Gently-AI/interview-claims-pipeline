import "dotenv/config";
import { z } from "zod";

/**
 * Storage account and containers are pre-filled — you should not need to change them.
 * The only value you must supply is AZURE_STORAGE_SAS.
 */
const EnvSchema = z.object({
  AZURE_STORAGE_ACCOUNT: z.string().min(1).default("gentlyinterview"),
  AZURE_STORAGE_CONTAINERS: z
    .string()
    .min(1)
    .default("division-a,division-b,division-c"),
  AZURE_STORAGE_SAS: z.string().default(""),
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgres://postgres:postgres@localhost:5433/claims"),
  USE_AZURITE: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  PORT: z.coerce.number().int().positive().default(8080),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const AZURE_ACCOUNT = env.AZURE_STORAGE_ACCOUNT;
export const DATABASE_URL = env.DATABASE_URL;
export const PORT = env.PORT;
export const USE_AZURITE = env.USE_AZURITE;

/** Containers to read from. */
export const AZURE_CONTAINERS: readonly string[] = env.AZURE_STORAGE_CONTAINERS.split(",")
  .map((c) => c.trim())
  .filter((c) => c.length > 0);

/** Normalised SAS query string, without a leading "?". */
export const AZURE_SAS = env.AZURE_STORAGE_SAS.replace(/^\?/, "");

export const AZURITE_ACCOUNT = "devstoreaccount1";
export const AZURITE_KEY =
  "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";

/** Base URL for the blob endpoint, Azurite or real Azure. */
export const BLOB_ENDPOINT = USE_AZURITE
  ? `http://localhost:10000/${AZURITE_ACCOUNT}`
  : `https://${AZURE_ACCOUNT}.blob.core.windows.net`;

/** Container URL including credentials, ready to hand to @azure/storage-blob. */
export function containerUrl(container: string): string {
  const base = `${BLOB_ENDPOINT}/${container}`;
  return AZURE_SAS ? `${base}?${AZURE_SAS}` : base;
}

export function assertBlobCredentials(): void {
  if (!USE_AZURITE && !AZURE_SAS) {
    throw new Error(
      "AZURE_STORAGE_SAS is empty. Copy .env.example to .env.local and paste the token we sent you.",
    );
  }
}
