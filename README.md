# interview-claims-pipeline

Setup for the technical interview. Please get this working **before** the session — we'll do a
short check with you the day before.

The task itself is explained at the start of the session. There's no code here to read.

## What you need

- **Any language and framework you like** — whatever you're fastest in. Node, Python, Go, Ruby,
  anything. There's no fixed stack and nothing to install from us.
- **A database.** SQLite is the easy choice: no install, no server. Postgres or MySQL are fine if
  you already have one running.
- **No Docker required.**

You'll be starting from an empty directory, so set up your project however you normally would.

## What we'll send you

1. A **SAS URL** for the data — looks like
   `https://gentlyinterview.blob.core.windows.net/?sv=...&sig=...`
2. Three container names: `division-a`, `division-b`, `division-c`

The SAS is read-only and expires. You can't write to or delete anything, so there's nothing you
can break.

## Check it works

Paste your SAS URL between the quotes and run this. **Keep the single quotes** — without them the
shell will eat the `&` characters and the token will silently break.

```bash
SAS_URL='https://gentlyinterview.blob.core.windows.net/?sv=...&sig=...'

BASE="${SAS_URL%%\?*}"; BASE="${BASE%/}"; QS="${SAS_URL#*\?}"
for c in division-a division-b division-c; do
  n=$(curl -s "$BASE/$c?restype=container&comp=list&$QS" | grep -c '<Name>')
  [ "$n" -gt 0 ] && echo "OK    $c — $n files" || echo "FAIL  $c"
done
```

You want three `OK` lines:

```
OK    division-a — 64 files
OK    division-b — 61 files
OK    division-c — 61 files
```

If you get a `FAIL`, run this to see the actual error and send it to us:

```bash
curl -s "$BASE/division-a?restype=container&comp=list&$QS" | head -5
```

Common causes: the token expired, or the `&` characters got split by an unquoted shell variable.

## Then confirm you can read a file

```bash
curl -s "$BASE/division-a?restype=container&comp=list&$QS" \
  | grep -o '<Name>[^<]*</Name>' | sed 's/<[^>]*>//g' | head
```

That's everything. If both commands work, you're ready.

## Notes

- Use any AI tooling you like — that's expected, not tolerated.
- You won't push anywhere. Commit locally as you go; we read the commit stream while you work.
- Please don't publish your solution afterwards — we reuse this exercise.
- If your network blocks Azure Blob Storage, tell us before the session and we'll sort out an
  alternative.
