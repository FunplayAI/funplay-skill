<p align="center">
  <h1 align="center">FunPlay Skill</h1>
  <p align="center">
    <strong>Reusable game-development skills for coding agents</strong>
  </p>
  <p align="center">
    English · <a href="./README.zh-CN.md">简体中文</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Skills-13-blue" alt="13 skills" />
    <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js 18+" />
    <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
  </p>
</p>

FunPlay Skill is a game-development skills library for coding agents, focused on reusable workflows for game design, assets, browser-game slices, and engine-specific validation.

## Skills catalog

The repository currently ships these verified skills:

| Category | Skill | Use when | Validation surface |
| --- | --- | --- | --- |
| Asset Processing | `skills/sprite-sheet` | Split a sprite sheet into numbered frame images | `scripts/slice.mjs` plus tests |
| Asset Processing | `skills/normal-map` | Generate a tangent-space normal map from a diffuse texture | `scripts/generate.mjs` plus tests |
| Asset Processing | `skills/audio-format-convert` | Convert audio between `wav`, `ogg`, and `mp3` | `scripts/convert.mjs` plus tests |
| Game Design Workflow | `skills/game-concept-brief` | Turn early game inspiration into a compact GDD-lite / MDA / MVP brief | `scripts/build-brief.mjs` plus tests |
| Game Build Workflow | `skills/playable-game-build-flow` | Guide a small browser game from intent capture to a playable vertical slice | `scripts/validate-pillar.mjs` plus tests |
| UI Asset Workflow | `skills/game-ui-asset-brief` | Produce game UI asset prompts, cutout requirements, and validation checks | `scripts/build-brief.mjs` plus tests |
| Engine Workflow | `skills/unity-mcp-workflow` | Use Funplay Unity MCP for edit, compile, Play Mode, screenshot, hierarchy, and console verification | verified upstream source |
| Cocos Engine | `skills/minigame-subpackage-rules` | Validate WeChat/Douyin minigame subpackage rules | `scripts/validate-minigame-subpackages.mjs` plus tests |
| Cocos Engine | `skills/canvas-page-popup-bootstrap` | Create or validate new Cocos page, popup, or HUD canvas entries | `scripts/validate-canvas-entry.mjs` plus tests |
| Cocos Engine | `skills/canvas-page-popup-removal` | Check blockers before removing existing page or popup canvas nodes | `scripts/check-removal-blockers.mjs` plus tests |
| Cocos Engine | `skills/cocos-ui-node-retrofit` | Classify and plan safe Cocos UI node retrofits | `scripts/classify-retrofit.mjs` plus tests |
| Cocos Engine | `skills/workbench-asset-replace` | Plan safe Workbench asset replacement into Cocos visuals | `scripts/plan-asset-replace.mjs` plus tests |
| Meta Routing | `skills/using-funplay-skills` | Choose the right FunPlay skill for a user goal | repository routing policy |

Use `skills/using-funplay-skills` when the right workflow is unclear.

### Repository Support

- `hooks/`: session-start context injection
- `commands/`: lightweight slash-command wrappers that route users to the right skill
- `docs/skill-spec.md`: canonical skill authoring rules
- `CONTRIBUTING.md`, `CHANGELOG.md`, and `RELEASE_CHECKLIST.md`: contributor and release workflow docs

## Installation

### Claude Code

For local development, start Claude Code from this repository's parent directory, then run:

- `/plugin marketplace add ./<your-checkout-dir>`
- `/plugin install funplay-skill@funplay-skill`

You can also start a one-off session with:

- `claude --plugin-dir /absolute/path/to/<your-checkout-dir>`

### Cursor

Install through Cursor's plugin support from this repository. The Cursor manifest lives at `.cursor-plugin/plugin.json`.

### Codex

Follow `.codex/INSTALL.md`. In short:

- clone this repo
- symlink `skills/` into your agent skills directory
- restart Codex

### OpenCode

Follow `.opencode/INSTALL.md`. In short, add this Git plugin to `opencode.json`:

```json
{
  "plugin": ["funplay-skill@git+https://github.com/FunplayAI/funplay-skill.git"]
}
```

### Gemini CLI

Install the extension from the repository URL. Gemini reads `gemini-extension.json` and `GEMINI.md`.

## Development commands

- `npx pnpm install`: install dependencies
- `npx pnpm test`: run repository tests
- `npx pnpm validate:workspace`: verify required files and folders

CI runs the same test and workspace validation commands.

## Using the skills

### Asset Processing

- `sprite-sheet`: `node skills/sprite-sheet/scripts/slice.mjs <image> <rows> <cols>`
- `normal-map`: `node skills/normal-map/scripts/generate.mjs <image>`
- `audio-format-convert`: `node skills/audio-format-convert/scripts/convert.mjs <input> <format>`

### Game Build Workflow

- `playable-game-build-flow`: guide a small browser game from a one-sentence idea to a playable vertical slice, with the bundled `node <path-to-this-skill>/scripts/validate-pillar.mjs <pillar.md>` for pillar-contract checks

### Game Design Workflow

- `game-concept-brief`: `node skills/game-concept-brief/scripts/build-brief.mjs --prompt "<game idea>"`

### UI Asset Workflow

- `game-ui-asset-brief`: `node skills/game-ui-asset-brief/scripts/build-brief.mjs --style "<art direction>" --asset background --asset button_skin`

### Engine Workflow

- `unity-mcp-workflow`: use when a Unity project is connected to Funplay MCP and needs compile, Play Mode, screenshot, hierarchy, console, or prefab/scene readback verification

### Cocos Engine

- `minigame-subpackage-rules`: `node skills/minigame-subpackage-rules/scripts/validate-minigame-subpackages.mjs profiles/v2/packages/project.json --platform wechatgame`
- `canvas-page-popup-bootstrap`: `node skills/canvas-page-popup-bootstrap/scripts/validate-canvas-entry.mjs canvas/canvas.json page:shop`
- `canvas-page-popup-removal`: `node skills/canvas-page-popup-removal/scripts/check-removal-blockers.mjs canvas/canvas.json popup:coupon`
- `cocos-ui-node-retrofit`: `node skills/cocos-ui-node-retrofit/scripts/classify-retrofit.mjs --intent "<change>" --component cc.Label`
- `workbench-asset-replace`: `node skills/workbench-asset-replace/scripts/plan-asset-replace.mjs --source "<asset>" --target-label GeneratedBackground`

### Meta Routing

- `using-funplay-skills`: ask which verified FunPlay skill should be used for the current goal

## Commands

- `/engine-workflow`: choose the right engine-facing skill before editing project files
- `/engine-safe-edit`: choose the safest engine-facing workflow before asset or scene edits

`audio-format-convert` requires `ffmpeg` in `PATH`. The image skills require the `sharp` dependency installed from this repo.

## Philosophy

- Skills should be deterministic or backed by a verified upstream workflow
- Metadata should tell the agent exactly when and how to use a skill
- Local asset workflows are preferred over remote-service coupling in this repo
- Pure advisory skills without tests, scripts, or upstream verification should stay out until they have a validation surface

## Git remote

The repository is initialized with:

- `origin https://github.com/FunplayAI/funplay-skill.git`
