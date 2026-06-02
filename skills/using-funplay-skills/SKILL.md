---
name: using-funplay-skills
description: Learn how to discover, choose, and apply FunPlay Skill workflows in an agent session.
category: meta-routing
dependencies: []
inputs:
  - user goal
  - asset type
  - optional engine type
outputs:
  - recommended skill
  - suggested command
examples:
  - Ask the agent which FunPlay skill should be used for slicing a sprite sheet.
---

# Using FunPlay Skills

Use this skill when the user needs help choosing the right FunPlay workflow or understanding how multiple skills fit together.

## Rules

- Start by identifying whether the user needs deterministic asset processing, game concept shaping, UI asset briefing, Unity MCP verification, Cocos engine guidance, or skill discovery.
- Prefer the simplest verified local skill that solves the immediate problem.
- Recommend exact commands when the workflow can be run directly from the terminal.
- If no verified skill fits, say there is no current FunPlay skill for that workflow and suggest creating one that follows `docs/skill-spec.md`.

## Current skill map

- `sprite-sheet` for frame extraction from atlas-like images
- `normal-map` for deriving tangent-space normal maps from diffuse textures
- `audio-format-convert` for format conversion between `wav`, `ogg`, and `mp3`
- `game-concept-brief` for shaping early game inspiration into a compact GDD-lite brief before implementation
- `game-ui-asset-brief` for producing game UI asset prompts, cutout requirements, and validation checks
- `playable-game-build-flow` for guiding a small browser game from idea to a playable vertical slice with a validated pillar contract
- `unity-mcp-workflow` for Unity projects connected to Funplay MCP where the agent should verify editor state, compilation, Play Mode behavior, screenshots, and console output
- `minigame-subpackage-rules` for Cocos WeChat/Douyin minigame subpackage config checks
- `canvas-page-popup-bootstrap` for new Cocos page, popup, or HUD canvas entries
- `canvas-page-popup-removal` for safe removal blocker checks on existing Cocos page or popup nodes
- `cocos-ui-node-retrofit` for existing Cocos UI node retrofits such as label-to-image-backed button changes
- `workbench-asset-replace` for replacing existing Cocos/Studio visuals with Workbench assets

## Validation policy

- `sprite-sheet`, `normal-map`, `audio-format-convert`, `playable-game-build-flow`, `game-concept-brief`, `game-ui-asset-brief`, and the Cocos engine skills are kept because they have deterministic scripts and repository tests.
- `unity-mcp-workflow` is kept because it tracks the verified default project skill from `FunplayAI/funplay-unity-mcp`.
- Pure advisory skills without tests, scripts, or upstream verification should not be listed as available workflows.
