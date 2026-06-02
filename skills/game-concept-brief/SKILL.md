---
name: game-concept-brief
description: Turn an early game idea or creative inspiration into a compact GDD-lite concept brief with creative north star, MDA framing, MVP scope, and first-playable acceptance criteria before implementation.
category: game-design-workflow
dependencies: []
inputs:
  - game idea or creative inspiration
  - optional target platform
  - optional genre or visual style
  - optional output document path
outputs:
  - JSON concept brief
  - Markdown GDD-lite template
  - focused question set
  - first-playable readiness gates
examples:
  - node skills/game-concept-brief/scripts/build-brief.mjs --prompt "a browser game about protecting a lamp in heavy rain" --platform web
  - Use before playable-game-build-flow when the idea needs concept sharpening before code.
---

# Game Concept Brief

Use this skill when the user has a game spark, mood, metaphor, or vague product idea and wants it shaped before implementation. This is a design brief skill, not an implementation workflow.

The goal is to preserve the user's inspiration while making it buildable: capture the creative north star, core loop, MDA chain, MVP cutline, and first-playable acceptance criteria.

## Workflow

1. Run the bundled brief builder when a deterministic starting point helps:

```bash
node <path-to-this-skill>/scripts/build-brief.mjs --prompt "<game idea>" --platform web --style "<visual direction>"
```

2. Ask only the missing high-impact questions from the generated `focusQuestions`.
3. Fill the Markdown brief or write it to a project design document when the user wants a saved artifact.
4. Keep the output compact. This skill should prepare implementation, not replace it with a long design bible.
5. If implementation follows, hand the brief to `playable-game-build-flow` and keep the first slice aligned to the acceptance criteria.

## Brief Rules

- The creative north star must name what the player should remember after the first minute.
- The core loop must describe what the player does every 10-30 seconds.
- MDA should connect mechanics to player emotion instead of listing abstract genre traits.
- MVP scope must separate must-haves from non-goals.
- Acceptance criteria must be verifiable through play, screenshots, or local runtime checks.

## Avoid

- Do not invent hard market claims without research.
- Do not ask broad questionnaires when a single focused question would unblock the brief.
- Do not start engine edits, asset generation, or code implementation from this skill unless the user explicitly changes from concept work to build work.
