---
name: using-funplay-skills
description: Learn how to discover, choose, and apply FunPlay Skill workflows in an agent session.
category: meta-routing
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

- Start by identifying whether the user needs deterministic asset processing, Unity MCP verification, or skill discovery.
- Prefer the simplest verified local skill that solves the immediate problem.
- Recommend exact commands when the workflow can be run directly from the terminal.
- If no verified skill fits, say there is no current FunPlay skill for that workflow and suggest creating one that follows `docs/skill-spec.md`.

## Current skill map

- `sprite-sheet` for frame extraction from atlas-like images
- `normal-map` for deriving tangent-space normal maps from diffuse textures
- `audio-format-convert` for format conversion between `wav`, `ogg`, and `mp3`
- `playable-game-build-flow` for guiding a small browser game from idea to a playable vertical slice with a validated pillar contract
- `unity-mcp-workflow` for Unity projects connected to Funplay MCP where the agent should verify editor state, compilation, Play Mode behavior, screenshots, and console output

## Validation policy

- `sprite-sheet`, `normal-map`, `audio-format-convert`, and `playable-game-build-flow` are kept because they have deterministic scripts and repository tests.
- `unity-mcp-workflow` is kept because it tracks the verified default project skill from `FunplayAI/funplay-unity-mcp`.
- Pure advisory skills without tests, scripts, or upstream verification should not be listed as available workflows.
