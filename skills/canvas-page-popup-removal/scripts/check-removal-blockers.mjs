import { readFile } from 'node:fs/promises';

function asCanvas(value) {
  if (typeof value === 'string') return JSON.parse(value);
  return value;
}

export function checkRemovalBlockers(canvasInput, targetId) {
  const canvas = asCanvas(canvasInput);
  const nodes = Array.isArray(canvas.nodes) ? canvas.nodes : [];
  const blockers = [];

  if (!nodes.some((node) => node.id === targetId)) {
    blockers.push({ kind: 'missing_node', detail: `${targetId} does not exist.` });
  }

  for (const node of nodes) {
    if (node.parent_id === targetId) {
      blockers.push({ kind: 'child_node', detail: `${node.id} has parent_id ${targetId}.` });
    }
    if (Array.isArray(node.depends_on) && node.depends_on.includes(targetId)) {
      blockers.push({ kind: 'dependency', detail: `${node.id} depends_on ${targetId}.` });
    }
  }

  if (canvas.flow?.root_node_id === targetId) {
    blockers.push({ kind: 'flow_root', detail: `${targetId} is canvas.flow.root_node_id.` });
  }

  const edges = Array.isArray(canvas.flow?.edges) ? canvas.flow.edges : [];
  const referencingEdges = edges.filter((edge) => edge.from === targetId || edge.to === targetId);

  return {
    canDelete: blockers.length === 0,
    blockers,
    referencingEdges: referencingEdges.length
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [path, targetId] = process.argv.slice(2);
  if (!path || !targetId) {
    console.error('Usage: node <path-to-this-skill>/scripts/check-removal-blockers.mjs <canvas.json> <node-id>');
    process.exit(2);
  }
  try {
    const result = checkRemovalBlockers(await readFile(path, 'utf8'), targetId);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.canDelete ? 0 : 1);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
