# interview-claims-pipeline

Setup for the technical interview. Please have this running **before** the session — we'll do a
short check with you the day before.

The task itself is explained at the start of the session.

## Requirements

Node 22+, pnpm, Docker.

## Setup

```bash
git clone https://github.com/Gently-AI/interview-claims-pipeline
cd interview-claims-pipeline

pnpm install
cp .env.example .env.local
docker compose up -d
```

Then put the SAS token we send you into `.env.local`:

```bash
AZURE_STORAGE_SAS="<the token we send you>"
```

That's the only value you need to set. The rest of `.env.example` is already correct.

## Check it works

```bash
pnpm check
```

Every line should say `PASS`. If anything says `FAIL`, tell us before the session rather than
spending interview time on it.

```bash
pnpm dev
```

API on `http://localhost:8080`, web on `http://localhost:3000`.

## Notes

- Use any AI tooling you like.
- You won't push anywhere — commit locally as you go.
- If your network blocks Azure, tell us and we'll switch you to the local emulator that
  `docker compose` already starts.
