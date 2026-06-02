import { readFile } from 'node:fs/promises';

function asCanvas(value) {
  if (typeof value === 'string') return JSON.parse(value);
  return value;
}

export function validateCanvasEntry(canvasInput, nodeId) {
  const canvas = asCanvas(canvasInput);
  const errors = [];
  const warnings = [];

  if (canvas.version !== 'v0') {
    warnings.push('canvas.version should be "v0".');
  }
  if (!Array.isArray(canvas.nodes)) {
    return { ok: false, errors: ['canvas.nodes must be an array.'], warnings };
  }

  const node = canvas.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) {
    return { ok: false, errors: [`Missing canvas node ${nodeId}.`], warnings };
  }

  if (!['page', 'popup', 'hud'].includes(node.type)) {
    errors.push('node.type must be page, popup, or hud.');
  }
  if (!node.title) {
    errors.push('node.title is required.');
  }
  if (!node.pos || typeof node.pos.x !== 'number' || typeof node.pos.y !== 'number') {
    errors.push('node.pos.x and node.pos.y are required numbers.');
  }
  if (['page', 'popup', 'hud'].includes(node.type) && !node.entry) {
    errors.push('node.entry is required for page, popup, and hud nodes.');
  }
  if (node.type === 'popup' && !node.parent_id) {
    errors.push('popup nodes should declare parent_id.');
  }
  if (node.entry && /__studio_runtime__|assets\/main\.scene/.test(node.entry)) {
    errors.push('node.entry must point to the authored page/popup/HUD source, not a runtime scene.');
  }

  return { ok: errors.length === 0, errors, warnings, node };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [path, nodeId] = process.argv.slice(2);
  if (!path || !nodeId) {
    console.error('Usage: node <path-to-this-skill>/scripts/validate-canvas-entry.mjs <canvas.json> <node-id>');
    process.exit(2);
  }
  try {
    const result = validateCanvasEntry(await readFile(path, 'utf8'), nodeId);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 1);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
