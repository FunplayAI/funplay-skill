---
name: minigame-subpackage-rules
description: Validate and explain Cocos WeChat/Douyin minigame subpackage rules, keeping project-owned rule authority in profiles/v2/packages/project.json rather than build templates or release outputs.
category: cocos-engine
dependencies: []
inputs:
  - Cocos project root
  - target minigame platform
  - optional packaging intent
  - optional subpackage group changes
outputs:
  - subpackage template diagnosis
  - platform-specific group validation
  - packaging readiness result
  - safe edit guidance
examples:
  - node skills/minigame-subpackage-rules/scripts/validate-minigame-subpackages.mjs profiles/v2/packages/project.json --platform wechatgame
  - Use before enabling WeChat or Douyin subpackage packaging in a Cocos project.
---

# Minigame Subpackage Rules

Use this skill when editing, validating, or explaining WeChat/Douyin minigame subpackage rules in a Cocos project.

## Source Of Truth

Project packaging config owns the rule:

```text
profiles/v2/packages/project.json
```

Default template:

```json
{
  "minigameSubpackages": {
    "wechatgame": { "groups": [] },
    "bytedance-mini-game": { "groups": [] }
  }
}
```

Empty `groups` means the default template exists but no real subpackage groups are configured yet. Do not call that "missing template."

## Workflow

1. Read `profiles/v2/packages/project.json` first.
2. Run the bundled validator:

```bash
node <path-to-this-skill>/scripts/validate-minigame-subpackages.mjs profiles/v2/packages/project.json --platform wechatgame
```

3. Use `--require-groups` only when the user is preparing an explicit subpackage packaging run.
4. Backfill missing default template fields only in `profiles/v2/packages/project.json`.
5. Keep WeChat and Douyin groups separate unless the user explicitly wants both platforms configured.

## Rules

- Edit only `minigameSubpackages.wechatgame.groups` or `minigameSubpackages["bytedance-mini-game"].groups`.
- Group roots must point under `assets/`, for example `db://assets/bundles/battle`.
- Do not author rules in `build-template/**/game.json`.
- Do not treat release outputs as project source of truth.
- Do not claim rules will affect packaging unless subpackage mode is explicitly enabled for that packaging run.
