# FunPlay Skill

- This repository is a skills-only Claude Code plugin for game-development workflows.
- Prefer `npx pnpm` when `pnpm` is not installed globally.
- Run `npx pnpm test` and `npx pnpm validate:workspace` after changing skills, hooks, or plugin metadata.
- Keep this repository free of MCP servers; new capabilities should usually land as skills under `skills/`.
- Prefer command wrappers in `commands/` to point users toward the appropriate skill instead of embedding large workflows in the command itself.
