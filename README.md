# interview-claims-pipeline

Starter for the technical interview. Please get this running **before** the session — we'll do a
short check with you the day before.

The task itself is explained at the start of the session. There's nothing to read here beyond setup.

## Stack

TypeScript on Node for the backend, React on the frontend — the same shape we use at Gently. It's
fine if you haven't used some of it; we're interested in how you work, not whether you've memorised
an API. Use any AI tooling you like.

Storage is **SQLite**, so there's no database to install and no Docker.

## Requirements

- **Node 22+** (`node -v`)
- **pnpm** (`npm i -g pnpm` if you don't have it)

That's all.

## Setup

```bash
git clone https://github.com/Gently-AI/interview-claims-pipeline
cd interview-claims-pipeline

pnpm install
cp .env.example .env.local
```

Open `.env.local` and paste the SAS URL we sent you:

```bash
AZURE_SAS_URL='https://gentlyinterview.blob.core.windows.net/?sv=...&sig=...'
```

**Keep the quotes.** Without them the shell splits on the `&` characters and the value silently
truncates. That's the single most common setup problem here.

`AZURE_SAS_URL` is the only value you need to set — everything else in `.env.example` is already
correct.

## Check it works

```bash
pnpm check
```

You want:

```
PASS  sqlite opens
PASS  division-a — 63 files
PASS  division-b — 60 files
PASS  division-c — 60 files

All good.
```

If anything says `FAIL`, tell us **before** the session rather than spending interview time on it.
The usual causes are an expired SAS or the quoting problem above.

## Run it

```bash
pnpm dev
```

Runs both together:

- **API** — `http://localhost:8787`, try `http://localhost:8787/api/health`
- **Web** — `http://localhost:3000` (Vite picks the next free port if 3000 is taken — watch the
  startup output)

The frontend proxies `/api/*` to the backend, so you can `fetch("/api/whatever")` from React
without any CORS setup.

If a port is already taken: the API will tell you and exit — set `PORT` in `.env.local` (the Vite
proxy follows it automatically). Vite just moves to the next free port and prints where it landed.

Run them separately if you prefer:

```bash
pnpm dev:api     # backend only, watch mode
pnpm dev:web     # frontend only
```

Other scripts: `pnpm typecheck`, `pnpm build`.

## What's here

```
src/config.ts          env parsing; containers pre-filled, builds container URLs from the SAS
src/blob.ts            blob storage clients
src/db.ts              SQLite connection
src/server.ts          Express app with /api/health — add your endpoints here
src/scripts/check.ts   what `pnpm check` runs
web/src/App.tsx        React entry point — build your UI here
```

There's no ingest, no schema and no parsing. That's the exercise.

## Notes

- Use any AI tooling you like — that's expected, not merely tolerated.
- You won't push anywhere. Commit locally as you go; we read the commit stream while you work.
- Please don't publish your solution afterwards — we reuse this exercise.
- The SAS is read-only and expires, so there's nothing you can break.
- If your network blocks Azure Blob Storage, tell us before the session.
