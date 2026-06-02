function compact(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

export function planAssetReplacement(options = {}) {
  const targetLabel = compact(options.targetLabel);
  const source = compact(options.source);
  const hasStaticSprite = Boolean(options.hasStaticSprite);
  const targetExists = options.targetExists !== false;
  const generatedTarget = /Generated|Runtime|RuntimeRoot/.test(targetLabel);

  let targetKind = 'unknown';
  if (targetExists && hasStaticSprite && !generatedTarget) {
    targetKind = 'static-sprite-node';
  } else if (generatedTarget || !targetExists) {
    targetKind = 'runtime-generated-slot';
  }

  const steps = ['materialize or resolve the Workbench source asset'];
  if (targetKind === 'static-sprite-node') {
    steps.push('import asset into Cocos project', 'bind SpriteFrame to the existing Sprite component', 'verify UITransform display bounds when requested');
  } else if (targetKind === 'runtime-generated-slot') {
    steps.push('search runtime code for target slot name', 'map slot to an assets/resources key', 'replace the consumed resource file without creating duplicate nodes');
  } else {
    steps.push('inspect static target and runtime code before mutating');
  }

  return {
    targetKind,
    source,
    targetLabel,
    steps,
    proofChecklist: [
      'Workbench source item and intrinsic size recorded',
      'Workbench canvas bounds recorded when available',
      'Cocos project asset path reported',
      'static versus runtime-generated target classification reported',
      'asset import or runtime resource replacement proof reported'
    ]
  };
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--source') options.source = argv[++index];
    else if (arg === '--target-label') options.targetLabel = argv[++index];
    else if (arg === '--static-sprite') options.hasStaticSprite = true;
    else if (arg === '--missing-target') options.targetExists = false;
  }
  return options;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(planAssetReplacement(parseArgs(process.argv.slice(2))), null, 2));
}
