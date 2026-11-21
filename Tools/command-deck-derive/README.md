# command-deck-derive

Independent re-derivations of the pinned values in `Test/command-deck-check.js` and `Test/command-deck-loadout-check.js`.
They read only `JSON/*.json` (the raw export); none loads hub code. Each prints `KEY=value` lines. A pin in either check
file marked `[derive KEY]` (or `[derive2 KEY]`) is the value this folder prints under that key.

Run from the repo root (any directory works; paths are relative to this folder):

    node Tools/command-deck-derive/derive.js  < /dev/null
    node Tools/command-deck-derive/derive2.js < /dev/null
    node Tools/command-deck-derive/derive3.js < /dev/null

| Script | Derives | Cited by |
|---|---|---|
| `derive.js` | Research pins: gate map (RECIPES_GATED, GATED_BUILDINGS), craftable counts, orphan tags, Fleet Size ladder and caps, zone grants (MEDIUM_GRANTS, ENEMY_GRANTS), research bills (S_BILL, PRM_USTUR_STAKES_BILL, A5_EXTRACTOR_T3 ...), recipe chains (CHAIN_*), raws by zone | `command-deck-check.js` sections 4, 8, 10, 11, 13 |
| `derive2.js` | KDM_RAW_UNITS / KDM_RAW_KINDS (Pearce X4 Kinetic Damage Max expanded to raw units; fit list embedded, or pass JSON as argv[2]); HUB_PASSIVE (T1 central hub copper-ore rate per planet type) | `command-deck-loadout-check.js` (B2 raw units, measure-tick) |
| `derive3.js` | Armstrong IMP Tap drone multipliers per stat, with every drone unit counted and with one unit per port | background for the rule-free drone checks (the per-unit drone rule is unconfirmed, so the every-unit values are NOT pinned) |

After a data refresh, re-run these first and re-pin from their output; do not edit a pin until the script says so.
