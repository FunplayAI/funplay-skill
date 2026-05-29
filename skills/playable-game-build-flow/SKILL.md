---
name: playable-game-build-flow
description: Build a small playable browser-game vertical slice through intent capture, a pillar contract, scoped implementation, and a P0 self-check.
category: game-build-workflow
dependencies: []
inputs:
  - game idea or brief
  - project root
  - optional engine preference
  - optional docs directory
outputs:
  - pillar contract markdown
  - scoped playable-slice implementation plan
  - P0 self-check result
examples:
  - Ask the agent to turn a one-sentence arcade game idea into a first playable PixiJS or Three.js vertical slice.
  - node skills/playable-game-build-flow/scripts/validate-pillar.mjs docs/meteor-dash-pillar.md
---

# Playable Game Build Flow

Use this skill for a new small browser game or a major prototype reset where the user wants a playable vertical slice, not a broad design document.

Optimize for the first game loop the player can actually try. Keep the session tight: ask only the questions needed, write only the files needed for the slice, and validate player-facing behavior before finishing.

## Phase 1: Intent Capture

For a new game, ask one compact question set before templates or code. Cover only:

- core fun
- 2-4 player-facing pillars or tradeoffs
- broad visual identity
- optional complexity limit

Do not ask about engine, platform, control scheme, module boundaries, level list, story details, or asset procurement unless the user already brought them up. If the user skips details, choose sensible defaults and continue.

## Phase 2: Pillar Contract

Create exactly one pillar contract before implementation. Put it under the project docs directory when one exists; otherwise use `docs/<slug>-pillar.md`.

Use this structure:

```markdown
# Game Name - Pillar Contract

## Intent
- 3-8 player-facing bullets

## Core Fun
1-2 sentences.

## Pillars
### pillar-one
1-2 sentences.

## Core Loop
- 4-6 player action nodes

## Art Direction
Engine choice and visual baseline.

## Modules
### kebab-case-module
- Carries: what gameplay responsibility this owns
- Watch-out: the easiest way this module can sprawl or break the slice
```

Validate the file before moving on:

```bash
node skills/playable-game-build-flow/scripts/validate-pillar.mjs docs/<slug>-pillar.md
```

Engine default:

- Explicit 3D or Three.js request: choose Three.js.
- Explicit 2D or PixiJS request: choose PixiJS.
- Ambiguous request: default to PixiJS and note the assumption in `Art Direction`.

Do not include balance tables, API specs, exhaustive state machines, or full content lists in the pillar contract.

## Phase 3: Project Setup

Use the project’s existing stack or template system if present. If there is no clear template system, create the smallest local setup that matches the project conventions.

After setup, read only:

- project instructions such as `AGENTS.md`, `CLAUDE.md`, or local docs
- the entry file and engine wrapper needed for the first loop
- package docs only when the first loop truly depends on them

Avoid broad source sweeps before the playable loop exists.

## Phase 4: Main Implementation

Build one vertical slice:

- implement the core loop from the pillar contract
- create only the modules needed for that loop
- add lightweight audio or juice after the loop works unless audio is the core mechanic
- preserve template-owned renderer, input, lifecycle, and asset paths

Runtime rules:

- Implement resize handling for HUD, camera, and anchors.
- Bind input through the template or engine input path, not ad-hoc canvas listeners.
- Support touch or pointer controls when reasonable.
- Avoid pointer lock for browser prototypes unless explicitly required.
- Convert pointer coordinates into world coordinates before aiming, placing, or picking.
- If the camera rotates, movement should remain coherent relative to camera direction.
- Drive gameplay from the scene update loop; do not start a second animation loop.
- Clean up listeners, display objects, 3D resources, and audio in teardown paths.

Scope control:

- Keep todos to 3-5 concrete items.
- If a change touches more than 3 major files or more than 1 large subsystem, split by subsystem and start with the core loop.
- For broad genre requests, implement a representative small system, not the whole genre.

## Phase 5: P0 Self-Check

Before the final response, inspect code and, when practical, run the local app or tests. Confirm:

- first frame is not blank
- player can move or perform the core action
- there is a main goal, threat, resource pressure, or scoring pressure
- engine choice matches the pillar contract
- camera and movement feel coherent
- pointer aiming or placement uses world coordinates
- HUD is bounded, readable, and not overlapping
- long-running audio is managed through a lifecycle, not loose repeated playback

If a P0 item fails, fix that concrete issue before finishing.

## Iteration Mode

For bug fixes, small features, or polish in a project that already has a pillar contract:

- skip intent capture
- read only the relevant pillar section and files
- keep edits targeted
- run the P0 checks only for touched behavior

For major redesigns, ask one compact intent question set, edit the existing pillar contract, and do not create a second pillar document.
