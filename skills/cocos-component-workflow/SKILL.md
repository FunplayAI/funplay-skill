---
name: cocos-component-workflow
description: Plan and review Cocos Creator prefab, component, and asset-reference changes safely.
dependencies: []
inputs:
  - target prefab or scene
  - intended feature change
outputs:
  - component update plan
  - prefab safety checklist
  - verification steps
examples:
  - Ask the agent how to update a Cocos UI prefab without breaking component references.
---

# Cocos Component Workflow

Use this skill when the task touches Cocos Creator scenes, prefabs, component scripts, or serialized asset references.

## Rules

- Prefer small, isolated prefab changes over broad scene churn.
- Keep component responsibilities narrow and explicit.
- Call out any inspector bindings or drag-and-drop references that may need editor verification.
- When refactoring, preserve stable node paths where possible to reduce broken references.

## Verification checklist

- Prefab loads with expected component bindings
- Node hierarchy still supports current script assumptions
- Asset references and UUID-backed links remain intact
- The user has a quick in-editor smoke test to run

