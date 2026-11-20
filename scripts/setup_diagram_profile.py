import os
import shutil

home = os.path.expanduser("~")
profile_dir = os.path.join(home, ".diagram-design", "profiles")
os.makedirs(profile_dir, exist_ok=True)

style_guide_path = r".agents\skills\diagram-design\references\style-guide.md"
with open(style_guide_path, "r", encoding="utf-8") as f:
    orig_content = f.read()

# 1. Save default.md
default_header = """<!-- diagram-design-profile
name: Default
slug: default
source-url: none
created: 2026-11-20
updated: 2026-11-20
notes: Pristine shipped style guide
-->

"""
with open(os.path.join(profile_dir, "default.md"), "w", encoding="utf-8") as f:
    f.write(default_header + orig_content)
print("Saved default.md")

# 2. Prepare traicainghien.md
traicainghien_header = """<!-- diagram-design-profile
name: Trại Cai Nghiện (Zen Minimalist & Washi Paper)
slug: traicainghien
source-url: https://traicainghien.com
created: 2026-11-20
updated: 2026-11-20
notes: Official brand style for Trai Cai Nghien psychological & behavioral diagrams
-->

"""

# Replace tokens in style guide
custom_content = orig_content

# Update semantic roles table
light_table_old = """| Role | Purpose | Default (light) | Default (dark) |
|---|---|---|---|
| `paper` | Page background, default node fill | `#f5f5f5` (white-smoke) | `#2d3142` (jet-black) |
| `paper-2` | Diagram container bg, secondary fill | `#ececec` | `#393e53` |
| `ink` | Primary text, primary stroke | `#2d3142` (jet-black) | `#f5f5f5` (white-smoke) |
| `ink-strong` | High-contrast text on warm accent fills | `#111111` | `#111111` |
| `muted` | Secondary text, default arrow stroke | `#4f5d75` (blue-slate) | `#bfc0c0` (silver) |
| `soft` | Sublabels, boundary labels | `#5a6580` | `#949eb2` |
| `rule` | Hairline borders | `rgba(45,49,66,0.12)` | `rgba(245,245,245,0.12)` |
| `rule-solid` | Stronger borders, baselines | `#bfc0c0` (silver) | `rgba(191,192,192,0.25)` |
| `accent` | Focal / 1–2 max per diagram | `#bf4520` (burnt-tangerine) | `#f08a59` |
| `accent-tint` | Fill for accent-bordered boxes | `rgba(191,69,32,0.08)` | `rgba(240,138,89,0.10)` |
| `link` | HTTP/API calls, external arrows | `#2e5aa8` | `#739fdf` |"""

light_table_new = """| Role | Purpose | Default (light) | Default (dark) |
|---|---|---|---|
| `paper` | Page background, default node fill | `#FAF7F2` (warm washi paper) | `#202422` (deep charcoal) |
| `paper-2` | Diagram container bg, secondary fill | `#F2EDE4` (warm linen secondary) | `#2A302D` |
| `ink` | Primary text, primary stroke | `#2D312E` (sumi-e charcoal) | `#FAF7F2` (warm washi) |
| `ink-strong` | High-contrast text on warm accent fills | `#1A1D1A` | `#1A1D1A` |
| `muted` | Secondary text, default arrow stroke | `#4A584E` (deep sage/moss) | `#A3B1A6` |
| `soft` | Sublabels, boundary labels | `#637367` (soft moss) | `#859689` |
| `rule` | Hairline borders | `rgba(45,49,46,0.12)` | `rgba(250,247,242,0.12)` |
| `rule-solid` | Stronger borders, baselines | `#D6CEBE` (washi border) | `rgba(214,206,190,0.25)` |
| `accent` | Focal / 1–2 max per diagram | `#3A5A40` (forest moss green) | `#5A8262` |
| `accent-tint` | Fill for accent-bordered boxes | `rgba(58,90,64,0.08)` | `rgba(90,130,98,0.12)` |
| `link` | HTTP/API calls, external arrows | `#C27D53` (warm terracotta) | `#D9946A` |"""

custom_content = custom_content.replace(light_table_old, light_table_new)

# Update typography table
typo_old = """| Role | Family | Size | Weight | Usage |
|---|---|---|---|---|
| `title` | Instrument Serif | 1.75rem | 400 | Page H1 |
| `node-name` | Geist (sans) | 12px | 600 | Human-readable labels |
| `sublabel` | Geist Mono | 9px | 400 | Port, protocol, URL, field type |
| `eyebrow` | Geist Mono | 7–8px | 500, tracked 0.18em, uppercase | Type tags, axis labels |
| `arrow-label` | Geist Mono | 8px | 400, tracked 0.06em | Arrow annotations |
| `callout` | Instrument Serif *italic* | 14px | 400 | Editorial asides only |"""

typo_new = """| Role | Family | Size | Weight | Usage |
|---|---|---|---|---|
| `title` | Playfair Display, Instrument Serif, serif | 1.75rem | 600 | Page H1 (Vietnamese diacritics) |
| `node-name` | Be Vietnam Pro, Geist, sans-serif | 12px | 600 | Human-readable labels |
| `sublabel` | JetBrains Mono, Geist Mono, monospace | 9px | 400 | Port, protocol, URL, field type |
| `eyebrow` | JetBrains Mono, Geist Mono, monospace | 7–8px | 500, tracked 0.18em, uppercase | Type tags, axis labels |
| `arrow-label` | JetBrains Mono, Geist Mono, monospace | 8px | 400, tracked 0.06em | Arrow annotations |
| `callout` | Playfair Display, serif *italic* | 14px | 400 | Editorial asides only |"""

custom_content = custom_content.replace(typo_old, typo_new)

# Update font stack
font_stack_old = """```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600&family=Noto+Serif:ital@0;1&family=Noto+Sans+KR:wght@400;500;600&family=Noto+Serif+KR:wght@400&family=Noto+Sans+TC:wght@400;500;600&family=Noto+Serif+TC:wght@400&display=swap" rel="stylesheet">
```"""

font_stack_new = """```html
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```"""

custom_content = custom_content.replace(font_stack_old, font_stack_new)

# Write traicainghien.md profile
with open(os.path.join(profile_dir, "traicainghien.md"), "w", encoding="utf-8") as f:
    f.write(traicainghien_header + custom_content)
print("Saved traicainghien.md to profile library")

# Also update the working copy style-guide.md in .agents/skills/diagram-design
with open(style_guide_path, "w", encoding="utf-8") as f:
    f.write(traicainghien_header + custom_content)
print("Updated working copy style-guide.md")
