/**
 * Setup check — run `pnpm check` before your session.
 * Verifies the database opens and that your SAS URL can list every container.
 */
import { getAllContainerClients } from "../blob.js";
import { pingDatabase } from "../db.js";

async function main(): Promise<void> {
  let failed = false;

  const dbOk = pingDatabase();
  console.log(dbOk ? "PASS  sqlite opens" : "FAIL  sqlite could not open");
  failed ||= !dbOk;

  for (const { container, client } of getAllContainerClients()) {
    try {
      let n = 0;
      for await (const _ of client.listBlobsFlat()) n++;
      if (n === 0) {
        console.log(`FAIL  ${container} listed but is empty`);
        failed = true;
      } else {
        console.log(`PASS  ${container} — ${n} files`);
      }
    } catch (error) {
      console.log(`FAIL  ${container} — ${(error as Error).message}`);
      failed = true;
    }
  }

  console.log(failed ? "\nSomething failed — tell us before the session." : "\nAll good.");
  process.exit(failed ? 1 : 0);
}

void main();
