# Ship configuration teardown - prototype for the Ship Explorer (NOT wired in, NOT committed)

Saved 2026-11-01 on the owner's request ("we will use this for operationhub ship explorer later"). It began as the
approved look-and-feel mockup for Broadside Battle Arena's in-game Configuration Bay, built with the `teardown` skill.

- `configbay-teardown.html` - self-contained offline page (three.js + fonts + the Calico Guardian model inlined, ~3.4 MB).
  Open it in a browser: sliced teardown of the hull, SOLID / X-RAY / TEARDOWN views, 3/4 / SIDE / TOP cameras, loadout
  list (Default, Tier I-V, 7 damage kits x Min/Mid/Max, Repair), systems readout, callouts, idle auto-tour.
- `source/` - the code that builds it (`main.js`, `style.css`), the glTF -> GLB packer, and `guardian.json` (the
  Guardian's 30 config multipliers + cost %, derived from the public SAGE ship data via the Arena's
  `Data/configs/ship_configs.json`). Canonical copy lives in the Arena repo at `tools/configbay-proto/`.
- `SHA256SUMS` - hashes of the files as saved.

**To turn it into a Ship Explorer feature later:** feed it each ship's real config data from this repo's ship data
(the Arena compresses multipliers and prices against its own fleet-point system - the explorer should show the raw
SAGE values instead), load the hull model per ship (official web models: the Arena keeps them under
`RawAssets/WebGL/<Manufacturer>/<Ship>/`), and drop the Arena-specific bits (fleet points budget, "NO FIT", INSTALL).
Rebuild: `node ~/.claude/skills/teardown/sims/build.mjs <folder with main.js>` (see `source/README.md`).

This repo is PUBLIC (github.com/Aephia/OperationsHub): the Guardian model inside the HTML is an official Star Atlas web
asset - check licensing before committing or publishing it.
