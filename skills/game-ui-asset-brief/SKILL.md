---
name: game-ui-asset-brief
description: Build a compact game UI asset brief with generation prompts, asset roles, cutout requirements, and validation checks for backgrounds, buttons, panels, icons, HUD pieces, and logo treatments.
category: ui-asset-workflow
dependencies: []
inputs:
  - game UI theme or art direction
  - optional asset list
  - optional target size or aspect ratio
  - optional target project or design tool
outputs:
  - UI asset generation brief
  - per-asset prompt list
  - cutout and split requirements
  - asset validation checklist
examples:
  - node skills/game-ui-asset-brief/scripts/build-brief.mjs --style "rainy cozy fantasy UI" --asset background --asset button_skin --asset hud_badge
  - Use when a game needs a reusable UI kit before image generation or asset import.
---

# Game UI Asset Brief

Use this skill when the user wants game UI assets such as a background, button skin, panel, HUD badge, icon set, title logo, or a cohesive UI kit.

This skill does not require a specific design tool. It outputs asset prompts and processing requirements that can be handed to an image generator, cutout workflow, sprite splitter, or engine import flow.

## Workflow

1. Run the bundled brief builder:

```bash
node <path-to-this-skill>/scripts/build-brief.mjs --style "<art direction>" --asset background --asset button_skin --asset panel
```

2. Generate assets from the per-asset prompts.
3. Cut out foreground assets to transparent PNG.
4. Split sheets only when the brief asks for multiple states or parts.
5. Import assets into the project or design tool.
6. Verify the asset-specific checks before wiring the asset into gameplay or UI.

## Asset Rules

- Backgrounds should fill the target aspect, contain no UI text, and leave safe space for foreground UI.
- Button skins should usually contain no baked text so labels stay editable.
- Foreground assets should be isolated on a plain background for cutout.
- Cutout outputs must keep the subject visible, uncropped, and free of opaque background boxes.
- Reuse a small coherent kit instead of generating one-off unrelated UI pieces.

## Avoid

- Do not mix unrelated visual styles in one kit.
- Do not treat a prompt as proof that the generated image is usable; verify alpha, crop, scale, and readability.
- Do not bake UI copy into images unless the user explicitly wants a logo/title or non-editable text art.
