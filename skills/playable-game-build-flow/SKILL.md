---
name: playable-game-build-flow
description: Build a polished small browser-game vertical slice by translating the user's creative inspiration into a creative north star, a pillar contract, scoped implementation, and a P0 self-check.
category: game-build-workflow
dependencies: []
inputs:
  - game idea or brief
  - project root
  - optional engine preference
  - optional docs directory
outputs:
  - creative north-star summary
  - pillar contract markdown
  - scoped playable-slice implementation plan
  - P0 self-check result
examples:
  - Ask the agent to turn a one-sentence arcade game inspiration into a first playable PixiJS or Three.js vertical slice.
  - node <path-to-this-skill>/scripts/validate-pillar.mjs docs/meteor-dash-pillar.md
---

# Playable Game Build Flow

Use this skill for a new small browser game or a major prototype reset where the user wants a playable vertical slice that preserves the user's creative inspiration, not a broad design document.

Optimize for the first game loop the player can actually try and remember. Keep the session tight: ask only the questions needed, translate inspiration into concrete play decisions, write only the files needed for the slice, and validate player-facing behavior before finishing.

## Phase 1: Creative Intent Capture

For a new game, ask one compact inspiration-to-game question set before templates or code.

If the runtime exposes a structured user-question tool such as `ask_user`, `ask_user_question`, or `request_user_input`, use that tool for this phase. If no structured user-question tool is available, ask the same compact question set in normal chat. If the initial brief already answers the items below, summarize the inferred answers and continue without asking again.

Cover only:

- memorable player feeling or fantasy
- signature moment the first minute should contain
- 2-4 player-facing pillars or taste tradeoffs
- visual/audio references, mood words, or anti-references
- optional first-slice complexity limit

Do not flatten unusual inspiration into a generic genre label. Preserve the user's specific metaphors, tensions, and taste boundaries, then convert them into playable decisions. If the user references an existing game or artwork, capture what to borrow and what to avoid.

Do not ask about engine, platform, control scheme, module boundaries, level list, story details, or asset procurement unless the user already brought them up. If the user skips details or gives partial answers, choose sensible defaults when safe and continue. Keep follow-up questions rare and only use them when the missing answer would materially change the first playable slice.

## Phase 2: Pillar Contract

Create exactly one pillar contract before implementation. Put it under the project docs directory when one exists; otherwise use `docs/<slug>-pillar.md`.

Use this structure:

```markdown
# Game Name - Pillar Contract

## Intent
- 3-8 player-facing bullets

## Creative North Star
1-2 sentences naming the remembered feeling, signature first-minute moment, and taste boundary.

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

Validate the file before moving on. The validator is bundled with this skill, not with the target game project. Do not assume `skills/playable-game-build-flow/...` exists under the project root. Resolve `scripts/validate-pillar.mjs` relative to this skill's installed directory and run it with the pillar file path:

```bash
node <path-to-this-skill>/scripts/validate-pillar.mjs docs/<slug>-pillar.md
```

If the runtime cannot expose bundled skill files as executable paths, validate manually against the same rules and explicitly say the script was not run. Manual fallback checklist:

- title is shaped `# Game Name - Pillar Contract`
- required sections are present: `Intent`, `Creative North Star`, `Core Fun`, `Pillars`, `Core Loop`, `Art Direction`, `Modules`
- `Intent` has 3-8 player-facing bullets
- `Creative North Star` names the player feeling, signature moment, and taste boundary
- `Core Loop` has 4-6 player action nodes
- `Pillars` has 2-4 kebab-case subsections
- `Modules` has 2-4 kebab-case subsections with `Carries` and `Watch-out`

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

- implement the signature moment from the creative north star as early as possible
- implement the core loop from the pillar contract
- create only the modules needed for that loop
- add lightweight audio, animation, particles, camera motion, or tactile feedback after the loop works when it reinforces the creative north star
- preserve template-owned renderer, input, lifecycle, and asset paths
- remove generic template leftovers that conflict with the user's intended feeling

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
- the signature moment can occur within the first minute
- player can move or perform the core action
- there is a main goal, threat, resource pressure, or scoring pressure
- at least one sensory detail supports the creative north star
- engine choice matches the pillar contract
- camera and movement feel coherent
- pointer aiming or placement uses world coordinates
- HUD is bounded, readable, and not overlapping
- long-running audio is managed through a lifecycle, not loose repeated playback
- final response reports the playtest path, checks run, and any P0 item that could not be verified

If a P0 item fails, fix that concrete issue before finishing.

## Iteration Mode

For bug fixes, small features, or polish in a project that already has a pillar contract:

- skip intent capture
- read only the relevant pillar section and files
- keep edits targeted
- run the P0 checks only for touched behavior

For major redesigns, ask one compact intent question set, edit the existing pillar contract, and do not create a second pillar document.
