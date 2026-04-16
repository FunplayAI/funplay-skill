# Installing FunPlay Skill for Codex

FunPlay Skill works with Codex through native skill discovery. Clone the repository and symlink its `skills/` directory into your agent skills folder.

## Prerequisites

- Git
- Codex CLI

## Installation

```bash
git clone https://github.com/FunplayAI/funplay-skill.git ~/.codex/funplay-skill
mkdir -p ~/.agents/skills
ln -s ~/.codex/funplay-skill/skills ~/.agents/skills/funplay-skill
```

Then restart Codex so it can discover the skills.

## Verify

```bash
ls -la ~/.agents/skills/funplay-skill
```

You should see a symlink pointing to the repository's `skills/` directory.

## Update

```bash
cd ~/.codex/funplay-skill
git pull
```

The skill symlink updates immediately after pulling.

## Uninstall

```bash
rm ~/.agents/skills/funplay-skill
rm -rf ~/.codex/funplay-skill
```

