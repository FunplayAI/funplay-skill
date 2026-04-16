---
name: ui-slicing-checklist
description: Review UI sprite exports for nine-slice, pivot, padding, and import readiness.
dependencies: []
inputs:
  - UI asset set
  - target engine
  - intended UI usage
outputs:
  - slicing checklist
  - export issues
  - import recommendations
examples:
  - Ask the agent to review a UI button kit before importing it into Unity or Godot.
---

# UI Slicing Checklist

Use this skill when the user is preparing UI sprites for engine import and wants to catch common setup mistakes early.

## Review criteria

- Are borders thick enough and consistent for nine-slice behavior?
- Do pivots and alignment assumptions match how the element will be used?
- Is transparent padding deliberate and consistent?
- Are hover, pressed, disabled, and selected states visually aligned?
- Are export sizes and densities consistent across the set?

## Output rules

- Flag risky assets before they enter the engine.
- Prefer cheap art-export fixes over engine-side hacks.
- End with a short import checklist for the user.

