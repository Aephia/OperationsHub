// ResourceIcons.js - one rendered icon per resource FORM (2026-10-23). 3,526 resources collapse onto 19 shapes,
// chosen from the name: ship modules by family ("Energy Cannon XS T3" -> weapon), everything else by keyword, first
// rule wins. Raw forms are drawn in natural colours; crafted forms carry their category's accent colour.
// Art: Images/icons/<form>.webp (raw) and <form>_<category>.webp, rendered by Tools/icons/render_icons.py.
//   ResourceIcons.form(name, category)          -> 'weapon'
//   ResourceIcons.url(name, category, base)     -> '../Images/icons/weapon_component.webp'
(function () {
    'use strict';

    const BASE = '../Images/icons/';
    const RAW_RULES = [
        ['gas', /\b(gas|hydrogen|oxygen|nitrogen|neon|argon|krypton|methane|fluorine|tenon|xenon|helium)\b/i],
        ['flora', /\b(cactus|agave|algae|biomass|fern|bryophyte|snapdragon|magmaroot|fungus|coral|kelp|lichen|moss|shadowmoss|swiftvine|orchid|symbionts|vine|root)\b/i],
        ['crystal', /\b(crystals?|diamond|pearls|quartz|emerald|ruby|sapphire|garnet|peridot|silica|nanosil)\b/i],
        ['exotic', /\b(energy|quantum|particle|catalyst|flux|plasma|phase|fusion|drywater|energen|substrate|lumanite|arco|rochinol)\b/i],
    ];
    // crafted, in priority order (a "Shield Generator" is plating before it is a core; a "Weapon Targeting Core" is a weapon)
    const RULES = [
        // narrow overrides first: stims are consumables whatever they boost, rigs and tractor / mining beams are tools
        ['vial', /\b(stim|vial|serum)\b/i],
        ['tool', /\b(rig|tractor beam|extraction beam|extraction tools)\b/i],
        ['plating', /\bprotection\b/i],
        ['chip', /\bcharge controller\b/i],
        ['weapon', /^heat$/i],
        ['drone', /\b(drone|crybot|spybot|naga|scrapup|zap|womp|medrone|hulltank|shocktank|pyra|fixif|tink|tote|draw|xpl|gu|d1|r1)\b/i],
        ['weapon', /\b(cannon|beam|burst|rapidfire|scatterfire|missile|mine|explosive|ammo|ammunition|detonat\w*|charges?|payload|weapon|projectiles?|breech|flare|decoy|shockwave|photon|gray goo|superchill|heat beam|emp)\b/i],
        ['plating', /\b(shield\w*|plating|armor|armour|coating|reinforcement|barrier|layer|shell|insulation|protective|faraday|absorber)\b/i],
        ['engine', /\b(engine|drive|thrusters?|propulsion|warp|subwarp|sublight|accelerat\w*|maneuver\w*|launch)\b/i],
        ['vial', /\b(stim\w*|serum|nanobots?|healing|medical|bio\w*|adrenoline|thermogenin|ignisol|aquastim|thalassine|nocturine|phasmine|carapaxin|fortisine|velocitene|ionophore|chronolex|cryostabilin|psyconine|ballistene|booster|enhancer|harmonizer|accelerant|life support|ink|paint)\b/i],
        ['canister', /\b(fuel|gas|mix|canisters?|tank|tritium|hydrocarbon|primer|suppress\w*|coolant|refuel|pressure|pump|circulation)\b/i],
        ['coil', /\b(coils?|conductor|conductive|magnets?|electromagnet|wire|conduit|lines|pipes|connectors?|contacts|cable|coupling|heat sink|dissipator|exchange|grounding|lightning|rod|mesh)\b/i],
        ['sensor', /\b(sensor|scanner|array|detector|detection|targeting|monitor\w*|transmitter|beacon|signal|hologra\w*|projector|optical|diagnostic|navigation|proximity|mimicry)\b/i],
        ['crate', /\b(cargo|container|storage|passenger|hab|kit|tools?|rig|tow|winch|capacity|landing pad|crafting station|loader|cable)\b/i],
        ['frame', /\b(frame\w*|structur\w*|beams|brace|joint|lattice|platform|anchor|plate|foundation|truss|hull|megastruct\w*|architectural|base|ground plate)\b/i],
        ['core', /\b(core|power|reactor|cells?|capacitor|battery|generator|energy|matter|containment|source|exotic|resonator|emitters?|focuser|amplifier)\b/i],
        ['chip', /\b(circuits?|processor|electronics|wafers?|interface|control\w*|matrix|protocol|network|hub|system|module|regulator|limiter|lock|shutoff|synchroni\w*|coordinat\w*|management|integration|buffer|substrate|semiconductor)\b/i],
        ['tool', /\b(mechanism|assembly|actuator|unit|suite|access|extraction|replication|mining|repair|salvage|rescue|tractor|scaling|utility)\b/i],
        ['ingot', /\b(iron|tin|steel|copper|titanium|alloy|ingot|graphene|polymer|aerogel|composite|silver|gold|zinc|platinum|palladium|rhodium|iridium|osmium|rhenium|tungsten|vanadium|hafnium|zirconium|tantalum|scandium|lithium|boron|manganese|neodymium|dysprosium|chromite|aluminum|plastic|material|nanomaterial|compound)\b/i],
    ];
    const SIZE = / (XXXS|XXS|XS|S|M|L|CAP|CMD|CLASS8|TTN)( T[1-5])?$/;
    const CRAFTED_CATS = new Set(['processed', 'component', 'advanced']);
    const cache = new Map();

    function form(name, category) {
        const key = category + '|' + name;
        if (cache.has(key)) return cache.get(key);
        const n = String(name || '').replace(SIZE, '').replace(/ T[1-5]$/, '');
        let f;
        if (category === 'raw') {
            f = (RAW_RULES.find(([, re]) => re.test(n)) || ['ore'])[0];
        } else {
            f = (RULES.find(([, re]) => re.test(n)) || [category === 'processed' ? 'ingot' : 'chip'])[0];
        }
        cache.set(key, f);
        return f;
    }

    function url(name, category, base) {
        const f = form(name, category);
        const b = base || BASE;
        return category === 'raw' ? `${b}${f}.webp` : `${b}${f}_${CRAFTED_CATS.has(category) ? category : 'component'}.webp`;
    }

    window.ResourceIcons = { form, url, RULES, RAW_RULES };
})();
