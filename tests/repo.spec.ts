import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('repo structure', () => {
  it('keeps core plugin files present', () => {
    expect(existsSync('.claude-plugin/plugin.json')).toBe(true);
    expect(existsSync('.cursor-plugin/plugin.json')).toBe(true);
    expect(existsSync('.codex/INSTALL.md')).toBe(true);
    expect(existsSync('.opencode/INSTALL.md')).toBe(true);
    expect(existsSync('.github/pull_request_template.md')).toBe(true);
    expect(existsSync('.github/workflows/ci.yml')).toBe(true);
    expect(existsSync('gemini-extension.json')).toBe(true);
    expect(existsSync('hooks/hooks.json')).toBe(true);
    expect(existsSync('hooks/hooks-cursor.json')).toBe(true);
    expect(existsSync('docs/skill-spec.md')).toBe(true);
    expect(existsSync('CHANGELOG.md')).toBe(true);
    expect(existsSync('CONTRIBUTING.md')).toBe(true);
    expect(existsSync('RELEASE_CHECKLIST.md')).toBe(true);
  });

  it('declares the funplay-skill plugin name', () => {
    const plugin = JSON.parse(readFileSync('.claude-plugin/plugin.json', 'utf8'));
    expect(plugin.name).toBe('funplay-skill');
    expect(plugin.skills).toBe('./skills/');
    expect(plugin.commands).toBe('./commands/');
    expect(plugin.mcpServers).toBeUndefined();
  });

  it('declares matching cursor and gemini adapters', () => {
    const cursor = JSON.parse(readFileSync('.cursor-plugin/plugin.json', 'utf8'));
    const gemini = JSON.parse(readFileSync('gemini-extension.json', 'utf8'));

    expect(cursor.name).toBe('funplay-skill');
    expect(cursor.skills).toBe('./skills/');
    expect(cursor.commands).toBe('./commands/');
    expect(gemini.name).toBe('funplay-skill');
    expect(gemini.contextFileName).toBe('GEMINI.md');
  });

  it('ships command wrappers and engine-oriented skills', () => {
    expect(existsSync('commands/brainstorm-game.md')).toBe(true);
    expect(existsSync('commands/write-game-plan.md')).toBe(true);
    expect(existsSync('commands/review-level.md')).toBe(true);
    expect(existsSync('commands/engine-workflow.md')).toBe(true);
    expect(existsSync('commands/prototype-loop.md')).toBe(true);
    expect(existsSync('commands/review-encounter.md')).toBe(true);
    expect(existsSync('commands/engine-safe-edit.md')).toBe(true);
    expect(existsSync('skills/unity-mcp-workflow/SKILL.md')).toBe(true);
    expect(existsSync('skills/unity-prefab-workflow/SKILL.md')).toBe(true);
    expect(existsSync('skills/godot-scene-assembly/SKILL.md')).toBe(true);
    expect(existsSync('skills/cocos-component-workflow/SKILL.md')).toBe(true);
    expect(existsSync('skills/texture-atlas/SKILL.md')).toBe(true);
    expect(existsSync('skills/ui-slicing-checklist/SKILL.md')).toBe(true);
    expect(existsSync('skills/game-audio-polish/SKILL.md')).toBe(true);
  });

  it('keeps every skill documented with complete metadata', () => {
    const readme = readFileSync('README.md', 'utf8');
    const requiredKeys = ['name', 'description', 'dependencies', 'inputs', 'outputs', 'examples'];
    const skillDirs = readdirSync('skills', { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const skillName of skillDirs) {
      const skillPath = join('skills', skillName, 'SKILL.md');
      expect(existsSync(skillPath), `${skillPath} should exist`).toBe(true);

      const text = readFileSync(skillPath, 'utf8');
      const frontmatterMatch = text.match(/^---\n([\s\S]*?)\n---\n/);
      expect(frontmatterMatch, `${skillPath} should have frontmatter`).not.toBeNull();

      const frontmatter = frontmatterMatch?.[1] ?? '';
      for (const key of requiredKeys) {
        expect(frontmatter, `${skillPath} should include ${key}`).toMatch(new RegExp(`^${key}:`, 'm'));
      }

      const declaredName = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');
      expect(declaredName).toBe(skillName);
      expect(readme, `README.md should list skills/${skillName}`).toContain(`skills/${skillName}`);
    }
  });
});
