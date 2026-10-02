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
            { heading: 'Recipe sheet', content: '<p>Any finder row, graph node or craft-list name opens the recipe: its own chain, ingredients, build time, production steps, starbase level, planet types, research nodes, the other tiers of the same output, who uses the output, and an add-to-plan button. Links go to the Resources Explorer.</p>' },
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
    }
};

// classic script: a top-level const is not a window property, so expose it explicitly for any reader that checks window
window.moduleHelpContent = moduleHelpContent;
