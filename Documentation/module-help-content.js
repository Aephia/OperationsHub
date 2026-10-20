// Module guides shown by the landing page's "Module Guide" buttons (index.html reads moduleHelpContent[data-module]).
// Rewritten 2026-10-01 to describe the rebuilt modules. Release status (c4_status) is not a thing the hub shows.
const moduleHelpContent = {
    planetExplorer: {
        title: 'Planet Explorer',
        sections: [
            { heading: 'What it is', content: 'Every system and planet in Galia (945 systems, 3,901 bodies) from the SAGE export: deposits with richness, faction, star type, starbase level, King and Core status, region risk zone and raw-tier cap.' },
            { heading: 'Explorer tab', content: `
                <ul>
                    <li><strong>Finder:</strong> type any words to match the SAGE code, the lore name and the faction (<em>004 king</em>, <em>verzan</em>, <em>css oni</em>); the system list is grouped by region</li>
                    <li><strong>Orrery:</strong> each system is drawn from its own orbit, angle and scale data; the star is coloured by type, planets by category, belts are dotted rings</li>
                    <li><strong>System and planet views:</strong> click a planet row or an orrery body for its deposits; richness is shown as the value plus a bar against the richest deposit of the same resource in Galia (tier-1 ores run to 7.0, tiers 2-5 stay under 2.2)</li>
                    <li><strong>Warp links:</strong> chips jump to the connected systems. Belts are marked "ships only" - no central hub, so no claim stake</li>
                </ul>` },
            { heading: 'Analytics tab', content: `
                <p><strong>Resource analytics:</strong> deposits by planet category, by tier and by territory; a sortable, searchable resource atlas (tier, deposits, systems, regions, min / median / best richness) whose rows open the ten richest deposits; resources that are not in every region; the most diverse systems.</p>
                <p><strong>Manufacturing:</strong> which planets hold the raws for the most recipes.</p>
                <p><strong>Territory:</strong> the Galia map in faction colour with the top systems pinned, faction dominance per region.</p>` },
            { heading: 'Tips', content: `
                <ul>
                    <li>Start from a recipe in the ClaimStake Explorer ("Where to stake for a recipe") and come here to read the planet itself</li>
                    <li>The raw-tier cap on a region badge tells you which deposit tiers can exist there</li>
                </ul>` }
        ]
    },

    shipExplorer: {
        title: 'Ship Explorer',
        sections: [
            { heading: 'What it is', content: 'The 67 ships with their configurations and the 40+ stats the SAGE export tracks (cargo, combat, travel, mining, scanning, repair), with hull renders and a comparison table.' },
            { heading: 'Explorer tab', content: `
                <ul>
                    <li><strong>Hull gallery:</strong> one card per ship with its render, size, role, class and four key stats; filter by size, manufacturer and role; a card adds the ship to the comparison</li>
                    <li><strong>Ship view:</strong> drag the turntable to rotate the hull; the spec sheet compares each stat with the best ship of the same size</li>
                    <li><strong>Comparison table:</strong> selected ships side by side; type above the Stat column to find a stat, tick <em>Changed only</em> to see only the stats the chosen configurations change; hover the (i) for what a stat means and its unit</li>
                    <li><strong>Configurations:</strong> switch to compare loadouts and how components move each stat</li>
                </ul>` },
            { heading: 'Analytics tab', content: `
                <p><strong>Fleet overview:</strong> hulls by size and role, leaders by cargo, hit points, mining rate, scan power, subwarp speed and warp distance.</p>
                <p><strong>Configuration costs:</strong> the resources each configuration needs, with the components that take you to their recipes.</p>` },
            { heading: 'Tips', content: `
                <ul>
                    <li>Compare within one size tier first; the bars are scaled to the best ship of that size</li>
                    <li>A component's recipe opens in the Recipe Explorer planner, which gives the raw bill</li>
                </ul>` }
        ]
    },

    recipeExplorer: {
        title: 'Recipe Explorer',
        sections: [
            { heading: 'What it is', content: 'A production planner over the 5,251 recipes: pick what you want to make and how many, and get every raw to gather, every intermediate to craft in build order, how long it takes and the whole chain as one graph.' },
            { heading: 'Planner tab', content: `
                <ul>
                    <li><strong>Finder (left):</strong> search by output or by ingredient; chips for what a recipe makes (ship components, weapons, buildings, components, ingredients and so on), its tier and the starbase level it needs; five sorts. <strong>+</strong> adds a recipe to the plan</li>
                    <li><strong>Plan (right):</strong> each recipe with an editable quantity. Click a recipe to show its chain alone in the graph, click it again for the whole plan. The plan survives a reload</li>
                    <li><strong>The whole chain:</strong> one graph for the plan with total quantities on every link - drag to pan, wheel to zoom, hover a node to trace everything above and below it, click a node to open it</li>
                    <li><strong>Raw bill and craft list:</strong> always the totals for every recipe in the plan. Raws are coloured claim-stake extractor versus fleet mining only; the craft list runs deepest first with crafts (units divided by output per craft, rounded up) and time</li>
                    <li><strong>Headline numbers:</strong> raw kinds and units, intermediates and crafts, the critical path (everything in parallel), the sequential total, the highest starbase level any step needs, and the raws no claim stake can mine</li>
                </ul>` },
            { heading: 'Recipe sheet', content: '<p>Any finder row, graph node or craft-list name opens the recipe: its own chain, ingredients, build time, production steps, starbase level, planet types, the other tiers of the same output, who uses the output, and an add-to-plan button. Links go to the Resources Explorer.</p>' },
            { heading: 'Research to craft it', content: '<p>On the plan, the <b>Research nodes</b> box beside the raw bill lists every node the whole plan needs. Under the supply chain, the recipe sheet lists every research node you need before you can craft the recipe, prerequisites included, with the track level each one asks for and the XP that level takes. Below it: the extra nodes for crafting the whole chain from raws. <b>Council Rank</b> does not gate recipes; it gates what you own and fly (claim stakes, hab tiers, fleets). The only Council Rank node crafting needs is Crafting Habs - Tier 1, the free hab you craft in. Nodes you marked researched on the Command Deck show a tick and leave the totals; click a node to open it there.</p>' },
            { heading: 'Analytics tab', content: `
                <p><strong>What the catalogue makes:</strong> recipes by output type, and each type by tier.</p>
                <p><strong>Build time:</strong> how long one craft takes by output type; the longest crafts and the deepest chains.</p>
                <p><strong>Where things are crafted:</strong> planet type by output type, starbase level required, faction-exclusive recipes.</p>
                <p><strong>Ingredient demand:</strong> every resource ranked by how many recipes list it as a direct ingredient (each recipe once); category chips, 50 per page, search keeps the global rank; click a row for the recipes that use it.</p>
                <p><strong>Gated recipes:</strong> exotic outputs and research-gated recipes.</p>` },
            { heading: 'Tips', content: `
                <ul>
                    <li>Build times are the export's constructionTime read as seconds; ship components carry very large quantities per craft, so a plan of a few ship parts runs to days when crafted one at a time</li>
                    <li>The Hub Explorer hands a whole hab build over here with one button</li>
                </ul>` }
        ]
    },

    claimStakeExplorer: {
        title: 'ClaimStake Explorer',
        sections: [
            { heading: 'What it is', content: 'Everything about claim stakes: the buildings, which tier of stake to buy, where each raw deposit is, which planet can feed a recipe, and a visual Stake Builder.' },
            { heading: 'Explorer tab', content: `
                <ul>
                    <li><strong>Buildings:</strong> search and filter the hubs, extractors, processors, farms and infrastructure by tier, planet type and function; cards show slots, power, crew, storage and cost</li>
                </ul>` },
            { heading: 'Analytics tab', content: `
                <p><strong>Which tier to buy:</strong> per planet type, what one tier-N stake holds once its hubs are up - slots, the hub set, one extractor and one processor at that tier, and the best lean stake as "extractors that fit" with the binding limit (slots, crew or power). Extractor crew grows as n cubed, so tiers 2-3 bind on crew.</p>
                <p><strong>Deposit atlas:</strong> the 93 raws with stakeable-planet count, belt count, best richness, territory, and whether an extractor family exists; a row opens its ten richest planets and a Plan-stake button.</p>
                <p><strong>Where to stake for a recipe:</strong> search any craftable output, expand it to raws, and rank every stakeable planet by coverage, then richness; filter by territory; hand a planet to the Stake Builder.</p>` },
            { heading: 'Stake Builder tab', content: `
                <ul>
                    <li><strong>Pick a planet</strong> (searchable, faction and category chips; belts cannot hold a stake) and the stake you will buy: Standard or Cultivation, tier 1-5. A stake is bought per tier and holds that tier's buildings only</li>
                    <li><strong>Catalogue with the rules:</strong> hubs unlock their family, extractors need their deposit on the planet, processors need every input on the planet (an in-plan input is flagged as a chain), the fuel processor needs a tier-3 stake</li>
                    <li><strong>Pad and gauges:</strong> the isometric pad shows every building and the resource chains; gauges for slots, power and crew</li>
                    <li><strong>Sheet:</strong> bill of materials with build time, net production per tick, build timeline, power budget, slots and crew by kind. Construct facility plays the build; Export PNG saves the pad and the sheets. The plan survives a reload</li>
                </ul>` },
            { heading: 'Tips', content: `
                <ul>
                    <li>Extraction is the bottleneck of every plan: a T1 processor eats 1 per tick, a T1 extractor makes 0.02, so the ledger goes negative the moment a processor is added - that is the data</li>
                    <li>Six raws have no extractor family and some deposits exist only in belts; a fleet mines those</li>
                </ul>` }
        ]
    },

    resourcesExplorer: {
        title: 'Resources Explorer',
        sections: [
            { heading: 'What it is', content: 'All 3,526 resources (93 raw, 757 processed, 1,372 components, 1,304 advanced): where each comes from, what it is made of, who asks for it, and its whole supply chain as a graph.' },
            { heading: 'Explorer tab', content: `
                <ul>
                    <li><strong>Cards:</strong> tier, the source line (a raw: planets, belts, best richness, planet types; crafted: the ingredients), steps from raw, and a demand bar (recipes that list it as a direct ingredient)</li>
                    <li><strong>Filters:</strong> category, tier, comes-from (claim-stake extractor, fleet mining only, crafted); sort by use, reach, name, tier or steps from raw</li>
                </ul>` },
            { heading: 'Resource sheet', content: `
                <ul>
                    <li><strong>Supply chain:</strong> the deduplicated recipe tree down to raws, laid out in levels; drag to pan, wheel to zoom, hover a node to trace its path, click a node to open it (a back button keeps the trail). Below it the raw bill</li>
                    <li><strong>Where it is found</strong> (raws): a galaxy map with the systems that carry the deposit lit by territory and sized by richness; planets, belts, best richness, extractor rate; planet types, regions, the richest bodies</li>
                    <li><strong>How it is made</strong> (crafted): ingredients, build time, production steps, starbase level, planet types</li>
                    <li><strong>Who asks for it:</strong> the largest consumers per craft and the product types</li>
                </ul>` },
            { heading: 'Analytics tab', content: `
                <p><strong>The economy's shape:</strong> category by tier and tier by category.</p>
                <p><strong>Steps from raw:</strong> how deep the chains run and how many ingredients recipes take.</p>
                <p><strong>Demand:</strong> every resource ranked by direct recipe use, 50 per page, search keeps the rank.</p>
                <p><strong>Raw backbone:</strong> the 93 deposits ranked by reach (how many crafted resources need them anywhere in their tree), raw kinds per planet type, and the raws no claim stake can mine.</p>
                <p><strong>Data gaps:</strong> what the export leaves out, so a zero reads as a gap and not as a fact.</p>` },
            { heading: 'Tips', content: `
                <ul>
                    <li>Base value and stack size are not shown: the export gives every resource a value of tier times ten and a stack of 100</li>
                    <li>A raw with an extractor kit but deposits only in belts is still fleet-mined - no stake can sit on a belt</li>
                </ul>` }
        ]
    },

    hubExplorer: {
        title: 'Hub Explorer',
        sections: [
            { heading: 'What it is', content: 'A crafting-hab builder: the 5 hab tiers, 4 crafting stations, 5 cargo storages, 4 landing pads and 3 decorations, with what each gives, what it costs, and what a build adds up to.' },
            { heading: 'Builder tab', content: `
                <ul>
                    <li><strong>Catalogue (left):</strong> every hab asset with its four key numbers, the modules it needs, what it consumes (each tier eats the previous one) and the cumulative cost from nothing; "craft it" opens the asset's recipe in the Recipe Explorer</li>
                    <li><strong>Build (right):</strong> one hab tier, then any number of stations, storages, pads and decorations with quantities. Gauges for slots (used against the hab's slots, red when over), storage, jobs and throughput (jobs times speed); the module bill; install and craft time. The build survives a reload</li>
                    <li><strong>Raw bill for the whole build:</strong> opens the Recipe Explorer planner with every asset's recipe loaded</li>
                </ul>` },
            { heading: 'Ladders tab', content: '<p>Hab tiers (slots, storage, install from nothing, fee and XP, modules, the recipe), crafting stations (speed, jobs, throughput, slots), cargo storage (bonus, storage per slot), landing pads and decorations from their recipes.</p>' },
            { heading: 'Tips', content: `
                <ul>
                    <li>Slots are the export's own figures: a station takes 8 / 64 / 216 / 512 and a storage 1 to 5; landing pads and decorations carry no slot figure and count as 0</li>
                    <li>Install time is the hab export's time; craft time is the recipe's; both read as seconds</li>
                </ul>` }
        ]
    },

    commandDeck: {
        title: 'Command Deck',
        sections: [
            { heading: 'What it is', content: 'The module that joins the others: the research tree, an empire planner over your stakes, fleets, hab and production plan, a ships-versus-stakes calculator, and a Loadouts bench that compares hull configurations on hauling, mining, scanning, combat, fleet points and crafting cost. It reads the same plan the Recipe Explorer holds, the same hab build the Hub Explorer holds, and the same configuration maths the Ship Explorer uses.' },
            { heading: 'Research tab', content: `
                <ul>
                    <li><strong>The tree:</strong> 282 nodes on seven tracks. A node sits one column right of the deepest node it requires; an arrow is a required research tag. The track chips jump to a band</li>
                    <li><strong>Path to:</strong> type a recipe, a stake building, a hull, a stake or hab tier, or a node. The tree lights what you need and the panel prices it: the level each track must reach and the XP that takes, track points, ATLAS and tokens. For a recipe the path covers its whole chain from raws</li>
                    <li><strong>Getting the raws:</strong> a recipe's path also covers its raws. Choose claim stakes, a mining fleet, or already in hand. Stakes add the extractor nodes on the Mining track and the tier-1 stake; a raw outside your own low-risk zone adds zone access. Set your faction with the chips next to the search box</li>
                    <li><strong>Levels on other tracks:</strong> when the path needs a level on a track, that band says so (for example "LEVEL 8 NEEDED"), even if no node on it is needed</li>
                    <li><strong>A node:</strong> click one for what it gives you - the export's own description, every effect in words (fleet cap +7 points, fly hulls up to Medium, crafting time -5 %, +5 % yield per level on 31 named asteroid resources), what it needs, how many recipes and stake buildings name it as a gate, and the nodes it leads to. A node the export describes but gives no effect says so</li>
                    <li><strong>My research:</strong> mark nodes researched (kept in this browser). Every bill then counts only what is left, and Next nodes ranks what you can research now</li>
                </ul>` },
            { heading: 'Empire tab', content: `
                <ul>
                    <li><strong>Production plan:</strong> the Recipe Explorer's plan. Add, remove or resize recipes on either page</li>
                    <li><strong>Claim stakes:</strong> pick a tier and a planet; the planner ranks planets by how many still-missing raws they carry. A stake fills itself with every extractor that fits; move extractors between raws with the steppers and switch first-stage processors on</li>
                    <li><strong>Mining fleets:</strong> a hull, a count, one raw and the body it mines. Fleets are the only source for raws no stake can extract</li>
                    <li><strong>Who supplies what:</strong> sources on the left, one row per line of the bill with the time to gather it, the plan's recipes on the right. Hover anything to trace it</li>
                    <li><strong>Hab schedule:</strong> the plan's crafts on your hab's real jobs (the Hub Explorer's saved build: the hab's job, each station's jobs at its speed, each storage's job bonus). One lane per job, a block per run of one craft, the critical path in gold, the busy share of each job. Below it: the path as a chain, a sentence saying whether the queue (crafts waiting for a free job) or the chain (crafts waiting for an input) sets the time, the busiest and idlest job, and the queue in start order. The tile shows the scheduled time with the lower bound beside it. Raws are taken as in hand; with no hab build saved, one job at 1x stands in</li>
                    <li><strong>Research this needs:</strong> the nodes behind your stake tiers, buildings, hull sizes and recipes, with a button that lights them on the tree</li>
                </ul>` },
            { heading: 'Ships vs Stakes tab', content: `
                <ul>
                    <li>A hull's mining rate is per second and a stake's is per tick, so the answer depends on how long a tick lasts. The charts show output against tick length and the tick at which a stake and a hull are equal</li>
                    <li>Type the asks you see on the market for output per dollar and for the price a stake would need to match a hull</li>
                    <li><strong>Measure your tick:</strong> one extractor, storage read twice an hour apart; the button stores the result for the whole module</li>
                </ul>` },
            { heading: 'Loadouts tab', content: `
                <ul>
                    <li><strong>Loadouts:</strong> two to four cards, each a hull and one of its configurations (Tier One to Five, Cargo Boost, Fast Freight, Mining, damage kits and so on). The fitted components change the stats - the Ship Explorer's numbers. The same cards feed all five views below</li>
                    <li><strong>Haul:</strong> cargo delivered an hour and fuel per unit against route length. A line steps down wherever that loadout needs one more jump, so a bigger hold with a shorter warp range can lose inside a band of distances and win outside it; every crossover is listed with its reason</li>
                    <li><strong>Mine:</strong> fill the hold at mining rate times richness, haul it to the drop-off, repeat: ore delivered an hour, share of time spent mining, food and fuel per unit, ore per crew-hour</li>
                    <li><strong>Scan:</strong> one scan per cooldown: SDU an hour, tokens an hour, SDU per token and per crew-hour; scan power is shown as the export describes it, a result multiplier</li>
                    <li><strong>Fight:</strong> every pair fought with the game's own combat formula, 50 to 500 bouts with the first strike alternating: win share, draws, mean rounds. Re-roll to see the noise. <em>Show the formula</em> prints the formula as exported (it is JavaScript, run here unchanged); <em>Download</em> saves it</li>
                    <li><strong>Fleet:</strong> hulls with counts against the Fleet Size cap of a Council Rank tier (points per class 1, 4, 9 ... 81): points used, totals, what still fits. A row can be sent to the cards, and <em>Research this fleet needs</em> lights the hull sizes and the Fleet Size tier on the Research tab</li>
                    <li><strong>Cost:</strong> each configuration's components as recipes and raws, side by side, with a button that adds the recipes to your production plan</li>
                    <li><strong>Route length</strong> (Haul, Mine, Fleet): neighbouring systems are about 1.1 apart, Foy to Eternity 10.2</li>
                </ul>` },
            { heading: 'Tips', content: `
                <ul>
                    <li>The tick length is in no export field. Until you set or measure it the module says "assumed" beside the number</li>
                    <li>The export has no prices; the price boxes start with asks quoted on 2026-10-04 and keep what you type</li>
                    <li>How track XP and points are earned, the hardness of a deposit, and crew, food and fuel prices are not in the data</li>
                </ul>` }
        ]
    }
};

// classic script: a top-level const is not a window property, so expose it explicitly for any reader that checks window
window.moduleHelpContent = moduleHelpContent;
