---
name: using-funplay-skills
description: Learn how to discover, choose, and apply FunPlay Skill workflows in a Claude Code session.
dependencies: []
inputs:
  - user goal
  - asset type
outputs:
  - recommended skill
  - suggested command
examples:
  - Ask the agent which FunPlay skill should be used for slicing a sprite sheet.
---

# Using FunPlay Skills

Use this skill when the user needs help choosing the right FunPlay workflow or understanding how multiple skills fit together.

## Rules

- Start by identifying the asset type: image, sprite sheet, normal map, or audio file.
- Prefer the simplest local skill that solves the immediate problem.
- Recommend exact commands when the workflow can be run directly from the terminal.
- If no existing skill fits, suggest creating a new skill that follows `docs/skill-spec.md`.

## Current skill map

- `sprite-sheet` for frame extraction from atlas-like images
- `normal-map` for deriving tangent-space normal maps from diffuse textures
- `audio-format-convert` for format conversion between `wav`, `ogg`, and `mp3`

