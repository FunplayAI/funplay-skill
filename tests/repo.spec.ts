import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('repo structure', () => {
  it('keeps core plugin files present', () => {
    expect(existsSync('.claude-plugin/plugin.json')).toBe(true);
    expect(existsSync('hooks/hooks.json')).toBe(true);
    expect(existsSync('docs/skill-spec.md')).toBe(true);
  });

  it('declares the funplay-skill plugin name', () => {
    const plugin = JSON.parse(readFileSync('.claude-plugin/plugin.json', 'utf8'));
    expect(plugin.name).toBe('funplay-skill');
    expect(plugin.skills).toBe('./skills/');
    expect(plugin.mcpServers).toBeUndefined();
  });

  it('ships command wrappers and engine-oriented skills', () => {
    expect(existsSync('commands/brainstorm-game.md')).toBe(true);
    expect(existsSync('commands/write-game-plan.md')).toBe(true);
    expect(existsSync('commands/review-level.md')).toBe(true);
    expect(existsSync('commands/engine-workflow.md')).toBe(true);
    expect(existsSync('commands/prototype-loop.md')).toBe(true);
    expect(existsSync('commands/review-encounter.md')).toBe(true);
    expect(existsSync('commands/engine-safe-edit.md')).toBe(true);
    expect(existsSync('skills/unity-prefab-workflow/SKILL.md')).toBe(true);
    expect(existsSync('skills/godot-scene-assembly/SKILL.md')).toBe(true);
    expect(existsSync('skills/cocos-component-workflow/SKILL.md')).toBe(true);
    expect(existsSync('skills/texture-atlas/SKILL.md')).toBe(true);
    expect(existsSync('skills/ui-slicing-checklist/SKILL.md')).toBe(true);
    expect(existsSync('skills/game-audio-polish/SKILL.md')).toBe(true);
  });
});
