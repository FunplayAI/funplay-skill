---
name: cocos-ui-node-retrofit
description: Classify and plan safe Cocos UI node retrofits such as text changes, SpriteFrame swaps, or converting a label-only control into an image-backed button with overlay text.
category: cocos-engine
dependencies: []
inputs:
  - target Cocos node path or selection
  - existing component list
  - intended UI change
  - optional source image asset
outputs:
  - retrofit classification
  - recommended node shape
  - proof checklist
  - blocker report
examples:
  - node skills/cocos-ui-node-retrofit/scripts/classify-retrofit.mjs --intent "replace label with image-backed start button" --component cc.Label --source-asset assets/ui/start.png --actionable
  - Use when changing an existing Cocos UI node without creating a new page or popup.
---

# Cocos UI Node Retrofit

Use this skill for targeted edits to existing Cocos UI nodes, especially when replacing text-only controls with image-backed controls, adding overlay text/icons, or fixing a clickable node so the real target owns Sprite, Button feedback, hit size, and handler proof.

## Classify First

Run the classifier or classify manually:

```bash
node <path-to-this-skill>/scripts/classify-retrofit.mjs --intent "<requested change>" --component cc.Label --source-asset assets/ui/button.png
```

Classifications:

- `property-edit`: change an existing component property, such as `cc.Label.string`.
- `resource-swap`: keep structure and replace an existing `cc.Sprite.spriteFrame`.
- `structure-retrofit`: change component mix or add children, such as converting label-only text into Sprite body plus Label overlay.

## Preferred Shape

For an image-backed actionable control:

- target node
  - `cc.UITransform`
  - `cc.Sprite`
  - `cc.Button` when actionable
- child overlay node
  - `cc.Label` or `cc.Sprite`

## Guardrails

- Query the selected target before mutation; do not guess node structure.
- Keep the actual selected node as the authority. Do not create a duplicate runtime-only button to satisfy the request.
- Do not hand-edit `.prefab` or `.scene` JSON.
- Do not guess SpriteFrame UUIDs or patch `.meta` files.
- If Cocos authoring tools cannot prove the mutation, report the structured blocker instead of weakening the proof.
