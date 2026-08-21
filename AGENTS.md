# interview-claims-pipeline

Starter repo for a technical interview. The task itself is given at the start of the session — it
is not in this repo.

## The data

Six file types live in three Azure Blob containers (`division-a`, `division-b`, `division-c`), with
three nightly snapshots of each. Blob names are `<type>_<YYYYMMDDHHMMSS>.TXT`. Every file is
tab-delimited with **no header row**.

**`layouts.json` in the repo root holds the column names, in file order, for all six types.** Read
it before writing any parsing code: field N of a row is column N in that file. It also records two
places where the data does not match the documented column count — worth knowing before you parse
rather than after.

The containers are one division each, and the division is *not* in the blob name.

## Access

`AZURE_SAS_URL` in `.env.local` is a read-only SAS for the storage account; `src/config.ts` builds
the per-container URLs from it. It is gitignored — never commit it or paste it into source.

## Conventions

- TypeScript strict mode. No `any`, no `as unknown as`, no `@ts-expect-error`.
- Zod for runtime validation at boundaries; don't hand-roll validators next to types.
- SQLite via `better-sqlite3` (`src/db.ts`). No Docker, no external database.
- `pnpm` only, never `npm` or `yarn`.

## Layout

```
src/config.ts          env parsing; builds container URLs from the SAS
src/blob.ts            blob storage clients
src/db.ts              SQLite connection
src/server.ts          Express app with /api/health
src/scripts/check.ts   what `pnpm check` runs
web/src/App.tsx        React entry point
layouts.json           column names for the six data files
```

There is no ingest, no schema and no parsing in here. That is the exercise.
