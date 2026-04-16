---
name: game-audio-polish
description: Review music and sound assets for loudness, loop quality, layering, and implementation readiness.
dependencies: []
inputs:
  - audio asset list
  - intended in-game context
  - target platform
outputs:
  - polish checklist
  - mixing risks
  - implementation notes
examples:
  - Ask the agent to review a set of menu, combat, and pickup sounds before engine integration.
---

# Game Audio Polish

Use this skill when the user wants feedback on whether audio assets are ready for implementation in a game build.

## Review criteria

- Loudness consistency between related sounds
- Clean loop boundaries for music or ambience
- Frequency clashes between UI, combat, ambience, and voice layers
- Tail lengths, silence trimming, and responsiveness for interactive sounds
- Format and implementation risks for the target engine or platform

## Output rules

- Focus on implementation-ready observations, not abstract music theory.
- Distinguish blocking issues from polish suggestions.
- End with a concrete to-fix list and suggested processing order.

