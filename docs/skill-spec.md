# FunPlay Skill Specification

Every skill lives in its own directory under `skills/` and must include a `SKILL.md`. If the workflow needs runnable code, add it under `scripts/`.

## Required frontmatter

```yaml
---
name: sprite-sheet
description: Slice a sprite sheet into single-frame images.
dependencies:
  - sharp
inputs:
  - image path
  - rows
  - columns
outputs:
  - output directory
examples:
  - node skills/sprite-sheet/scripts/slice.mjs ./sheet.png 4 4
---
```

## Authoring rules

- Write for agent consumption first: short, direct, explicit instructions.
- Describe when to use the skill, not just what the script does.
- List runtime dependencies, including system tools such as `ffmpeg`.
- Document accepted input formats, produced outputs, and common failure cases.
- Keep scripts deterministic so repeated runs generate predictable filenames.
- Include at least one runnable example command.
- Prefer local processing flows over external service dependencies in this repository.

