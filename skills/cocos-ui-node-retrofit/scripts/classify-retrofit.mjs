function compact(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function componentSet(components = []) {
  return new Set(components.map((component) => String(component).toLowerCase()));
}

export function classifyRetrofitIntent(options = {}) {
  const intent = compact(options.intent).toLowerCase();
  const components = componentSet(options.components);
  const hasSprite = components.has('cc.sprite');
  const hasLabel = components.has('cc.label');
  const hasButton = components.has('cc.button');
  const sourceAsset = compact(options.sourceAsset);
  const actionable = Boolean(options.actionable) || /button|click|tap|press|start|replay/.test(intent);

  let classification = 'property-edit';
  if (sourceAsset && hasSprite && !/overlay|label|text-to-image|image-backed/.test(intent)) {
    classification = 'resource-swap';
  } else if (sourceAsset || /image-backed|overlay|icon|button skin|replace.*label|text-to-image/.test(intent)) {
    classification = 'structure-retrofit';
  }

  const requiredProof = [
    'canonical authored target resolved',
    'no raw prefab or scene JSON hand edit',
    'save and reload proof collected'
  ];
  if (classification === 'structure-retrofit') {
    requiredProof.push('target owns visible body Sprite', 'overlay text or icon is a child node');
  }
  if (actionable || hasButton) {
    requiredProof.push('Button component, hit size, feedback, and handler are verified');
  }
  if (sourceAsset) {
    requiredProof.push('asset import and SpriteFrame binding are verified on the real target');
  }

  return {
    classification,
    actionable,
    hasSprite,
    hasLabel,
    hasButton,
    recommendedShape: classification === 'structure-retrofit'
      ? ['TargetNode: UITransform + Sprite + optional Button', 'LabelOverlay child: Label or Sprite']
      : ['keep existing node structure'],
    requiredProof
  };
}

function parseArgs(argv) {
  const options = { components: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--intent') options.intent = argv[++index];
    else if (arg === '--component') options.components.push(argv[++index]);
    else if (arg === '--source-asset') options.sourceAsset = argv[++index];
    else if (arg === '--actionable') options.actionable = true;
  }
  return options;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(classifyRetrofitIntent(parseArgs(process.argv.slice(2))), null, 2));
}
