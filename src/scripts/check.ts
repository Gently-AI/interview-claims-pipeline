/**
 * Setup check. Run `pnpm check` before your session to confirm everything works.
 * It verifies Postgres is reachable and that your SAS token can list every container.
 */
import { getAllContainerClients } from "../blob.js";
import { AZURE_ACCOUNT, USE_AZURITE } from "../config.js";
import { pingDatabase, pool } from "../db.js";

async function main(): Promise<void> {
  let failed = false;

  const dbOk = await pingDatabase();
  console.log(
    dbOk
      ? "PASS  postgres reachable"
      : "FAIL  postgres unreachable — is `docker compose up -d` running?",
  );
  failed ||= !dbOk;

  const where = USE_AZURITE ? "azurite" : AZURE_ACCOUNT;
  for (const { container, client } of getAllContainerClients()) {
    try {
      const first = await client.listBlobsFlat().next();
      if (first.done) {
        console.log(`FAIL  ${where}/${container} listed but is empty — tell your interviewer`);
        failed = true;
      } else {
        console.log(`PASS  ${where}/${container} reachable, first blob: ${first.value.name}`);
      }
    } catch (error) {
      console.log(`FAIL  ${where}/${container} unreachable — ${(error as Error).message}`);
      failed = true;
    }
  }

  await pool.end();
  process.exit(failed ? 1 : 0);
}

void main();
