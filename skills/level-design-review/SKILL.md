---
name: level-design-review
description: Review a game level, mission, or encounter plan for flow, readability, and pacing.
dependencies: []
inputs:
  - level description or layout
  - intended player abilities
  - target difficulty
outputs:
  - review findings
  - prioritized fixes
examples:
  - Ask the agent to review a combat arena for pacing and player guidance.
---

# Level Design Review

Use this skill when the user wants design feedback on a level blockout, puzzle route, mission structure, or combat encounter.

## Review criteria

- Readability: can players identify the goal, route, and hazards quickly?
- Pacing: does intensity ramp in a deliberate way instead of spiking randomly?
- Recovery: do players have enough space, time, or resources to recover from mistakes?
- Variety: do beats, spaces, and challenges change often enough to stay interesting?
- Landmarks: does the environment help orientation and memory?

## Output rules

- Describe issues in player-facing language, not abstract theory.
- Prioritize the top 3 fixes by impact.
- When useful, suggest low-cost layout changes before proposing new systems.

