# Repository Guidelines

## Project Structure & Module Organization
`funplay-skill` is a skills-first repository. Keep reusable workflows under `skills/<skill-name>/`, with `SKILL.md` required and `scripts/` optional when automation is needed. Shared docs live in `docs/`, plugin metadata in `.claude-plugin/`, hooks in `hooks/`, and tests in `tests/`.

## Build, Test, and Development Commands
- `npx pnpm install` installs local dependencies such as `sharp` and `vitest`
- `npx pnpm test` runs the repository test suite
- `npx pnpm validate:workspace` checks that required plugin, docs, and skill files exist

Document any new workflow command in `README.md`.

## Coding Style & Naming Conventions
- Use 2 spaces for JSON, YAML, Markdown, and JavaScript indentation
- Prefer `kebab-case` for skill directories and filenames
- Keep scripts small, deterministic, and focused on one workflow
- Write skill docs in direct, instructional language with explicit inputs and outputs

## Testing Guidelines
Add tests for any non-trivial script behavior. Keep tests close to the workflow they verify and cover both success paths and common failure cases. If a skill depends on a system binary such as `ffmpeg`, tests should handle the missing-tool case clearly.

## Commit & Pull Request Guidelines
Use short imperative commit subjects, for example `Add texture atlas skill`. PRs should include a concise summary, test evidence, and sample input/output when a skill changes user-visible asset processing behavior.
