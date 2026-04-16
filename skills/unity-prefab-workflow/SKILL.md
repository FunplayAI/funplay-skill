---
name: unity-prefab-workflow
description: Safely plan and review Unity prefab, scene, and serialized asset edits.
dependencies: []
inputs:
  - target Unity objects or files
  - gameplay or content goal
outputs:
  - safe edit plan
  - serialization precautions
  - verification checklist
examples:
  - Ask the agent how to safely update a Unity prefab hierarchy and related scene references.
---

# Unity Prefab Workflow

Use this skill when the task involves Unity assets such as `.prefab`, `.unity`, `.mat`, `.asset`, or related meta-linked files.

## Rules

- Treat Unity YAML assets as serialization-sensitive; avoid unnecessary reordering or broad rewrites.
- Preserve `.meta` file relationships and asset GUID stability.
- Prefer focused changes to one prefab, scene, or material group at a time.
- Call out inspector-side settings the user may still need to verify inside the editor.
- If a change may affect scene references, list the likely downstream assets to inspect.

## Verification checklist

- Prefab or scene opens without missing script/component references
- Serialized references remain intact
- Transform, layer, tag, and material assignments still match the intended design
- The user knows which in-editor smoke test to run next

