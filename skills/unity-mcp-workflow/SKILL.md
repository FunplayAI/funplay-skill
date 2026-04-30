---
name: unity-mcp-workflow
description: Use Funplay Unity MCP to edit, import, compile, inspect, and test Unity projects safely.
dependencies:
  - Funplay MCP for Unity
inputs:
  - Unity project root
  - active scene or target prefab
  - gameplay, UI, asset, or code change goal
outputs:
  - MCP-grounded edit workflow
  - Unity readback and validation evidence
  - remaining manual or device validation notes
examples:
  - Ask the agent to update a Unity UI prefab, recompile, enter Play Mode, capture a screenshot, and report console errors.
---

# Unity MCP Workflow

Use this skill when an agent is working in a Unity project connected to Funplay MCP for Unity and needs to verify code, prefabs, UI, Play Mode behavior, screenshots, scene hierarchy, console logs, domain reloads, or MCP connection issues.

This is the default project workflow skill shipped by `FunplayAI/funplay-unity-mcp`.

## Operating Loop

1. Establish context.
   - Confirm the Unity project root and active scene.
   - Check that Unity MCP is reachable before assuming Editor state.
   - Inspect hierarchy, prefab paths, selected objects, and relevant component references through MCP.
   - If the user names an object, verify the real Unity object path before editing.
2. Choose the edit surface.
   - Edit source files with normal repo tools, then trigger Unity recompilation.
   - Edit scene objects through Unity APIs, mark the scene dirty, and save the scene.
   - Edit prefab assets with `PrefabUtility.LoadPrefabContents`, `PrefabUtility.SaveAsPrefabAsset`, and `PrefabUtility.UnloadPrefabContents`.
   - If the user is looking at an open scene instance, update the visible scene instance as well as the prefab asset when appropriate.
3. Execute changes.
   - Prefer one well-guarded `execute_code` batch over many fragile UI clicks.
   - Use null guards for every object lookup and return explicit missing-path messages.
   - Return concise before/after values from snippets.
   - Save only the assets or scenes intentionally modified.
4. Validate.
   - Read back the changed objects through MCP.
   - For file edits, call `request_recompile`, then `wait_for_compilation`, then inspect console or compilation errors.
   - For runtime behavior, enter Play Mode or inspect live objects when needed.
   - Report exactly what was verified and what still requires device, store, network, or manual validation.

## Tool Exposure

- With the default `core` profile, rely on the focused workflow tools: `execute_code`, recompilation, Play Mode control, hierarchy, console logs, screenshots, input simulation, and performance inspection.
- With the default `full` profile, prefer specific MCP tools for simple scene, asset, GameObject, component, prefab, camera, UI, package, animation, file, or visual-feedback operations.
- If Tool Exposure is customized and a named tool is unavailable, adapt to the exposed tool list and report which expected tool is missing.

## MCP Call Pattern

Prefer native MCP tools when the client exposes them directly. If native tools are hidden or stale, probe the local HTTP endpoint:

```bash
curl -sS -m 1 -X POST http://127.0.0.1:8765/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

For multi-line `execute_code` calls over `curl`, generate JSON with a real encoder instead of hand-escaping C#:

```bash
node - <<'NODE'
const code = String.raw`
using UnityEngine;

public class InspectSomething
{
    public static string Run()
    {
        var obj = GameObject.Find("PracticeInGameUiRoot");
        return obj != null ? obj.name : "not found";
    }
}
`;
const payload = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: { name: "execute_code", arguments: { code } }
};
process.stdout.write(JSON.stringify(payload));
NODE
```

## Unity C# Patterns

Use fully qualified types if the snippet environment or injected project code makes `using` statements unreliable:

```csharp
var root = UnityEngine.GameObject.Find("PracticeInGameUiRoot");
var rect = root.GetComponent<UnityEngine.RectTransform>();
```

Use Unity null semantics for `UnityEngine.Object` references:

```csharp
if (image == null)
{
    return "Image missing";
}
```

For prefab edits:

```csharp
var path = "Assets/MyGame/UI/Prefabs/PF_PracticeInGameUiRoot.prefab";
var prefab = UnityEditor.PrefabUtility.LoadPrefabContents(path);
try
{
    var target = prefab.transform.Find("SafeArea/SwingCancelZone");
    if (target == null)
    {
        return "SwingCancelZone not found in prefab";
    }

    var rect = target.GetComponent<UnityEngine.RectTransform>();
    var before = rect.anchoredPosition;
    rect.anchoredPosition = new UnityEngine.Vector2(-76f, 448f);

    UnityEditor.EditorUtility.SetDirty(rect);
    UnityEditor.PrefabUtility.SaveAsPrefabAsset(prefab, path);
    UnityEditor.AssetDatabase.SaveAssets();
    return "Prefab saved: pos " + before + " -> " + rect.anchoredPosition;
}
finally
{
    UnityEditor.PrefabUtility.UnloadPrefabContents(prefab);
}
```

For scene edits:

```csharp
var obj = UnityEngine.GameObject.Find("PracticeInGameUiRoot/SafeArea/SwingCancelZone");
if (obj == null)
{
    return "Scene object not found";
}

var rect = obj.GetComponent<UnityEngine.RectTransform>();
var before = rect.sizeDelta;
UnityEditor.Undo.RecordObject(rect, "Update cancel zone");
rect.sizeDelta = new UnityEngine.Vector2(220f, 116f);
UnityEditor.EditorUtility.SetDirty(rect);
UnityEditor.SceneManagement.EditorSceneManager.MarkSceneDirty(obj.scene);
UnityEditor.SceneManagement.EditorSceneManager.SaveScene(obj.scene);
return "Scene saved: size " + before + " -> " + rect.sizeDelta;
```

## Recompile And Reload

After external C# or asset file edits:

1. Call `request_recompile`.
2. Call `wait_for_compilation`.
3. Read console or compilation errors before continuing.
4. If a domain reload drops the request, call `get_reload_recovery_status` when available, re-scan the MCP endpoint if needed, then continue from `wait_for_compilation`.

Do not treat a disconnected request as a successful compile.

## Verification Checklist

Use readback snippets that print exact values, not only `success`:

```csharp
var all = UnityEngine.Resources.FindObjectsOfTypeAll<UnityEngine.Transform>();
UnityEngine.Transform target = null;
for (int i = 0; i < all.Length; i++)
{
    if (all[i].name == "SwingCancelZone")
    {
        target = all[i];
        break;
    }
}

if (target == null)
{
    return "SwingCancelZone not found";
}

var rect = target.GetComponent<UnityEngine.RectTransform>();
return "path=" + target.name + "; pos=" + rect.anchoredPosition + "; size=" + rect.sizeDelta;
```

For UI work, verify prefab or scene hierarchy, sprite references, anchors, sorting order, active state, text fit, and button listeners. A populated `Content` hierarchy does not prove the user can see the UI.

For gameplay or network work, verify object identity, ownership, live instance existence, transform values, animation state, visibility, and whether client-side filters are discarding valid data.

## Failure Handling

- If MCP is unreachable, say so and fall back only to safe filesystem inspection or code edits. Do not claim scene, prefab, or runtime verification without Unity readback.
- If an object lookup fails, inspect hierarchy and prefab contents instead of inventing a path.
- If multiple matching objects exist, print their paths and choose the one matching the user-visible UI or current scene.
- If compile errors appear after a change, fix them before Play Mode validation.
- When Unity and text files disagree for serialized scene or prefab state, trust Unity readback and inspect the asset path.

## Source

- Original default skill: `FunplayAI/funplay-unity-mcp`
- Upstream reference checked: `69743b4a87605611f1bf12e1f1a76f1dba94708d`
