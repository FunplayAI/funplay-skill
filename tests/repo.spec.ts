import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('repo structure', () => {
  it('keeps core plugin files present', () => {
    expect(existsSync('.claude-plugin/plugin.json')).toBe(true);
    expect(existsSync('.cursor-plugin/plugin.json')).toBe(true);
    expect(existsSync('.codex/INSTALL.md')).toBe(true);
    expect(existsSync('.gitignore')).toBe(true);
    expect(existsSync('.opencode/INSTALL.md')).toBe(true);
    expect(existsSync('.github/pull_request_template.md')).toBe(true);
    expect(existsSync('.github/workflows/ci.yml')).toBe(true);
    expect(existsSync('gemini-extension.json')).toBe(true);
    expect(existsSync('hooks/hooks.json')).toBe(true);
    expect(existsSync('hooks/hooks-cursor.json')).toBe(true);
    expect(existsSync('docs/skill-spec.md')).toBe(true);
    expect(existsSync('README.zh-CN.md')).toBe(true);
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
    expect(existsSync('commands/engine-workflow.md')).toBe(true);
    expect(existsSync('commands/engine-safe-edit.md')).toBe(true);
    expect(existsSync('skills/unity-mcp-workflow/SKILL.md')).toBe(true);
  });

  it('keeps every skill documented with complete metadata', () => {
    const readme = readFileSync('README.md', 'utf8');
    const zhReadme = readFileSync('README.zh-CN.md', 'utf8');
    const requiredKeys = ['name', 'description', 'category', 'dependencies', 'inputs', 'outputs', 'examples'];
    const allowedCategories = new Set([
      'asset-processing',
      'cocos-engine',
      'game-build-workflow',
      'game-design-workflow',
      'engine-workflow',
      'meta-routing',
      'ui-asset-workflow'
    ]);
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
      const declaredCategory = frontmatter.match(/^category:\s*(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');
      expect(declaredName).toBe(skillName);
      expect(allowedCategories.has(declaredCategory ?? '')).toBe(true);
      expect(readme, `README.md should list skills/${skillName}`).toContain(`skills/${skillName}`);
      expect(zhReadme, `README.zh-CN.md should list skills/${skillName}`).toContain(`skills/${skillName}`);
    }
  });

  it('links English and Chinese READMEs', () => {
    const readme = readFileSync('README.md', 'utf8');
    const zhReadme = readFileSync('README.zh-CN.md', 'utf8');

    expect(readme).toContain('README.zh-CN.md');
    expect(zhReadme).toContain('README.md');
    expect(readme).toContain('Skills catalog');
    expect(zhReadme).toContain('Skills 目录');
  });

  it('keeps skill categories stable', () => {
    const expectedCategories = {
      'audio-format-convert': 'asset-processing',
      'canvas-page-popup-bootstrap': 'cocos-engine',
      'canvas-page-popup-removal': 'cocos-engine',
      'cocos-ui-node-retrofit': 'cocos-engine',
      'game-concept-brief': 'game-design-workflow',
      'game-ui-asset-brief': 'ui-asset-workflow',
      'minigame-subpackage-rules': 'cocos-engine',
      'normal-map': 'asset-processing',
      'playable-game-build-flow': 'game-build-workflow',
      'sprite-sheet': 'asset-processing',
      'unity-mcp-workflow': 'engine-workflow',
      'using-funplay-skills': 'meta-routing',
      'workbench-asset-replace': 'cocos-engine'
    };

    for (const [skillName, category] of Object.entries(expectedCategories)) {
      const text = readFileSync(join('skills', skillName, 'SKILL.md'), 'utf8');
      expect(text).toMatch(new RegExp(`^category:\\s+${category}$`, 'm'));
    }
  });

  it('requires structured intent capture when available', () => {
    const text = readFileSync('skills/playable-game-build-flow/SKILL.md', 'utf8');
    expect(text).toContain('ask_user');
    expect(text).toContain('ask_user_question');
    expect(text).toContain('request_user_input');
    expect(text).toContain('use that tool for this phase');
    expect(text).toContain('Keep follow-up questions rare');
  });

  it('documents bundled validator path handling', () => {
    const text = readFileSync('skills/playable-game-build-flow/SKILL.md', 'utf8');
    expect(text).toContain('bundled with this skill');
    expect(text).toContain('Do not assume');
    expect(text).toContain('<path-to-this-skill>/scripts/validate-pillar.mjs');
    expect(text).toContain('script was not run');
  });

  it('ships only validated skills', () => {
    const expectedSkillDirs = [
      'audio-format-convert',
      'canvas-page-popup-bootstrap',
      'canvas-page-popup-removal',
      'cocos-ui-node-retrofit',
      'game-concept-brief',
      'game-ui-asset-brief',
      'minigame-subpackage-rules',
      'normal-map',
      'playable-game-build-flow',
      'sprite-sheet',
      'unity-mcp-workflow',
      'using-funplay-skills',
      'workbench-asset-replace'
    ];
    const actualSkillDirs = readdirSync('skills', { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(actualSkillDirs).toEqual(expectedSkillDirs);

    const skillTests = readFileSync('tests/skills.spec.ts', 'utf8');
    for (const skillName of [
      'audio-format-convert',
      'canvas-page-popup-bootstrap',
      'canvas-page-popup-removal',
      'cocos-ui-node-retrofit',
      'game-concept-brief',
      'game-ui-asset-brief',
      'minigame-subpackage-rules',
      'normal-map',
      'playable-game-build-flow',
      'sprite-sheet',
      'workbench-asset-replace'
    ]) {
      expect(existsSync(join('skills', skillName, 'scripts')), `${skillName} should have scripts`).toBe(true);
      expect(skillTests, `${skillName} should have script tests`).toContain(`../skills/${skillName}/`);
    }

    const unitySkill = readFileSync('skills/unity-mcp-workflow/SKILL.md', 'utf8');
    expect(unitySkill).toContain('FunplayAI/funplay-unity-mcp');
    expect(unitySkill).toContain('3ef233a8a86eb03a281873b778d79bbfb1e3e899');
  });
});
