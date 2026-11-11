# Crew art (Blender, procedural, no external assets)

Rebuild (renders go to a scratch dir, never the repo):

```
blender -b -P Tools\crew\render_crew.py -- <scratch> frames        # then: ... <scratch> bay 128   and   ... <scratch> card 128
python -I Tools\crew\pack_crew.py <scratch>                        # writes Images\crew\*.webp and Images\landing\card_crew.webp
```

Blender: `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe`. Check the contract with `python -I Tools\crew\check_crew.py`
(`--as-frame <file>` is the negative control; it must fail).

Frame contract: 480x600 WebP with alpha, window = centre rect inset 6 % per side, fully transparent. No Star Atlas logos or emblems.
