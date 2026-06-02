# FunPlay Skill

FunPlay Skill is a game-development skills library for coding agents, inspired by `obra/superpowers` but focused on art, audio, engine workflows, and asset-processing instead of MCP servers.

## What this repository is

- A verified multi-agent skills library for game-development workflows
- A Claude Code / Cursor plugin with native skills, commands, and hooks
- A Codex, OpenCode, and Gemini compatible repository with install guides
- A collection of local asset-processing workflows under `skills/`
- A lightweight plugin shell with adapters, hooks, commands, docs, and tests

## What is inside

### Asset Processing

- `skills/sprite-sheet`: split one sprite sheet into numbered frame images
- `skills/normal-map`: generate a normal map from a diffuse texture
- `skills/audio-format-convert`: convert audio between `wav`, `ogg`, and `mp3`

### Game Build Workflow

- `skills/playable-game-build-flow`: guide a small browser game from intent capture to a playable vertical slice

### Game Design Workflow

- `skills/game-concept-brief`: turn early game inspiration into a compact GDD-lite concept brief

### UI Asset Workflow

- `skills/game-ui-asset-brief`: produce game UI asset prompts, cutout requirements, and validation checks

### Engine Workflow

- `skills/unity-mcp-workflow`: use Funplay Unity MCP as the edit, compile, Play Mode, screenshot, and readback loop

### Cocos Engine

- `skills/minigame-subpackage-rules`: validate WeChat/Douyin minigame subpackage rules
- `skills/canvas-page-popup-bootstrap`: validate and guide new Cocos page, popup, or HUD canvas entries
- `skills/canvas-page-popup-removal`: check blockers before removing page or popup canvas nodes
- `skills/cocos-ui-node-retrofit`: classify and plan safe Cocos UI node retrofits
- `skills/workbench-asset-replace`: plan safe Workbench asset replacement into Cocos visuals

### Meta Routing

- `skills/using-funplay-skills`: onboarding and usage guidance for the library

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
