# interview-claims-pipeline

Setup for the technical interview — a couple of minutes. The task is explained at the start of the
session. TypeScript + Express + React + SQLite; no Docker, no database to install.

## Setup

```bash
git clone https://github.com/Gently-AI/interview-claims-pipeline
cd interview-claims-pipeline
pnpm install
cp .env.example .env.local
```

Paste the SAS URL we sent you into `.env.local` — the only value you need to set. **Keep the
quotes**, or the shell splits on the `&` and it silently truncates:

```bash
AZURE_SAS_URL='https://gentlyinterview.blob.core.windows.net/?sv=...&sig=...'
```

```bash
pnpm check   # 4x PASS, then "All good."
pnpm dev     # api :8787, web :3000
```

The web app proxies `/api/*` to the API, so there's no CORS setup. Also `pnpm dev:api`,
`pnpm dev:web`, `pnpm typecheck`, `pnpm build`.

If `pnpm check` says `FAIL`, tell us **before** the session — usually an expired SAS or the quoting
above. If a port is taken the API says so and exits; set `PORT` in `.env.local` and the web proxy
follows it.

<details>
<summary><b>Node 22+ or pnpm missing?</b></summary>

`pnpm install` and `pnpm dev` check your Node version first and print these same commands, so you
can also just run one and follow what it tells you.

```bash
node -v && pnpm -v      # want Node v22.x or newer
```

If you have a version manager:

```bash
nvm install 22 && nvm use 22          # or: fnm install 22 && fnm use 22
```

If you don't, install one, **reopen your terminal**, then run the above:

| Platform | Command |
| --- | --- |
| macOS / Linux | `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh \| bash` |
| Windows | `winget install CoreyButler.NVMforWindows` |

Or skip the version manager and install Node directly — `brew install node@22` on macOS,
`winget install OpenJS.NodeJS.LTS` on Windows, or the LTS installer from
[nodejs.org](https://nodejs.org). Missing pnpm: `npm i -g pnpm`.

Sort this out before the session, not during it.

</details>

<details>
<summary><b>On Ubuntu, Debian or WSL? Read this</b></summary>

**Don't `apt install nodejs`.** Ubuntu's own package is far too old on every current LTS — Node 12
on 22.04, Node 18 on 24.04 — so `pnpm install` will refuse to run. Use one of these instead.

**nvm — recommended, and the only route that needs no `sudo` afterwards:**

```bash
sudo apt update && sudo apt install -y curl   # minimal and WSL images often ship without curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
exec $SHELL -l                                # picks up nvm without closing the terminal
nvm install 22 && nvm use 22
corepack enable                               # gives you pnpm, no sudo
```

**NodeSource — system-wide, if you'd rather not use a version manager:**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo corepack enable                          # or: sudo npm i -g pnpm
```

If something goes wrong, it's almost certainly one of these four:

| Symptom | Cause and fix |
| --- | --- |
| `nvm: command not found`, right after installing it | The installer appends to `~/.bashrc`, which your current shell already read. Run `exec $SHELL -l`, or open a new terminal. Much the most common one. |
| `EACCES` on `npm i -g pnpm` | apt- and NodeSource-installed Node put global packages in a root-owned directory. Prefix with `sudo`, or use nvm, where it doesn't happen. |
| `better-sqlite3 install: node-gyp rebuild exited with status 1` | You're on an old clone — `git pull`. The repo no longer builds this package from source; it uses a prebuilt binary that needs no compiler. If you still see it after pulling, `sudo apt install -y build-essential python3` will get you past it. |
| Node reverts to an old version after `nvm use` | A snap- or apt-installed Node is shadowing it. Check with `which -a node`; if something under `/snap` or `/usr/bin` wins, remove it or put the nvm shim first on `PATH`. |

**On WSL, clone into your Linux home directory** (`~/`), not `/mnt/c/...`. Writing `node_modules`
onto the Windows filesystem through the translation layer is slow enough to cost you several
minutes on its own.

</details>

## The data

Each container is one division. All three hold the same six files, with three nightly snapshots of
each — **18 files per container**. Names are `<type>_<YYYYMMDDHHMMSS>.TXT`:

```
transactions_invoice_line_items_20260812040703.TXT
└─ file type ─────────────────┘ └─ snapshot taken
```

Every file is tab-delimited with no header row. Column names, in file order, are in
[`layouts.json`](layouts.json) at the repo root — read that before writing a parser.

| File | Cols | What it is |
| --- | --- | --- |
| `transactions_invoice_line_items_*` | 123 | A row per line we invoiced **to a customer**, with the price it sold at against list. **The claims live here — start here.** |
| `supplier_invoices_*` | 50 | A row per line a **supplier invoiced us** — what we owe them. Amount, PO number, goods receipt, due date, terms. |
| `order_line_sourcing_*` | 38 | A row per sales order line, recording **which supplier and purchase order filled it**, plus cost overrides. No prices or quantities. Easily the biggest file, up to ~75 MB. |
| `products_*` | 68 | A row per item: descriptions, costs, unit of measure. |
| `customers_*` | 18 | A row per customer: number, name, address. |
| `suppliers_*` | 10 | A row per supplier: number, name, address. |

Two of those are invoices pointing in opposite directions: `transactions_invoice_line_items` is what
we billed a customer, `supplier_invoices` is what a supplier billed us.

The division is the container, not the filename — `suppliers` in particular has no division column
in its rows.

## What's here

```
src/config.ts          env parsing; containers pre-filled, builds container URLs from the SAS
src/blob.ts            blob storage clients
src/db.ts              SQLite connection
src/server.ts          Express app with /api/health — add your endpoints here
src/scripts/check.ts   what `pnpm check` runs
web/src/App.tsx        React entry point — build your UI here
layouts.json           column names for the six data files
AGENTS.md              repo context for coding agents (CLAUDE.md symlinks to it)
```

There's no ingest, no schema and no parsing. That's the exercise.

## Notes

- Use any AI tooling you like — that's expected, not merely tolerated.
- You won't push anywhere. Commit locally as you go; we read the commit stream while you work.
- Please don't publish your solution afterwards — we reuse this exercise.
- The SAS is read-only and expires, so there's nothing you can break.
- If your network blocks Azure Blob Storage, tell us before the session.
