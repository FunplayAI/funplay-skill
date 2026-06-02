---
name: canvas-page-popup-bootstrap
description: Safely create or inspect new Cocos page, popup, or HUD canvas entries with canonical entry paths, parent and flow wiring, and authored-source guardrails.
category: cocos-engine
dependencies: []
inputs:
  - Cocos project canvas files
  - desired page, popup, or HUD id
  - optional parent page id
  - optional flow relationship
outputs:
  - canonical node shape
  - canvas entry validation result
  - flow wiring guidance
  - blocker report
examples:
  - node skills/canvas-page-popup-bootstrap/scripts/validate-canvas-entry.mjs canvas/canvas.json page:shop
  - Use when adding a new page:shop or popup:coupon entry to an existing Cocos canvas.
---

# Canvas Page Popup Bootstrap

Use this skill for narrow Cocos canvas entry work: creating or validating a new `page:*`, `popup:*`, or `hud:*` node and wiring parent/flow truth. It is not a whole new-game workflow and it is not for retrofitting existing UI nodes.

## Canonical Shape

For a page:

- `id`: `page:<leaf>`
- `type`: `page`
- `title`: user-facing title
- `entry`: `assets/ui/pages/<leaf>/<leaf>.prefab`

For a popup:

- `id`: `popup:<leaf>`
- `type`: `popup`
- `title`: user-facing title
- `entry`: `assets/ui/popups/<leaf>/<leaf>.prefab`
- `parent_id`: canonical host page id

For a HUD:

- `id`: `hud:<leaf>`
- `type`: `hud`
- `entry`: established HUD prefab path

## Workflow

1. Classify the request as new page, new popup, new HUD, flow wiring only, or visibility troubleshooting.
2. Prefer the project or daemon structure API when available. If no structure API exists, edit canvas files only when you can mirror all required artifacts safely.
3. Validate the canvas entry:

```bash
node <path-to-this-skill>/scripts/validate-canvas-entry.mjs canvas/canvas.json page:shop
```

4. Keep `parent_id` and `flow.edges` separate. Parent is structure ownership; flow edges are user-visible navigation/opening relationships.
5. If prefab content is touched, use Cocos authoring tools with save/reload proof. Do not hand-edit `.prefab` or `.scene` JSON.

## Guardrails

- `entry` must point to authored page/popup/HUD source, not `assets/main.scene` or generated runtime scenes.
- A canvas node existing does not prove the prefab is authored or visible.
- Do not use this skill for existing-node button/image retrofit; use `cocos-ui-node-retrofit`.
- If the authoritative Cocos/canvas tools are unavailable, report the blocker instead of guessing serialized internals.
