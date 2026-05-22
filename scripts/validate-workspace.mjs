import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const requiredPaths = [
  '.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  '.cursor-plugin/plugin.json',
  '.codex/INSTALL.md',
  '.gitignore',
  '.github/pull_request_template.md',
  '.github/workflows/ci.yml',
  '.opencode/INSTALL.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'gemini-extension.json',
  'GEMINI.md',
  'hooks/hooks.json',
  'hooks/hooks-cursor.json',
  'hooks/session-start',
  'docs/README.codex.md',
  'docs/README.opencode.md',
  'docs/skill-spec.md',
  'RELEASE_CHECKLIST.md',
  'skills/sprite-sheet/SKILL.md',
  'skills/normal-map/SKILL.md',
  'skills/audio-format-convert/SKILL.md',
  'skills/using-funplay-skills/SKILL.md',
  'skills/unity-mcp-workflow/SKILL.md',
  'commands/README.md',
  'commands/engine-workflow.md',
  'commands/engine-safe-edit.md',
  'agents/README.md'
];

const verifiedUpstreamSkills = new Set(['unity-mcp-workflow']);
const metaSkills = new Set(['using-funplay-skills']);

const errors = [];
const missing = requiredPaths.filter((path) => !existsSync(path));
const forbiddenNames = new Set(['.DS_Store']);
const forbiddenDirs = new Set(['Library', 'Temp', 'temp', 'tmp', '.idea']);

if (missing.length > 0) {
  for (const path of missing) {
    errors.push(`Missing required path: ${path}`);
  }
}

const skillsRoot = 'skills';
const readme = existsSync('README.md') ? readFileSync('README.md', 'utf8') : '';
const skillTests = existsSync('tests/skills.spec.ts') ? readFileSync('tests/skills.spec.ts', 'utf8') : '';
const frontmatterKeys = ['name', 'description', 'dependencies', 'inputs', 'outputs', 'examples'];

if (existsSync(skillsRoot)) {
  for (const entry of readdirSync(skillsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const skillName = entry.name;
    const skillPath = join(skillsRoot, skillName, 'SKILL.md');

    if (!existsSync(skillPath)) {
      errors.push(`Missing skill file: ${skillPath}`);
      continue;
    }

    const text = readFileSync(skillPath, 'utf8');
    const frontmatterMatch = text.match(/^---\n([\s\S]*?)\n---\n/);
    if (!frontmatterMatch) {
      errors.push(`${skillPath} is missing YAML frontmatter`);
      continue;
    }

    const frontmatter = frontmatterMatch[1];
    for (const key of frontmatterKeys) {
      if (!new RegExp(`^${key}:`, 'm').test(frontmatter)) {
        errors.push(`${skillPath} frontmatter is missing ${key}`);
      }
    }

    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    const declaredName = nameMatch?.[1]?.trim().replace(/^["']|["']$/g, '');
    if (declaredName !== skillName) {
      errors.push(`${skillPath} declares name "${declaredName}" but directory is "${skillName}"`);
    }

    if (!readme.includes(`skills/${skillName}`)) {
      errors.push(`README.md does not list skills/${skillName}`);
    }

    const hasScripts = existsSync(join(skillsRoot, skillName, 'scripts'));
    const hasScriptTests = skillTests.includes(`../skills/${skillName}/`);
    const hasUpstreamSource = text.includes('Source') && text.includes('FunplayAI/funplay-unity-mcp');
    const passesValidationGate =
      (hasScripts && hasScriptTests) ||
      (verifiedUpstreamSkills.has(skillName) && hasUpstreamSource) ||
      metaSkills.has(skillName);

    if (!passesValidationGate) {
      errors.push(
        `${skillPath} is not validated: add scripts plus tests, verified upstream source metadata, or mark it as a meta skill`
      );
    }
  }
}

function collectJunkPaths(root) {
  if (!existsSync(root)) {
    return [];
  }

  const junk = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (path.includes(`${join('', 'node_modules')}/`) || path === 'node_modules') {
        continue;
      }
      if (forbiddenNames.has(entry.name) || (entry.isDirectory() && forbiddenDirs.has(entry.name))) {
        junk.push(path);
        continue;
      }
      if (entry.isDirectory() && entry.name !== '.git') {
        visit(path);
      }
    }
  };
  visit(root);
  return junk;
}

for (const path of collectJunkPaths('.')) {
  errors.push(`Repository contains local junk path: ${path}`);
}

if (errors.length > 0) {
  console.error('FunPlay Skill workspace validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('FunPlay Skill workspace structure looks good.');
