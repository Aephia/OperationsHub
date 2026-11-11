# Star Atlas Crew data: how to get it

**Status, 2026-11-10: the per-owner route is built** as the Crew Explorer (`CrewExplorer/`, see the README): a visitor enters a wallet or SAGE player profile and their own crew is read live, see "Ownership and progress". **No full crawl exists**: the sections on collecting every card are still research, and they only matter for comparing a roster against all crew.

Each fact below is marked **measured** (seen in a real response) or **estimate** (worked out, not run). The feed is undocumented, so re-check the measured facts before relying on them.

## The source

`GET https://galaxy.staratlas.com/crew` needs no key. **Measured:**

- It sends CORS headers for the calling origin, so a visitor's browser can call it directly.
- The rate-limit header says 1,000 requests per window. The window looked like about a minute or less; its exact length was not measured.
- About 1.47 million cards exist. Card numbers (`mintOffset`) are present up to 1,470,551 and absent from 1,470,701, and 40 of 40 evenly spaced numbers below that were present. This is a sampled range, not a count.

Guides quote about 6.2 million mintable cards, and CoinGecko has shown about 1.42 million minted. The feed appears to hold cards that exist so far, not the full mintable supply.

### Fields on each card

| Group | Fields |
|---|---|
| Identity | `mintOffset`, `name`, `dasID` (compressed NFT asset id) |
| Background | `faction`, `species`, `sex`, `university`, `age` |
| Rarity | `rarity`: Common, Uncommon, Rare, Epic, Legendary, Anomaly |
| Skills | `aptitudes`, for example `{ "Flight": "major" }` |
| Personality | `openness`, `conscientiousness`, `extraversion`, `agreeableness`, `neuroticism`, each with 2 decimals |
| Art | `appearance` (layer ids), `imageUrl` |
| Bookkeeping | `createdAt`, `updatedAt`, `isPostReroll` |

The portrait URL is `https://cdn.staratlas.com/crew/v1/<mintOffset>_full.jpeg`, so it never needs storing (it matched on all 100 cards sampled). The one portrait checked was about 218 KB and allows cross-origin use.

### What aptitudes mean

Source: the official "Crew Aptitude Perks" sheet (`crew/docs/crewpacks/CrewPacks_-_Aptitudes_EXPORT.png` in `ttdonovan/staratlas-rs`, branch `sa-crew`). The sheet says its specifications are development scope, so treat the perks as planned, not live.

- A card has one to three aptitudes, each with a gain rate: **minor +25 % XP, major +50 % XP, anomaly +100 % XP**. The feed spells the last one `anomalous`.
- Any crew can level any aptitude; the rolled aptitudes only speed up XP. Levels and perks stack within a ship.
- Each aptitude unlocks a perk at levels 1, 5, 10 and 15:

| Aptitude | Level 1 | Level 5 | Level 10 | Level 15 |
|---|---|---|---|---|
| Command | Social Cohesion | Resource Management | Leadership | Luck |
| Flight | Navigation | Dexterity | Evasion | Stealth |
| Engineering | Repair | Structural Integrity | Construction | Resource Efficiency |
| Medical | Rest | Healing | Vitality | Pharmacology |
| Science | Intelligence | Discovery | Data Analysis | Experimentation |
| Operator | Proficiency | Precision | Reflex | Performance Tuning |
| Hospitality | Charisma | Provisioning | Entertainment | Artisan |
| Fitness | Agility | Recovery | Endurance | Strength |

### What the feed does not have

Current owner, XP, skill levels, and whether a card is deposited in SAGE. See "Ownership and progress".

## How querying behaves (measured)

- A response holds **at most 100 cards**, in a stable order.
- **There is no paging.** `limit`, `page`, `skip` and `offset` are treated as field names and return an empty list.
- Query parameters are **exact-match filters and can be combined**: `mintOffset=5`, `rarity=Legendary`, `species=Tufa`, `openness=0.84&conscientiousness=0.29`.
- Name search is exact, and names repeat: `Clowio .tchr` returned 13 cards.
- A nested filter such as `aptitudes.Flight=major` returns HTTP 400, so the feed cannot search by aptitude.
- `/crew/<anything>` returned HTTP 500 for the paths tried on 2026-11-09. The two named routes below do work.

## More routes (found 2026-11-10 in `ttdonovan/staratlas-rs`, branch `sa-crew`)

- `GET /crew/inventory/<wallet>`: every card a wallet holds. See "Ownership and progress".
- `GET /crew/mintoffset/<n>`: the NFT metadata form of one card (name, image, `attributes` list). **Measured.**
- `GET /crew?dasID=<id>`: one card by its asset id. **Measured.**
- `https://cdn.staratlas.com/crew.json`: one file with every card. **Measured by header only, not downloaded:** 998 MB, last modified 2024-10-18, open to any origin. That repo's notes record 693,512 cards in an earlier 396 MB copy, packed to a 28 MB parquet file. Whether today's file holds all of the feed's cards (about 1.47M) is not known.
- Crew collection address: `CREWSAACJTKHKhZi96pLRJXsxiGbdZaQHdFW9r7qGJkB`. On-chain card names are `CREW #<mintOffset>`.

## Three ways to collect every card

| | A. Card by card | B. Filter slicing | C. Indexer (DAS) |
|---|---|---|---|
| Method | Request each `mintOffset` | Request narrow filter combinations, up to 100 cards each | `getAssetsByGroup` on the collection |
| Requests | About 1.47M | About 50–60k (**estimate**) | About 1,500 pages if 1,000 per page (**estimate**) |
| Time at 5 per second | About 3.4 days | About 3 hours (**estimate**) | Minutes |
| Needs | Nothing | Nothing | RPC key and the collection address (not found yet) |
| Gives owners | No | No | Probably yes |
| Gives personality and aptitudes | Yes | Yes | Unknown: depends on what the metadata carries |
| Status | Works (single lookups measured) | Filters measured, full run untested | Untested |

### Filter slicing in detail (the current best candidate)

The rule: **a result under 100 cards is a complete slice. A result of exactly 100 may be cut off, so split it further.**

1. Start with `rarity` × `openness` × `conscientiousness`, about 51,000 cells (5 rarities × 101 × 101). Handle `Anomaly` separately: it is tiny.
2. Split any cell that returns exactly 100 by `species`, then `faction`, then `extraversion`.
3. Save every card keyed by `mintOffset`, and record finished cells so the run can resume.
4. Go coarse first for rare tiers. Legendary probably needs only `rarity` × `openness`, about 101 calls.

Pilot on 2026-11-09 (40 randomly chosen cells, 8 per rarity), cards per cell:

| Rarity | Results | Mean |
|---|---|---|
| Common | 99, 89, 60, 83, 84, 100, 78, 88 | 85.1 |
| Uncommon | 27, 10, 22, 19, 25, 24, 11, 26 | 20.5 |
| Rare | 33, 31, 34, 26, 25, 29, 23, 30 | 28.9 |
| Epic | 1, 7, 7, 0, 9, 1, 1, 3 | 3.6 |
| Legendary | 0, 0, 1, 0, 0, 1, 0, 1 | 0.4 |

Those means add up to 138.5 cards per trait pair. Across 10,201 pairs that is about 1.41 million cards, which roughly agrees with the 1.47M range. Only 1 of 40 cells hit the cap, but traits are probably not evenly spread, so 40 cells is a small sample.

Controls: card 1713 was found by its own trait values at every filter depth, every returned card matched its filter, and an impossible value (`openness=7.77`) returned nothing.

### Proving the list is complete

Filter slicing can miss cards silently, for example a card with a blank trait that matches no slice. So:

1. Compare the collected card numbers against the full range.
2. Fetch every missing number directly by `mintOffset`.
3. Find the true upper end by checking numbers past the highest card found.
4. Spot-check a random sample of cards against a fresh single lookup.

If the gap list is large, slicing has a flaw: stop and find out why before filling it.

## Serving it on the site

Raw JSON would be about 1 GB (**estimate**: about 700 bytes per card), so the browser should never load it.

| Option | Idea | Trade-off |
|---|---|---|
| 1. Live only | Query the feed from the browser | No storage. No aptitude filter, 100-card results, no global stats, and it depends on the feed staying up |
| 2. Stats plus small lookups | Keep the crawl out of the repo. Publish precomputed stats and small lists the feed cannot answer (aptitude to card numbers). Fetch each card live | Small downloads and full filtering, but card details still need the feed |
| 3. Full packed index | Fixed-width binary columns, split into files by rarity or range | Works without the feed. About 20–25 MB (**estimate**) plus a name dictionary |

Size notes for option 3:

- About 14 bytes per card: 5 traits, age, packed categories, aptitudes, name reference.
- **Leave out `dasID`.** It is 32 random bytes per card, about 47 MB in total, and compresses poorly. Fetch it when a card is opened.
- Leave out `imageUrl`, which can be built from the card number.
- Check the current Cloudflare Pages file-size limit before choosing shard sizes.
- The site must not fetch data from GitHub, so anything published ships with the site.

**Portrait weight:** at about 218 KB each, a grid of 100 is roughly 20 MB. Lazy-load them, and check whether the CDN has a smaller size. Only `_full` is known so far.

## Ownership and progress

- **"Show my crew" needs no key.** `GET https://galaxy.staratlas.com/crew/inventory/<wallet>` returns `{ total, crew: [...] }` with the full card for every crew in that wallet. **Measured 2026-11-10** on one 9-card wallet: one call, about 9 KB, same 1,000-per-window rate limit. `?page=N` is accepted and a page past the end returns an empty list.
- **A page holds 100 cards, and `total` is the count on that page, not the grand total** (**measured**). Count a crew by walking pages until one is empty.
- **Crew deposited into SAGE is not in the wallet.** It is held by the profile's `SagePlayerProfile` account on mainnet SAGE (`SAGE2HAwep459SNq61LHvjxPk4pLPEJLoMETef7f7EE`): a 74-byte account with the player profile key at byte 9 and the game id (`GAMEzqJehF8yAnKiTARUuhZMvLvkZVAsCVri5vSfemLr`) at byte 41. Its address is a program-derived address with seeds `"sage_player_profile"`, the profile key, the game id (**measured**: the derived address equals the real account for one profile), so a page can compute it with no network call and pass it to `/crew/inventory/`. The player profile key itself returns nothing.
- **A wallet's profiles cannot be looked up from a browser without a key.** The lookup is `getProgramAccounts` on the player-profile program (`pprofELXjL5Kck7Jn5hCpwAL82DpTkSYBENzahVtbc9`, wallet at byte 30). It works from a shell against the public mainnet RPC, but from a web page five public RPCs all refused it on 2026-11-10 (mainnet-beta 403, PublicNode "requires a personal token", dRPC, Ankr and OnFinality the same or rate-limited). So the Crew Explorer asks for the profile address directly.
- **Speed (measured, one profile):** about 2,600 cards took 28 calls, 2.6 MB and 18 seconds, pausing 0.1 s between calls. At that pace 5 minutes is roughly 40,000 cards (**estimate**).
- **Not measured:** crew assigned to fleets or starbases, if that moves it to yet another account.
- **A full owner list** needs an indexer, and goes stale as cards trade.
- **XP and levels** are likely in the Crew program, `CREWiq8qbxvo4SKkAFpVnc6t7CRQC4tAAscsNAENXgrJ`. Untested.
- Any RPC key stays in an environment variable or behind a server, never in this public repo or in browser code.

## Visuals (planned)

Render rarity frames, faction crests and a crew bay backdrop in Blender, using the same process as `Tools/planets` and `Tools/icons`. Official portraits go inside the frames.

## Still to decide

1. **Collection:** run filter slicing, or get an RPC key and test the indexer first? If indexer metadata includes traits and aptitudes, it wins outright.
2. **Serving:** option 1, 2 or 3. Option 2 looks like the best balance.
3. **Politeness:** whether to ask Star Atlas first. No terms covering bulk reads of this feed were found.
4. **Scope:** whether ownership and XP are needed in the first version.

Before any full run, do a small slicing pilot on one rarity to replace the estimates above with real call counts.
