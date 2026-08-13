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

  let containers: ReturnType<typeof getAllContainerClients> = [];
  try {
    containers = getAllContainerClients();
  } catch (error) {
    console.log(`FAIL  ${(error as Error).message}`);
    console.log("\nSomething failed — tell us before the session.");
    process.exit(1);
  }

  for (const { container, client } of containers) {
    try {
      let n = 0;
      for await (const _blob of client.listBlobsFlat()) n++;
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
