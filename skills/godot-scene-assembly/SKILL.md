---
name: godot-scene-assembly
description: Organize Godot scenes, nodes, and resources into a clean, maintainable structure.
dependencies: []
inputs:
  - scene goal
  - node hierarchy
  - scripts/resources involved
outputs:
  - recommended scene structure
  - node ownership rules
  - validation checklist
examples:
  - Ask the agent how to structure a Godot scene for a player, camera, HUD, and interactables.
---

# Godot Scene Assembly

Use this skill when the user is building or refactoring Godot scenes, especially `.tscn` hierarchies and resource references.

## Workflow

- Start from the gameplay responsibility of the scene, not the current node clutter.
- Group nodes by responsibility: gameplay logic, visuals, collision, audio, UI hooks.
- Keep reusable units in separate scenes when duplication is likely.
- Make exported properties and scene boundaries explicit so the setup stays editor-friendly.
- Recommend a short smoke-test inside Godot after structural edits.

## Watch-outs

- PackedScene boundaries that are too large or too tiny
- Hidden node coupling through fragile relative paths
- Resource duplication that should be shared

