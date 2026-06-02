import { readFile } from 'node:fs/promises';

const platforms = ['wechatgame', 'bytedance-mini-game'];

function normalizeRoot(root) {
  const value = String(root ?? '').trim();
  if (value.startsWith('db://')) return value;
  if (value.startsWith('assets/')) return `db://${value}`;
  return value;
}

function isValidRoot(root) {
  return /^db:\/\/assets\/.+/.test(normalizeRoot(root));
}

export function validateMinigameSubpackagesConfig(config, options = {}) {
  const platform = options.platform ?? 'wechatgame';
  const requireGroups = Boolean(options.requireGroups);
  const errors = [];
  const warnings = [];
  const subpackages = config?.minigameSubpackages;

  if (!subpackages || typeof subpackages !== 'object') {
    errors.push('Missing minigameSubpackages in profiles/v2/packages/project.json.');
    return { ok: false, errors, warnings, stats: { platform, groupCount: 0 } };
  }

  for (const key of platforms) {
    if (!subpackages[key] || !Array.isArray(subpackages[key].groups)) {
      errors.push(`Missing minigameSubpackages.${key}.groups array.`);
    }
  }

  const groups = subpackages[platform]?.groups;
  if (!Array.isArray(groups)) {
    errors.push(`Selected platform ${platform} has no groups array.`);
    return { ok: false, errors, warnings, stats: { platform, groupCount: 0 } };
  }

  if (groups.length === 0) {
    const message = `${platform} has the default template but no configured subpackage groups.`;
    if (requireGroups) errors.push(message);
    else warnings.push(message);
  }

  groups.forEach((group, index) => {
    if (!group || typeof group !== 'object') {
      errors.push(`${platform}.groups[${index}] must be an object.`);
      return;
    }
    if (!group.root) {
      errors.push(`${platform}.groups[${index}] is missing root.`);
    } else if (!isValidRoot(group.root)) {
      errors.push(`${platform}.groups[${index}].root must point under assets/.`);
    }
    if (group.name !== undefined && !/^[a-zA-Z0-9_-]+$/.test(String(group.name))) {
      errors.push(`${platform}.groups[${index}].name should be stable ASCII slug text.`);
    }
  });

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: { platform, groupCount: groups.length }
  };
}

function parseArgs(argv) {
  const options = { path: 'profiles/v2/packages/project.json' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--platform') options.platform = argv[++index];
    else if (arg === '--require-groups') options.requireGroups = true;
    else if (!arg.startsWith('--')) options.path = arg;
  }
  return options;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs(process.argv.slice(2));
  try {
    const config = JSON.parse(await readFile(options.path, 'utf8'));
    const result = validateMinigameSubpackagesConfig(config, options);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 1);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
