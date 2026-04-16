---
name: texture-atlas
description: Plan how 2D assets should be grouped, padded, named, and exported into texture atlases.
dependencies: []
inputs:
  - source sprite list
  - target platform or engine
  - atlas goals
outputs:
  - atlas grouping plan
  - naming rules
  - export checklist
examples:
  - Ask the agent how to group a HUD icon set and button states into atlases.
---

# Texture Atlas

Use this skill when the user needs to organize many 2D sprites into atlas-friendly groups before import or packing.

## Workflow

- Group assets by runtime usage, update frequency, and visual family.
- Separate frequently changing UI from stable environment or character art.
- Call out padding, trim, pivot, and bleed concerns that affect runtime rendering.
- Recommend deterministic naming for atlas files, sprites, and any manifest data.
- End with an import/export checklist tailored to the target engine.

## Output checklist

- Proposed atlas groups
- Why each group belongs together
- Padding and trimming guidance
- Naming convention
- Risks such as oversized atlases or mixed-density content

