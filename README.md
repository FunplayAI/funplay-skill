# FunPlay Skill

FunPlay Skill is a game-development skills library for coding agents, inspired by `obra/superpowers` but focused on art, audio, engine workflows, and asset-processing instead of MCP servers.

## What this repository is

- A multi-agent skills library for game-development workflows
- A Claude Code / Cursor plugin with native skills, commands, and hooks
- A Codex, OpenCode, and Gemini compatible repository with install guides
- A collection of local asset-processing workflows under `skills/`
- A lightweight plugin shell with adapters, hooks, commands, docs, and tests

## What is inside

- `skills/sprite-sheet`: split one sprite sheet into numbered frame images
- `skills/normal-map`: generate a normal map from a diffuse texture
- `skills/audio-format-convert`: convert audio between `wav`, `ogg`, and `mp3`
- `skills/texture-atlas`: plan atlas packing, naming, and manifest output for UI or 2D art
- `skills/ui-slicing-checklist`: review UI sprites for slicing, nine-patch, and export readiness
- `skills/game-audio-polish`: review game audio assets for loudness, looping, and implementation readiness
- `skills/using-funplay-skills`: onboarding and usage guidance for the library
- `skills/gameplay-prototyping`: turn a rough game idea into a prototype-ready spec
- `skills/level-design-review`: review flow, readability, and encounter pacing
- `skills/unity-mcp-workflow`: use Funplay Unity MCP as the edit, compile, Play Mode, screenshot, and readback loop
- `skills/unity-prefab-workflow`: safely edit Unity prefabs, scenes, and serialized assets
- `skills/godot-scene-assembly`: structure Godot scenes and resources cleanly
- `skills/cocos-component-workflow`: organize Cocos Creator prefabs, scripts, and assets
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

- `sprite-sheet`: `node skills/sprite-sheet/scripts/slice.mjs <image> <rows> <cols>`
- `normal-map`: `node skills/normal-map/scripts/generate.mjs <image>`
- `audio-format-convert`: `node skills/audio-format-convert/scripts/convert.mjs <input> <format>`
- `texture-atlas`: ask the agent to plan how sprites should be grouped, padded, and named in an atlas
- `ui-slicing-checklist`: ask the agent to review UI exports before engine import
- `game-audio-polish`: ask the agent to review SFX or music for loudness, loop quality, and implementation concerns
- `gameplay-prototyping`: ask the agent to turn a game idea into a shippable prototype plan
- `level-design-review`: ask the agent to critique level goals, player guidance, and combat/readability loops
- `unity-mcp-workflow`: use when a Unity project is connected to Funplay MCP and needs compile, Play Mode, screenshot, hierarchy, console, or prefab/scene readback verification
- `unity-prefab-workflow`: use when touching Unity YAML assets, prefabs, or scenes
- `godot-scene-assembly`: use when organizing Godot `.tscn`, nodes, and exported resources
- `cocos-component-workflow`: use when editing Cocos Creator prefabs, components, and asset references

## Commands

- `/brainstorm-game`: route a rough idea into `gameplay-prototyping`
- `/write-game-plan`: turn an approved concept into implementation tasks
- `/review-level`: route a level layout or encounter review into `level-design-review`
- `/engine-workflow`: choose the right engine-facing skill before editing project files
- `/prototype-loop`: tighten a gameplay loop into a prototype slice
- `/review-encounter`: critique a combat, puzzle, or traversal encounter
- `/engine-safe-edit`: choose the safest engine-facing workflow before asset or scene edits

`audio-format-convert` requires `ffmpeg` in `PATH`. The image skills require the `sharp` dependency installed from this repo.

## Philosophy

- Skills should be deterministic and easy for an agent to compose
- Metadata should tell the agent exactly when and how to use a skill
- Local asset workflows are preferred over remote-service coupling in this repo

## Git remote

The repository is initialized with:

- `origin https://github.com/FunplayAI/funplay-skill.git`
