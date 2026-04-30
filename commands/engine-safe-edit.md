---
description: "Choose the safest engine-facing workflow before changing project files"
---

Tell the user you are using `using-funplay-skills` to route the task safely.

Then:

1. Determine whether the project is Unity, Godot, or Cocos Creator.
2. Route Unity projects connected to Funplay MCP to `unity-mcp-workflow` when live editor readback, compilation, Play Mode, screenshots, or console logs are needed.
3. Route Unity serialized file-only work to `unity-prefab-workflow`, Godot work to `godot-scene-assembly`, and Cocos Creator work to `cocos-component-workflow`.
4. Ask the user to confirm high-risk editor-generated files before broad edits.
5. End with a short verification checklist for the chosen engine.
