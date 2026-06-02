---
name: workbench-asset-replace
description: Plan safe replacement of an existing Cocos or Studio visual with a Workbench image, preserving source asset identity, canvas bounds, static versus runtime target classification, and import proof.
category: cocos-engine
dependencies: []
inputs:
  - Workbench image, handle, selected asset, or local visual source
  - target Cocos node label or runtime slot name
  - optional Workbench canvas bounds
  - optional target component proof
outputs:
  - static or runtime-generated target classification
  - replacement steps
  - proof checklist
  - blocker report
examples:
  - node skills/workbench-asset-replace/scripts/plan-asset-replace.mjs --source workbench://asset/123 --target-label GeneratedBackground
  - Use when replacing an existing background or UI image with a Workbench asset rather than generating a new image.
---

# Workbench Asset Replace

Use this skill when the user wants to replace an existing Cocos/Studio visual with an existing Workbench image, handle URL, selected asset, pasted design asset, or local visual source.

This skill is not for generating new images. It routes existing visual replacement into the smallest safe asset or SpriteFrame update.

## Workflow

1. Resolve or materialize the Workbench source asset.
2. Record source pixel size and Workbench canvas display bounds when available.
3. Classify the target:

```bash
node <path-to-this-skill>/scripts/plan-asset-replace.mjs --source "<source>" --target-label GeneratedBackground
```

4. For a static Cocos Sprite node, import the asset and bind the real target's SpriteFrame through Cocos authoring tools.
5. For a runtime-generated slot, find the runtime asset key and replace the consumed project resource file. Do not create duplicate visual nodes.
6. Report proof: source, target classification, project asset path, import or replacement evidence, and whether layout size was preserved or intentionally left unchanged.

## Guardrails

- Do not use image generation for an existing Workbench image replacement.
- Do not call generated runtime nodes prefab nodes unless query proof shows they exist in the prefab or scene.
- Do not hand-edit `.prefab`, `.scene`, or `.meta` files.
- Do not resize, crop, or bake the Workbench asset to canvas bounds unless the user explicitly requests that.
- If multiple Workbench images or runtime asset keys match, ask one short clarification before replacing.
