# Configuration Bay mockup (teardown skill)

Look-and-feel reference for the in-game **Configure** view (owner, 2026-10-31): fleet select shows the ship list and the
selected ship with a CONFIGURE button; the button opens this full-screen teardown view. Built with the `teardown` skill's
kit and rules, NOT shipped - the in-game version is built in UE to match it once the owner approves the look.

- **One source:** every bar, callout and glow reads the Guardian's real `Cfg*` arrays from
  `Data/configs/ship_configs.json` (extracted into `guardian.json`); cost = `(Cost*Pct+99)/100`, the same integer maths as
  C++ `ShipCostWithConfig`. `DEMO_FLEET` (50 pts) is a stand-in for the rest of the fleet.
- **Teardown:** the official Star Atlas web model (`RawAssets/WebGL/Calico/Guardian`, packed to `guardian.glb`, gitignored)
  is cloned into 4 slices with clipping planes; back faces draw as section caps; the slices pull apart and the internal
  systems (reactor, weapons bus, shield generator) sit in the gaps; drive rings, flank armour plates (raycast onto the
  hull) and repair drones fit on eased arcs. Views SOLID / X-RAY (fresnel + crease lines) / TEARDOWN; cameras 3/4, SIDE,
  TOP; idle 14 s starts an auto tour.

```
node tools/configbay-proto/gltf2glb.mjs RawAssets/WebGL/Calico/Guardian/CAP_CLC_Guardian_LowRes.gltf tools/configbay-proto/guardian.glb
node ~/.claude/skills/teardown/sims/build.mjs ./tools/configbay-proto   # -> teardown-out/dist/configbay-proto.html
```
