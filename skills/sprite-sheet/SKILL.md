---
name: sprite-sheet
description: Slice a sprite sheet into single-frame PNG files.
dependencies:
  - sharp
inputs:
  - sprite sheet path
  - rows
  - columns
outputs:
  - output directory with numbered PNG frames
examples:
  - node skills/sprite-sheet/scripts/slice.mjs ./sheet.png 4 4
---

# Sprite Sheet

Use this skill when you need to split one atlas-style sprite sheet into uniformly sized frame images.

- Input formats: PNG, JPG, WebP, and other formats supported by `sharp`
- Output format: PNG frames
- Failure cases: missing file, non-positive row/column counts, or dimensions that do not divide evenly

