// stake-visual.js - ClaimStake Explorer visual layer (2026-09-30): the Blender-rendered building tiles
// (Images/stake/, packed by Tools/landing/pack_stake_tiles.py), building "kind" classification shared by the
// Explorer tab and the Stake Builder, and the Explorer tab's card upgrade. Loaded before construction.js.
(function () {
    'use strict';

    const TILE_BASE = '../Images/stake/';
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // addedTags -> tile kind (first match wins; hubs before the generic 'extractor'/'processor' tags)
    const KIND_BY_TAG = [
        ['central-hub', 'central_hub'], ['cultivation-hub', 'cultivation_hub'], ['extraction-hub', 'extraction_hub'],
        ['processing-hub', 'processing_hub'], ['storage-hub', 'storage_hub'], ['farm-hub', 'farm_hub'],
        ['power-generation', 'power_plant'], ['crew-housing', 'crew_quarters'], ['storage-module', 'storage_module'],
        ['farm', 'farm'], ['extractor', 'extractor'], ['processor', 'processor']
    ];
    const KIND_LABEL = {
        central_hub: 'Central Hub', cultivation_hub: 'Cultivation Hub', extraction_hub: 'Extraction Hub',
        processing_hub: 'Processing Hub', storage_hub: 'Storage Hub', farm_hub: 'Farm Hub', power_plant: 'Power Plant',
        crew_quarters: 'Crew Quarters', storage_module: 'Storage Module', farm: 'Farm', extractor: 'Extractor', processor: 'Processor'
    };
    const KIND_GROUP = {
        central_hub: 'hubs', cultivation_hub: 'hubs', extraction_hub: 'hubs', processing_hub: 'hubs', storage_hub: 'hubs', farm_hub: 'hubs',
        power_plant: 'support', crew_quarters: 'support', storage_module: 'support',
        extractor: 'extractors', processor: 'processors', farm: 'farms'
    };

    function kindOf(b) {
        if (b._kind) return b._kind;
        const tags = b.addedTags || [];
        for (const [tag, kind] of KIND_BY_TAG) { if (tags.includes(tag)) return (b._kind = kind); }
        return (b._kind = (b.power > 0 ? 'power_plant' : 'processor'));
    }

    const StakeTiles = {
        manifest: null,
        ready: fetch(TILE_BASE + 'manifest.json').then(r => (r.ok ? r.json() : null)).catch(() => null)
            .then(m => { StakeTiles.manifest = m; return m; }),
        url(kind) { const t = StakeTiles.manifest && StakeTiles.manifest.tiles[kind]; return t ? TILE_BASE + t.file : TILE_BASE + kind + '.webp'; },
        size(kind) { const t = StakeTiles.manifest && StakeTiles.manifest.tiles[kind]; return t ? t.size : [320, 385]; },
        unit() { return StakeTiles.manifest ? StakeTiles.manifest.unit : 150.147; },
        anchor() { return StakeTiles.manifest ? StakeTiles.manifest.anchor : [160, 302.59]; },
        squash() { return StakeTiles.manifest ? StakeTiles.manifest.squash : 0.5299; },
        kindOf, KIND_LABEL, KIND_GROUP,
        thumbHTML(kind, cls) { return `<span class="${cls || 'tile-thumb'} k-${kind}"><img src="${StakeTiles.url(kind)}" alt="" loading="lazy" decoding="async"></span>`; }
    };
    window.StakeTiles = StakeTiles;

    // ---- Explorer tab: cards with the tile, kind, tier chip and the numbers that matter
    if (typeof BuildingExplorer !== 'undefined') {
        BuildingExplorer.prototype.createBuildingCard = function (b) {
            const card = document.createElement('div');
            const kind = kindOf(b);
            card.className = 'building-card bc-visual';
            const ext = Object.entries(b.resourceExtractionRate || {});
            const rate = Object.entries(b.resourceRate || {});
            const ins = rate.filter(([, v]) => v < 0), outs = rate.filter(([, v]) => v > 0);
            const name = k => (window.StakeData && window.StakeData.resName ? window.StakeData.resName(k) : k);
            let line = '';
            if (kind === 'extractor' || kind === 'farm') line = ext.slice(0, 1).map(([k, v]) => `+${v} ${esc(name(k))}/tick`).join('');
            else if (kind === 'processor') line = `${ins.map(([k, v]) => `${-v} ${esc(name(k))}`).join(' + ')} &rarr; ${outs.map(([k, v]) => `${v} ${esc(name(k))}`).join(', ')}`;
            else if (b.storage) line = `${b.storage.toLocaleString()} storage`;
            else if (ext.length) line = `${ext.length} passive deposits`;
            card.innerHTML = `
                ${StakeTiles.thumbHTML(kind)}
                <div class="bc-body">
                    <div class="bc-head"><span class="bc-name">${esc(b.name)}</span><span class="t t${b.tier}">T${b.tier}</span></div>
                    <div class="bc-kind">${esc(KIND_LABEL[kind])}${b.comesWithStake ? ' &middot; comes with the stake' : ''}</div>
                    <div class="bc-stats">
                        <span title="Slots">&#x25A3; ${b.slots || 0}</span>
                        <span class="${b.power < 0 ? 'neg' : 'pos'}" title="Power">&#x26A1; ${b.power > 0 ? '+' : ''}${b.power || 0}</span>
                        <span title="Crew needed / housed">&#x1F465; ${b.neededCrew || 0}${b.crewSlots ? ' / ' + b.crewSlots : ''}</span>
                    </div>
                    ${line ? `<div class="bc-line">${line}</div>` : ''}
                </div>`;
            card.addEventListener('click', () => { if (window.spaceSounds) window.spaceSounds.click(); this.showBuildingDetails(b); });
            return card;
        };
    }
})();
