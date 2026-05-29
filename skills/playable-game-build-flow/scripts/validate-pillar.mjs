import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

const requiredHeadings = [
  'Intent',
  'Core Fun',
  'Pillars',
  'Core Loop',
  'Art Direction',
  'Modules'
];

function countBullets(sectionText) {
  return sectionText
    .split(/\r?\n/)
    .filter((line) => /^\s*[-*]\s+/.test(line))
    .length;
}

function sectionAfter(text, heading) {
  const pattern = new RegExp(`^##\\s+${heading}\\s*$([\\s\\S]*?)(?=^##\\s+|(?![\\s\\S]))`, 'im');
  return text.match(pattern)?.[1] ?? '';
}

export function validatePillarContract(text, options = {}) {
  const minLines = options.minLines ?? 35;
  const maxLines = options.maxLines ?? 140;
  const errors = [];
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (!/^#\s+.+\s+-\s+Pillar Contract\s*$/m.test(text)) {
    errors.push('Missing title shaped like "# Game Name - Pillar Contract".');
  }

  if (lines.length < minLines || lines.length > maxLines) {
    errors.push(`Expected ${minLines}-${maxLines} non-empty lines, found ${lines.length}.`);
  }

  for (const heading of requiredHeadings) {
    if (!new RegExp(`^##\\s+${heading}\\s*$`, 'im').test(text)) {
      errors.push(`Missing required section: ${heading}.`);
    }
  }

  const intentBullets = countBullets(sectionAfter(text, 'Intent'));
  if (intentBullets < 3 || intentBullets > 8) {
    errors.push(`Intent should contain 3-8 bullets, found ${intentBullets}.`);
  }

  const coreLoopBullets = countBullets(sectionAfter(text, 'Core Loop'));
  if (coreLoopBullets < 4 || coreLoopBullets > 6) {
    errors.push(`Core Loop should contain 4-6 bullets, found ${coreLoopBullets}.`);
  }

  const pillarHeadings = (sectionAfter(text, 'Pillars').match(/^###\s+\S+/gm) ?? []).length;
  if (pillarHeadings < 2 || pillarHeadings > 4) {
    errors.push(`Pillars should contain 2-4 subsections, found ${pillarHeadings}.`);
  }

  const moduleText = sectionAfter(text, 'Modules');
  const moduleHeadings = (moduleText.match(/^###\s+[a-z0-9]+(?:-[a-z0-9]+)*\s*$/gm) ?? []).length;
  if (moduleHeadings < 2 || moduleHeadings > 4) {
    errors.push(`Modules should contain 2-4 kebab-case subsections, found ${moduleHeadings}.`);
  }

  if (!/Carries:/i.test(moduleText)) {
    errors.push('Modules should include Carries notes.');
  }
  if (!/Watch-out:/i.test(moduleText)) {
    errors.push('Modules should include Watch-out notes.');
  }

  return {
    ok: errors.length === 0,
    errors,
    stats: {
      nonEmptyLines: lines.length,
      intentBullets,
      coreLoopBullets,
      pillarHeadings,
      moduleHeadings
    }
  };
}

export async function validatePillarFile(path, options = {}) {
  const text = await readFile(path, 'utf8');
  return {
    file: basename(path),
    ...validatePillarContract(text, options)
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node skills/playable-game-build-flow/scripts/validate-pillar.mjs <pillar.md>');
    process.exit(2);
  }

  try {
    const result = await validatePillarFile(path);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 1);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
