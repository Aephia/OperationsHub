# Config snapshot (balance work)

The hourly collector saves the galaxy's STATE (fleets, stakes). This tool saves the game's CONFIG as the chain
holds it today, in a form that can be diffed when the game team redeploys. Local only: not part of the hourly
pass, not bundled for the browser, not shown on the public page.

## Run

    node Tools/c4-live/config-snapshot.mjs [--out <dir>] [--only <table,...>] [--accept-empty <table,...>]

Default out dir: `Data/c4-live/config`. RPC: `C4_RPC_URL` or `https://testnet-rpc.z.ink` (public and rate
limited: each table is read once, one after another, one retry after 2.5 s; a full run is about 30 RPC reads and
takes about 25 s).

Add to `Tools/c4-live/package.json` scripts:

    "config-snapshot": "node config-snapshot.mjs"

Then `npm run config-snapshot` (from `Tools/c4-live`). Check (offline, no network):
`node Test/c4-config-snapshot-check.js` ("N passed, M failed"); `--neg` runs every rule against a mutant of the
tool and requires each mutant to fail a check.

Exit code: 0 all tables ok. 2 some tables failed: the others ARE written, and `index.json` says per table what is
on disk (a failed read or write never aborts the run). 1 nothing written: chain version unreadable, every table
failed to READ (no write was attempted), bad arguments, unknown table name, malformed drop path, another run holds
the lock. An unexpected crash of the tool itself prints `ERROR` and exits 1: that is NOT "nothing written"; read
`index.json` and the crash states below.

## Files in the out dir

| File | Content |
|---|---|
| `<table>.json` | `{ table, readAt (unix s), epoch {genesis, sage}, count, dropped?, rows }` |
| `index.json` | `{ takenAt, epoch, rpc, tables { name: { ok, count, sha256, readAt, unchangedSince?, duplicateKeys?, error?, message?, keptPrevious?, logPending? } } }` |
| `changes.jsonl` | one line per table that changed in a run: `{ at, fromEpoch, toEpoch, table, added:[keys], removed:[keys], changed:[{ key, oldKey?, name?, fields:[{ path, from, to }] }] }` |
| `history/<table>.<readAt>.json` | the file a change replaced, named by its own readAt |
| `.lock` | exists only while a run is going: a token `pid:random` |

Read the log with `readChanges(dir)` (exported by `config-snapshot.mjs`): it returns `{ entries, skipped }`, skips
every line that is not a JSON object with `table` and `at` (a line cut short by a crash, or junk), and counts them.

- `rows` are sorted by key (`id`, else `address`, else `name`; `keyField` per table below) and every object's keys
  are sorted, so two snapshots of an unchanged game are byte-identical apart from `readAt`.
- Rows that share a key (none today) are numbered `7`, `7#2`, ... in sorted order, and the diff pairs identical rows
  first, then the rest in order, so one changed row among duplicates is one change (`key` is the new row's number,
  `oldKey` the old row's when it differs). `index.json` records `duplicateKeys: n` (rows beyond the first per key)
  for such a table; absent means every key is unique.
- Not handled: a nested array whose elements only change ORDER shows up as changes at each position.
- bigint is written as a decimal string; `{ raw, value }` pairs are kept as they are (raw as a string).
- Every object with a `cargoId` gets `cargo` (the name) next to it; the id stays.
- `index.rpc` is the HOST only (never the path or query: paid endpoints carry keys there). Error messages written
  to the index, returned, or printed (including the CLI's own error line) have every `http(s)://...` and the
  RPC url's host+path, path, query and userinfo (as substrings, plain and percent-decoded) replaced with `<url>`.
- A path in `changed[].fields` is dotted with `[i]` for array positions, e.g. `resourceExtraction[0].rate.raw`;
  a field that appears or disappears has `null` as its `from` or `to`.
- No change = nothing rewritten: the table file keeps its old `readAt`, and `index.json` shows
  `unchangedSince` (that readAt). `index.json` itself is rewritten every run (`takenAt`).
- A table file written when the chain version differs from the file's own `epoch` is not rewritten if the rows
  are identical, so `epoch` in a table file is the version it last CHANGED under; `index.json` has the current one.

## Tables (18)

cargo, claim_stake_definitions, claim_stake_buildings, recipes, crafting_habs, hab_buildings,
ship_configurations, combat_configuration (1 row), faction_relations (1 row), territory_regions (its `regions`),
king_systems (its `systems`, keyField `systemId`), factions (ids 1-3, keyField `factionId`), faction_treasuries
(ids 1-3), faction_economics, research_catalog (its `nodes`), scan_patterns, atlas_reward_registry (1 row),
atlas_reward_config (the active config version).

Fields dropped because they are runtime state, not config (listed in each file's `dropped`): recipes
`usageCountRaw` (moved by 1 between two runs 30 s apart); factions `npcFleetCount`, `treasuryCount`;
faction_treasuries balances, `atlasOutThisEpoch*`, `epochStartedAtUnixSeconds`, and `reserves[].quantityRaw`
(the held amount; each reserve's `cargoId` and `floorRaw`, the floor, are config and are kept);
atlas_reward_registry `currentEpoch*`. Add a path to a table's `drop` list in `TABLES` to drop more. A path is a
top-level key (`usageCountRaw`), or `array[].key` / `object.key` for nested ones (`reserves[].quantityRaw` drops that
key from every element of `reserves`); the last segment is the key removed. A malformed path is refused up front
(exit 1). Drops happen before hashing and diffing, so a dropped field never causes a rewrite or a change line.
(On the chain today `reserves` is an empty list for all three factions: no floors are set yet.)

Not covered: `getPlanetClaimStakePlots` (one read per planet), `getScanPatternPolicy` (one read per pattern).

## Failure rules

- Chain version read first (one retry). Unreadable = nothing written, exit 1.
- A table whose read fails (after one retry) keeps its previous file untouched and is marked `ok: false` with the
  error code in `index.json` (`keptPrevious`, and the previous `count`/`sha256`). A table that cannot be read is
  never recorded as empty. Today `faction_economics` fails with `ACCOUNT_NOT_FOUND` and stays `ok: false`.
- An existing table file that cannot be parsed, or has no `rows` array, is never silently overwritten: before the
  replace a copy is kept as `<table>.json.corrupt-<readAt>`, the index entry carries `replacedCorrupt: true`, and no
  change line is written (a corrupt file cannot be diffed). Tried with a real run on a file holding `{bad`.
- An EMPTY read where the previous file had rows is refused (`EMPTY_READ`, file kept) unless
  `--accept-empty <table>` is passed. An empty first read is written.
- Writes are temp file + rename; a write that throws leaves the old file intact and removes the temp file.
- A write that fails for one table (disk full, file open in another program, a path that is a directory) marks THAT
  table `ok: false, error: WRITE_FAILED` with the stage (`history`, `replace` or `log`) and the scrubbed error in
  `message`; the run carries on with the other tables, `index.json` is written at the end and describes what is on
  disk for every table (a failed `history`/`replace` keeps the previous file, its `count` and `sha256`), and the exit
  code is 2. The one case with no index is "every table failed to read, nothing was attempted to write" (exit 1).
- Order per changed table: (1) copy the old file into `history/` (a copy already there with the same bytes is
  reused), (2) atomic replace of the table file, (3) append the change line. The log therefore never runs ahead of
  the files. If the process dies:
  - after (1): a spare history copy; table file and log are the old ones; the next run redoes the table.
  - after (2): the new file is in place and its change line is missing. The next run rebuilds it BEFORE reading the
    chain: a table file whose `readAt` has no change line with that `at` is diffed against the newest history file
    older than it, and the line (same `at`, epochs and diff as the lost one) is appended; the run prints `change
    lines rebuilt` and returns them in `reconciled`. If (3) fails without a crash, the table is `WRITE_FAILED` at
    stage `log` with `logPending: true`, and its index entry describes the NEW file.
  - during (3): a partial last line in `changes.jsonl`. The next append starts on a new line (so it is never joined
    onto the partial one), `readChanges` skips and counts the partial line, and the lost line is rebuilt as above.
  Deleting `changes.jsonl` makes the next run rebuild each table's LAST change only.
- One run at a time per out dir: `.lock` holds a token (`pid:random`), taken with an exclusive create. A lock older
  than 30 min is stale and may be taken over, but only if it still holds the content that was judged stale; after
  writing, the file is re-read and the lock counts only if it holds our token; at the end the lock is removed only
  while it still holds our token (a lock that changed hands is left alone). Residual window: two runs that judge the
  same stale lock within the same few milliseconds can still both unlink; the re-read stops the loser in most
  orders, not in all.

## Size

About 20 MB for the 17 readable tables (ship_configurations 11 MB, recipes 6.4 MB). Decide before committing
whether `Data/c4-live/config/` belongs in git or the served site.
