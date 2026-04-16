# Installing FunPlay Skill for OpenCode

Add FunPlay Skill to the `plugin` array in your global or project-level `opencode.json`.

```json
{
  "plugin": ["funplay-skill@git+https://github.com/FunplayAI/funplay-skill.git"]
}
```

Restart OpenCode. The plugin should install and expose the repository skills.

## Verify

Ask OpenCode to list available skills, then load a skill such as:

```text
use skill tool to list skills
use skill tool to load funplay-skill/gameplay-prototyping
```

## Update

OpenCode updates Git plugins on restart. Pin a version by adding a tag:

```json
{
  "plugin": ["funplay-skill@git+https://github.com/FunplayAI/funplay-skill.git#v0.1.0"]
}
```

