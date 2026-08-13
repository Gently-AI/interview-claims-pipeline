import Database from "better-sqlite3";
import { SQLITE_PATH } from "./config.js";

export const db = new Database(SQLITE_PATH);

// WAL keeps reads fast while a long ingest is writing.
db.pragma("journal_mode = WAL");

export function pingDatabase(): boolean {
  try {
    db.prepare("select 1").get();
    return true;
  } catch {
    return false;
  }
}
