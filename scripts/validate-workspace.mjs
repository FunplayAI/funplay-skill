import { existsSync } from 'node:fs';

const requiredPaths = [
  '.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  'hooks/hooks.json',
  'hooks/session-start',
  'docs/skill-spec.md',
  'skills/sprite-sheet/SKILL.md',
  'skills/normal-map/SKILL.md',
  'skills/audio-format-convert/SKILL.md',
  'skills/texture-atlas/SKILL.md',
  'skills/ui-slicing-checklist/SKILL.md',
  'skills/game-audio-polish/SKILL.md',
  'skills/using-funplay-skills/SKILL.md',
  'skills/gameplay-prototyping/SKILL.md',
  'skills/level-design-review/SKILL.md',
  'skills/unity-prefab-workflow/SKILL.md',
  'skills/godot-scene-assembly/SKILL.md',
  'skills/cocos-component-workflow/SKILL.md',
  'commands/README.md',
  'commands/brainstorm-game.md',
  'commands/write-game-plan.md',
  'commands/review-level.md',
  'commands/engine-workflow.md',
  'commands/prototype-loop.md',
  'commands/review-encounter.md',
  'commands/engine-safe-edit.md',
  'agents/README.md'
];

const missing = requiredPaths.filter((path) => !existsSync(path));

if (missing.length > 0) {
  console.error('Missing required paths:');
  for (const path of missing) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

console.log('FunPlay Skill workspace structure looks good.');
