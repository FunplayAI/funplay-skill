---
name: canvas-page-popup-removal
description: Check blockers and safely remove existing Cocos page or popup canvas nodes without silently deleting prefab, script, or runtime assets.
category: cocos-engine
dependencies: []
inputs:
  - canvas/canvas.json
  - target page or popup node id
  - optional structure API result
outputs:
  - deletion blocker report
  - referencing flow edge count
  - safe deletion guidance
  - cleanup boundary summary
examples:
  - node skills/canvas-page-popup-removal/scripts/check-removal-blockers.mjs canvas/canvas.json popup:coupon
  - Use before deleting an existing page:* or popup:* node from a Cocos canvas.
---

# Canvas Page Popup Removal

Use this skill when the user wants to delete an existing `page:*` or `popup:*` node from Cocos canvas truth.

This skill owns only canvas node removal. It does not silently delete underlying prefab files, scripts, generated runtime scenes, or assets.

## Workflow

1. Confirm the target node exists and is a page or popup.
2. Check blockers:

```bash
node <path-to-this-skill>/scripts/check-removal-blockers.mjs canvas/canvas.json popup:coupon
```

3. Stop if the target has child nodes, dependencies, or is `canvas.flow.root_node_id`.
4. Prefer canonical structure API deletion when available so node truth, ownership artifacts, and flow edges stay aligned.
5. If direct editing is the only route, mirror the same blocker rules and remove only canvas truth plus referencing flow edges.

## Rules

- Do not cascade delete by default.
- Do not invent a replacement flow root.
- Do not treat prefab/script cleanup as part of node deletion unless the user explicitly asks for a separate cleanup.
- Report whether referencing `flow.edges` were removed or should be removed by the structure API.
