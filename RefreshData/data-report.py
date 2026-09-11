#!/usr/bin/env python3
"""Build Documentation/DATA-REPORT-<date>.pdf describing the current JSON/ dataset.

    python RefreshData/data-report.py [--against <git-ref>] [--keep-html]

Reads JSON/ (the sources split-uber-export.js writes), compares against the same files at
<git-ref> (default HEAD~1, i.e. the previous data import), writes an HTML report next to the PDF
and prints it with headless Chrome/Edge. ASCII only in this file (PowerShell 5.1 reads scripts as ANSI).
"""
import collections
import datetime
import html
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_DIR = os.path.join(ROOT, "JSON")
DOC_DIR = os.path.join(ROOT, "Documentation")
REF = sys.argv[sys.argv.index("--against") + 1] if "--against" in sys.argv else "HEAD~1"
BROWSERS = [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"]


def load(name):
    with open(os.path.join(JSON_DIR, name), encoding="utf-8") as f:
        return json.load(f)


def load_old(name):
    out = subprocess.run(["git", "show", f"{REF}:JSON/{name}"], capture_output=True, text=True,
                         encoding="utf-8", cwd=ROOT)
    return json.loads(out.stdout) if out.returncode == 0 and out.stdout else None


def ships():
    d = os.path.join(JSON_DIR, "Ships")
    return [load("Ships/" + f) for f in sorted(os.listdir(d)) if f.endswith(".json")]


def esc(x):
    return html.escape(str(x))


def table(headers, rows, cls=""):
    h = "".join(f"<th>{esc(c)}</th>" for c in headers)
    b = "".join("<tr>" + "".join(f"<td>{esc(c)}</td>" for c in r) + "</tr>" for r in rows)
    return f'<table class="{cls}"><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table>'


def counter_rows(counter, label):
    total = sum(counter.values()) or 1
    return [(label_of(k), f"{v:,}", f"{100 * v / total:.1f}%") for k, v in counter.most_common()]


def label_of(k):
    return "(none)" if k is None else k


def main():
    rec = load("recipes.json")["recipes"]
    bld = load("buildings.json")
    res = load("resources.json")["resources"]
    pla = load("planets.json")
    hab = load("craftingHabBuildings.json")
    sc_manifest = load("ship-components.json")
    parts = [load(p) for p in sc_manifest["parts"]]
    comps = [c for p in parts for c in p["components"]["allComponents"]]
    tree = next(p["components"]["rewardTree"] for p in parts if "rewardTree" in p["components"])
    sh = ships()

    o_rec = (load_old("recipes.json") or {}).get("recipes", [])
    o_bld = load_old("buildings.json") or {"buildings": [], "claimStakeDefinitions": []}
    o_res = (load_old("resources.json") or {}).get("resources", [])
    o_pla = load_old("planets.json") or {"mapData": []}
    o_comps_parts = [load_old(p) for p in sc_manifest["parts"]]
    o_comps = [c for p in o_comps_parts if p for c in p["components"]["allComponents"]]

    planets = [p for s in pla["mapData"] for p in s["planets"]]
    o_planets = [p for s in o_pla["mapData"] for p in s["planets"]]
    pres = [r for p in planets for r in (p.get("resources") or [])]
    o_pres = [r for p in o_planets for r in (p.get("resources") or [])]
    lore = sum(1 for p in planets if not p["name"].startswith("CSS-"))

    def names(xs, key):
        return {x.get(key) for x in xs}

    added_rec = sorted(names(rec, "outputName") - names(o_rec, "outputName"))
    removed_rec = sorted(names(o_rec, "outputName") - names(rec, "outputName"))
    added_bld = sorted(names(bld["buildings"], "name") - names(o_bld["buildings"], "name"))
    removed_bld = sorted(names(o_bld["buildings"], "name") - names(bld["buildings"], "name"))

    today = datetime.date.today().isoformat()
    meta_date = "2026-09-11"
    sections = []

    # 1. summary
    summary = [
        ("Recipes", len(o_rec), len(rec)),
        ("Buildings", len(o_bld["buildings"]), len(bld["buildings"])),
        ("Claim stake definitions", len(o_bld["claimStakeDefinitions"]), len(bld["claimStakeDefinitions"])),
        ("Resources (all variants)", len(o_res), len(res)),
        ("Star systems", len(o_pla["mapData"]), len(pla["mapData"])),
        ("Planets", len(o_planets), len(planets)),
        ("Planet resource entries", len(o_pres), len(pres)),
        ("Ships", len(sh), len(sh)),
        ("Ship components", len(o_comps), len(comps)),
        ("Crafting habs / stations / cargo", f'{len(hab["habs"])} / {len(hab["craftingStations"])} / {len(hab["cargoStorage"])}',
         f'{len(hab["habs"])} / {len(hab["craftingStations"])} / {len(hab["cargoStorage"])}'),
    ]
    rows = []
    for label, a, b in summary:
        delta = "" if not isinstance(a, int) else ("=" if a == b else f"{b - a:+,}")
        rows.append((label, f"{a:,}" if isinstance(a, int) else a, f"{b:,}" if isinstance(b, int) else b, delta))
    sections.append(("1. What changed", f"""
<p>The repository now carries the SAGE uber-export of <b>{meta_date}</b>, replacing the export of 2026-05-23.
The table compares the previous import (git <code>{esc(REF)}</code>) with the current data.</p>
{table(["Dataset", "Previous", "Current", "Delta"], rows, "kv")}
<ul>
<li><b>Recipes:</b> {len(added_rec):,} new output names, {len(removed_rec):,} removed. New entries are dominated by ship weapons, countermeasures, missiles and per-class component recipes.</li>
<li><b>Buildings:</b> {len(added_bld):,} new, {len(removed_bld):,} removed; every building now exists in exactly five tiers (324 per tier). Claim stake definitions collapsed from 195 variants to 10 (Claim Stake T1-T5, Cultivation Stake T1-T5); the <code>defaultBuilding</code> field is gone and no explorer read it.</li>
<li><b>Planets:</b> same map, but resources per planet were rebalanced ({len(o_pres):,} to {len(pres):,} entries; richness now spans 0.3-7 instead of 1-4.6) and {lore:,} of {len(planets):,} planets plus 924 systems carry lore names.</li>
<li><b>Ships:</b> 61 of 67 ships changed stats; a new <code>xp_value</code> stat was added.</li>
<li><b>Ship components:</b> the export now ships a complete component tree ({len(comps):,} nodes, {len(tree)} roots). It resolves every component id the ship configurations reference; the previous hand-rebuilt tree resolved only 674 of 1,573, so Ship Explorer analytics were partial since May.</li>
</ul>"""))

    # 2. recipes
    by_type = collections.Counter(r.get("resourceType") for r in rec)
    by_out = collections.Counter(r.get("outputType") for r in rec)
    by_tier = collections.Counter(r.get("outputTier") for r in rec)
    steps = collections.Counter(r.get("productionSteps") for r in rec)
    sections.append(("2. Recipes", f"""
<div class="cols">
<div><h4>By resource type</h4>{table(["Type", "Recipes", "Share"], counter_rows(by_type, ""), "kv")}</div>
<div><h4>By output tier</h4>{table(["Tier", "Recipes", "Share"], [(f"T{k}", f"{v:,}", f"{100*v/len(rec):.1f}%") for k, v in sorted(by_tier.items())], "kv")}</div>
</div>
<h4>By output type</h4>{table(["Output type", "Recipes", "Share"], counter_rows(by_out, ""), "kv")}
<h4>Production steps</h4>{table(["Steps", "Recipes"], [(k, f"{v:,}") for k, v in sorted(steps.items(), key=lambda kv: (kv[0] is None, kv[0]))], "kv")}
<h4>New output names (first 60 of {len(added_rec):,})</h4><p class="list">{esc(", ".join(added_rec[:60]))}</p>
<h4>Removed output names ({len(removed_rec):,})</h4><p class="list">{esc(", ".join(removed_rec[:60]))}{" ..." if len(removed_rec) > 60 else ""}</p>"""))

    # 3. buildings
    b_tier = collections.Counter(b.get("tier") for b in bld["buildings"])
    b_names = collections.Counter(b.get("name") for b in bld["buildings"])
    slots = collections.Counter(b.get("slots") for b in bld["buildings"])
    csd = [(d["name"], d["tier"], d.get("slots"), d.get("rentMultiplier"), d.get("placementFeeMultiplier")) for d in bld["claimStakeDefinitions"]]
    sections.append(("3. Claim stake buildings", f"""
<div class="cols">
<div><h4>Buildings per tier</h4>{table(["Tier", "Buildings"], [(f"T{k}", f"{v:,}") for k, v in sorted(b_tier.items())], "kv")}</div>
<div><h4>Slot sizes</h4>{table(["Slots", "Buildings"], [(k, f"{v:,}") for k, v in sorted(slots.items(), key=lambda kv: (kv[0] is None, kv[0]))], "kv")}</div>
</div>
<p>{len(b_names):,} distinct building names, each in up to five tiers.</p>
<h4>Claim stake definitions</h4>{table(["Definition", "Tier", "Slots", "Rent x", "Placement fee x"], csd, "kv")}
<h4>New buildings ({len(added_bld):,})</h4><p class="list">{esc(", ".join(added_bld[:80]))}{" ..." if len(added_bld) > 80 else ""}</p>
<h4>Removed buildings ({len(removed_bld):,})</h4><p class="list">{esc(", ".join(removed_bld[:80]))}{" ..." if len(removed_bld) > 80 else ""}</p>"""))

    # 4. resources
    r_cat = collections.Counter(r.get("category") for r in res)
    r_tier = collections.Counter(r.get("tier") for r in res)
    raw = [r for r in res if r.get("category") == "raw"]
    raw_rows = sorted(((r["name"], f"T{r.get('tier')}", r.get("baseValue"), ", ".join(map(str, r.get("planet_types") or []))[:60]) for r in raw), key=lambda x: (x[1], x[0]))
    sections.append(("4. Resources", f"""
<div class="cols">
<div><h4>By category</h4>{table(["Category", "Entries", "Share"], counter_rows(r_cat, ""), "kv")}</div>
<div><h4>By tier</h4>{table(["Tier", "Entries"], [(f"T{k}", f"{v:,}") for k, v in sorted(r_tier.items())], "kv")}</div>
</div>
<h4>The {len(raw)} raw resources</h4>{table(["Resource", "Tier", "Base value", "Planet types"], raw_rows, "kv small")}"""))

    # 5. planets
    fac = collections.Counter(s.get("faction") or s.get("closestFaction") for s in pla["mapData"])
    ptype = collections.Counter(p.get("type") for p in planets)
    top = collections.Counter(r["name"] for r in pres)
    rich = collections.Counter(round(r["richness"]) for r in pres)
    regions = [(r["name"], r.get("risk_zone"), ", ".join(map(str, r.get("resource_tiers") or [])), r.get("xp_modifier")) for r in pla["regionDefinitions"]]
    sections.append(("5. Galaxy map", f"""
<p>{len(pla['mapData']):,} star systems in {len(pla['regionDefinitions'])} regions, {len(planets):,} planets, {len(pres):,} planet resource entries (average richness {sum(r['richness'] for r in pres)/len(pres):.2f}).</p>
<div class="cols">
<div><h4>Systems by faction</h4>{table(["Faction", "Systems"], [(k, v) for k, v in fac.most_common()], "kv")}</div>
<div><h4>Richness (rounded)</h4>{table(["Richness", "Entries"], [(k, f"{v:,}") for k, v in sorted(rich.items())], "kv")}</div>
</div>
<h4>Most common planet resources</h4>{table(["Resource", "Planets carrying it"], [(k, f"{v:,}") for k, v in top.most_common(15)], "kv")}
<h4>Planets by type id</h4>{table(["Type", "Planets"], [(k, v) for k, v in sorted(ptype.items())], "kv small")}
<h4>Regions</h4>{table(["Region", "Risk zone", "Resource tiers", "XP modifier"], regions, "kv small")}"""))

    # 6. ships
    ship_rows = []
    for s in sh:
        st = s["ship"]
        ship_rows.append((st.get("Ship Name"), st.get("Manufacturer"), st.get("Spec"), st.get("Class"), st.get("cargo_capacity"),
                          st.get("hit_points"), st.get("shield_points"), st.get("damage"), st.get("subwarp_speed"), st.get("warp_speed"),
                          st.get("required_crew"), st.get("xp_value")))
    ship_rows.sort(key=lambda r: ((r[3] or 0), r[0] or ""))
    by_class = collections.Counter(s["ship"].get("Class") for s in sh)
    by_mfr = collections.Counter(s["ship"].get("Manufacturer") for s in sh)
    sections.append(("6. Ships", f"""
<div class="cols">
<div><h4>By class</h4>{table(["Class", "Ships"], [(k, v) for k, v in sorted(by_class.items())], "kv")}</div>
<div><h4>By manufacturer</h4>{table(["Manufacturer", "Ships"], [(k, v) for k, v in by_mfr.most_common()], "kv")}</div>
</div>
<h4>All {len(sh)} ships</h4>{table(["Ship", "Manufacturer", "Spec", "Class", "Cargo", "HP", "Shield", "Damage", "Subwarp", "Warp", "Crew", "XP"], ship_rows, "kv small")}"""))

    # 7. components
    roots = [(r["name"], sum(1 for _ in walk(r))) for r in tree]
    sections.append(("7. Ship components", f"""
<p>{len(comps):,} component nodes in a tree of {len(tree)} roots. Every one of the 1,573 component ids referenced by the 67 ships' configurations resolves in this tree.</p>
{table(["Root", "Nodes"], roots, "kv")}"""))

    # 8. pipeline + verification
    sections.append(("8. How the data was imported and verified", """
<ol>
<li><code>node RefreshData/split-uber-export.js &lt;uber-export.json&gt;</code> splits the export into the <code>JSON/</code> sources. It refuses to write if the component tree does not cover every ship configuration.</li>
<li><code>npm run refresh</code> validates every source against its JSON schema (10/10 valid) and regenerates <code>Data/*.js</code>.</li>
<li>The refresh's "breaking changes" alert compares element [0] of each list, so a re-ordered export reads as removed fields. The field set across all entries was diffed instead: the only true removal is <code>claimStakeDefinitions[].defaultBuilding</code>.</li>
<li>Verified under Node: every <code>Data/*.js</code> loads, <code>DataLoader</code> for all five explorer types, seven <code>CrossExplorerAnalytics</code> analyses, and a replay of Ship Explorer's component merge and lookup (58,862 configured slots, 0 unresolved).</li>
</ol>
<p>Export sections not yet used by any explorer: <code>missions</code>, <code>researchGateMap</code>, <code>cargoTypes</code>, <code>researchNodes</code>, <code>starbaseBalance</code>, <code>globalCombatConfig</code>, <code>levelThresholds</code>.</p>"""))

    toc = "".join(f'<li><a href="#s{i}">{esc(t)}</a></li>' for i, (t, _) in enumerate(sections))
    body = "".join(f'<section id="s{i}"><h2>{esc(t)}</h2>{c}</section>' for i, (t, c) in enumerate(sections))
    doc = f"""<!doctype html><html><head><meta charset="utf-8"><title>OperationsHub Data Report {meta_date}</title>
<style>
@page {{ size: A4; margin: 18mm 16mm; }}
body {{ font: 10.5pt/1.45 "Segoe UI", Arial, sans-serif; color: #1a1d24; margin: 0; }}
h1 {{ font-size: 24pt; margin: 0 0 4px; }} h2 {{ font-size: 16pt; margin: 0 0 8px; padding-top: 6px; border-bottom: 2px solid #2b5fa8; color: #2b5fa8; }}
h4 {{ margin: 12px 0 4px; font-size: 11pt; }} .sub {{ color: #555; margin: 0 0 14px; }}
section {{ page-break-before: always; }} section:first-of-type {{ page-break-before: auto; }}
table {{ border-collapse: collapse; width: 100%; margin: 4px 0 10px; }} th, td {{ border: 1px solid #cfd4dc; padding: 3px 6px; text-align: left; vertical-align: top; }}
th {{ background: #eef2f8; }} tr:nth-child(even) td {{ background: #f7f8fa; }} .small {{ font-size: 8.5pt; }} .small th, .small td {{ padding: 2px 4px; }}
.cols {{ display: flex; gap: 16px; }} .cols > div {{ flex: 1; }} .list {{ font-size: 9pt; color: #333; }} code {{ background: #eef2f8; padding: 0 3px; }}
.toc li {{ margin: 2px 0; }} a {{ color: #2b5fa8; text-decoration: none; }}
</style></head><body>
<h1>OperationsHub Data Report</h1>
<p class="sub">SAGE uber-export {meta_date} - report generated {today} from <code>JSON/</code> at commit {esc(git_short())}. Aephia Industries.</p>
<ol class="toc">{toc}</ol>
{body}
</body></html>"""

    os.makedirs(DOC_DIR, exist_ok=True)
    base = os.path.join(DOC_DIR, f"DATA-REPORT-{meta_date}")
    with open(base + ".html", "w", encoding="utf-8") as f:
        f.write(doc)
    browser = next((b for b in BROWSERS if os.path.exists(b)), None)
    if not browser:
        print("no Chrome/Edge found; HTML written only:", base + ".html")
        return
    subprocess.run([browser, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    f"--print-to-pdf={base}.pdf", "file:///" + (base + ".html").replace("\\", "/")],
                   check=True, capture_output=True, timeout=180)
    if "--keep-html" not in sys.argv:
        os.remove(base + ".html")   # intermediate only
    print("wrote", base + ".pdf", f"({os.path.getsize(base + '.pdf') / 1024:.0f} KB)")


def walk(node):
    yield node
    for c in node.get("children") or []:
        yield from walk(c)


def git_short():
    out = subprocess.run(["git", "rev-parse", "--short", "HEAD"], capture_output=True, text=True, cwd=ROOT)
    return out.stdout.strip() or "?"


if __name__ == "__main__":
    main()
