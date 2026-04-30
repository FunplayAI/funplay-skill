# Contributing to FunPlay Skill

FunPlay Skill is a skills-first game-development workflow library for coding agents.

Contributions that improve reliable agent workflows, local asset processing, engine-specific guidance, documentation, and validation are welcome.

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/FunplayAI/funplay-skill.git
cd funplay-skill
```

2. Install dependencies:

```bash
npx pnpm install
```

3. Run the test and validation suite:

```bash
npx pnpm test
npx pnpm validate:workspace
```

## Project Structure

```text
skills/                 Reusable agent skills, one directory per skill
skills/*/SKILL.md       Required skill instruction document
skills/*/scripts/       Optional deterministic workflow scripts
commands/               Thin command wrappers that route to skills
docs/                   Skill authoring and platform installation docs
hooks/                  Session-start context hooks
tests/                  Vitest coverage for scripts and repository structure
```

## Adding a Skill

1. Create `skills/<kebab-case-name>/SKILL.md`.
2. Include frontmatter keys required by `docs/skill-spec.md`: `name`, `description`, `dependencies`, `inputs`, `outputs`, and `examples`.
3. Keep the `name` value identical to the skill directory name.
4. Add scripts under `skills/<skill-name>/scripts/` only when automation is useful and deterministic.
5. Add tests for non-trivial script behavior.
6. Update `README.md` so the new skill is discoverable.
7. Run `npx pnpm test` and `npx pnpm validate:workspace`.

## Workflow Guidelines

- Write skills for agent consumption first: direct, explicit, and action-oriented.
- Keep commands short; put workflow rules in skills.
- Prefer local deterministic workflows over remote services.
- Keep generated output, local app state, and scratch files out of the repository.
- Update `CHANGELOG.md` when user-visible behavior or contributor workflow changes.

## Pull Requests

A useful pull request includes:

- A concise summary of the change
- Test and validation evidence
- Sample input/output when a skill changes asset processing behavior
- Any dependency notes for system tools such as `ffmpeg`

## License

By contributing, you agree that your contributions will be licensed under the MIT License used by this repository.
