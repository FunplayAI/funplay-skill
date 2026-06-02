const defaultAssets = ['background', 'logo', 'button_skin', 'panel', 'hud_badge', 'reward_icon'];

function compact(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function roleForAsset(asset) {
  const lowered = asset.toLowerCase();
  if (lowered.includes('background') || lowered.includes('scene')) return 'background';
  if (lowered.includes('logo') || lowered.includes('title')) return 'game_logo';
  if (lowered.includes('button')) return 'button_wide';
  if (lowered.includes('panel') || lowered.includes('frame')) return 'panel';
  if (lowered.includes('icon') || lowered.includes('badge') || lowered.includes('coin') || lowered.includes('reward')) return 'ui_icon';
  return 'foreground';
}

function cutoutRequired(role) {
  return !['background'].includes(role);
}

function buildPrompt(asset, role, style, size) {
  const shared = `Style: ${style}. Production-ready game UI asset, crisp silhouette, readable at small size.`;
  if (role === 'background') {
    return `Create a full-screen game background for ${asset}. ${shared} Target size/aspect: ${size}. No UI text, no buttons, leave safe central space for gameplay or foreground UI.`;
  }
  if (role === 'game_logo') {
    return `Create a readable game logo/title treatment for ${asset}. ${shared} Isolated logo on pure white #ffffff background for cutout. No extra poster scene.`;
  }
  if (role === 'button_wide') {
    return `Create a reusable wide game button skin for ${asset}. ${shared} Horizontal 3:1 button shape, no baked text, pure white #ffffff background for cutout, full shape visible with padding.`;
  }
  return `Create one isolated ${asset} UI asset. ${shared} Pure white #ffffff background for cutout, full shape visible with padding, no baked text unless the asset name requires it.`;
}

export function buildUiAssetBrief(options = {}) {
  const prompt = compact(options.prompt);
  const style = compact(options.style) || 'cohesive polished mobile game UI, readable shapes, consistent color and lighting';
  const size = compact(options.size) || 'current game canvas';
  const assets = (options.assets?.length ? options.assets : defaultAssets).map(compact).filter(Boolean);

  const assetBriefs = assets.map((asset) => {
    const role = roleForAsset(asset);
    return {
      asset,
      role,
      cutoutRequired: cutoutRequired(role),
      generationPrompt: buildPrompt(asset, role, style, size),
      outputHint: cutoutRequired(role) ? 'transparent PNG after cutout' : 'opaque full-screen PNG',
      validation: cutoutRequired(role)
        ? ['subject is visible', 'transparent background after cutout', 'not cropped', 'no opaque white box']
        : ['fills target aspect', 'no UI text', 'safe area left for foreground UI']
    };
  });

  return {
    status: 'ok',
    skill: 'game-ui-asset-brief',
    prompt,
    style,
    size,
    assets: assetBriefs,
    workflow: [
      'generate each asset from the prompt',
      'cut out foreground assets to transparent PNG',
      'split sheets only when the asset brief requests multiple states',
      'import outputs into the target project or design tool',
      'verify visibility, sizing, and alpha before using the assets in game'
    ]
  };
}

function parseArgs(argv) {
  const options = { assets: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--prompt') options.prompt = argv[++index];
    else if (arg === '--style') options.style = argv[++index];
    else if (arg === '--size') options.size = argv[++index];
    else if (arg === '--asset') options.assets.push(argv[++index]);
  }
  return options;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(buildUiAssetBrief(parseArgs(process.argv.slice(2))), null, 2));
}
