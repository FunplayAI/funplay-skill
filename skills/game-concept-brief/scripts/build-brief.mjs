const genreHints = [
  ['match', 'match puzzle'],
  ['merge', 'merge puzzle'],
  ['idle', 'idle progression'],
  ['rogue', 'roguelite'],
  ['runner', 'runner'],
  ['tower', 'tower defense'],
  ['card', 'card battler'],
  ['farm', 'cozy farming'],
  ['shooter', 'shooter'],
  ['platform', 'platformer']
];

const platformHints = [
  ['mobile', 'mobile'],
  ['web', 'web'],
  ['browser', 'web'],
  ['wechat', 'WeChat mini-game'],
  ['douyin', 'Douyin mini-game'],
  ['steam', 'PC / Steam'],
  ['pc', 'PC']
];

function compact(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function inferFromHints(prompt, hints, fallback) {
  const lowered = prompt.toLowerCase();
  const match = hints.find(([needle]) => lowered.includes(needle));
  return match?.[1] ?? fallback;
}

function inferTitle(prompt) {
  const named = prompt.match(/(?:title|name)\s*[:=]\s*([^.;\n]+)/i)?.[1];
  if (named) {
    return compact(named).slice(0, 80);
  }
  const shortPrompt = compact(prompt);
  if (shortPrompt && shortPrompt.length <= 40) {
    return shortPrompt;
  }
  return 'Untitled Game Concept';
}

function inferStyle(prompt, explicitStyle = '') {
  if (compact(explicitStyle)) {
    return compact(explicitStyle);
  }
  const styleHint = prompt.match(/(?:style|art style|visual)\s*[:=]\s*([^.;\n]+)/i)?.[1];
  if (styleHint) {
    return compact(styleHint);
  }
  return 'cohesive, readable, polished game art direction to be decided';
}

export function buildConceptBrief(options = {}) {
  const prompt = compact(options.prompt);
  const title = compact(options.title) || inferTitle(prompt);
  const platform = compact(options.platform) || inferFromHints(prompt, platformHints, 'web or mobile, to be decided');
  const genre = compact(options.genre) || inferFromHints(prompt, genreHints, 'game concept, to be decided');
  const style = inferStyle(prompt, options.style);
  const documentPath = compact(options.output) || 'design/gdd/game-concept.md';

  const focusQuestions = [
    {
      id: 'creative_north_star',
      question: 'What should the player remember after the first minute?',
      defines: ['player_feeling', 'fantasy', 'signature_moment']
    },
    {
      id: 'core_loop',
      question: `What does the player do every 10-30 seconds in this ${genre}?`,
      defines: ['main_verbs', 'short_loop', 'success_feedback', 'failure_state']
    },
    {
      id: 'mvp_boundary',
      question: `What is the smallest first playable for ${platform}, and what is explicitly out of scope?`,
      defines: ['must_have', 'non_goals', 'first_playable_acceptance']
    },
    {
      id: 'visual_identity_anchor',
      question: 'What one-line visual rule should every screen and asset obey?',
      defines: ['visual_rule', 'references', 'anti_references', 'color_philosophy']
    }
  ];

  const readinessGates = [
    'Creative north star is concrete enough to make tradeoffs.',
    '10-30 second core loop is testable.',
    'MVP must-haves and non-goals are separated.',
    'Visual identity anchor includes references or anti-references.',
    'First playable acceptance criteria can be verified by playtest.'
  ];

  const markdownTemplate = `# ${title}

## One-Line Pitch
TODO

## Source Inspiration
${prompt || 'TODO'}

## Creative North Star
- Player feeling: TODO
- Fantasy: TODO
- Signature first-minute moment: TODO
- Taste boundary / anti-reference: TODO

## Product Frame
- Platform: ${platform}
- Genre: ${genre}
- Visual Direction: ${style}
- Target Player: TODO

## Pillars
- TODO
- TODO
- TODO

## Core Loop
1. TODO: Player action
2. TODO: System response
3. TODO: Reward, pressure, or consequence
4. TODO: Next decision

## MDA Analysis
- Mechanics: TODO
- Dynamics: TODO
- Aesthetics: TODO

## MVP Scope
### Must Have
- TODO

### Non-Goals
- TODO

## Acceptance Criteria For First Playable
- A player can complete the core loop without written instructions.
- The signature moment can happen within the first minute.
- The main feedback/reward moment is visible and understandable.

## Risks
- TODO

## Implementation Handoff
- Suggested engine/runtime: TODO
- Required assets: TODO
- Verification path: TODO
`;

  return {
    status: 'ok',
    skill: 'game-concept-brief',
    inferred: { title, platform, genre, visualDirection: style },
    documentPath,
    focusQuestions,
    readinessGates,
    documentSections: [
      'One-Line Pitch',
      'Source Inspiration',
      'Creative North Star',
      'Product Frame',
      'Pillars',
      'Core Loop',
      'MDA Analysis',
      'MVP Scope',
      'Acceptance Criteria For First Playable',
      'Risks',
      'Implementation Handoff'
    ],
    markdownTemplate
  };
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--prompt') options.prompt = argv[++index];
    else if (arg === '--title') options.title = argv[++index];
    else if (arg === '--platform') options.platform = argv[++index];
    else if (arg === '--genre') options.genre = argv[++index];
    else if (arg === '--style') options.style = argv[++index];
    else if (arg === '--output') options.output = argv[++index];
  }
  return options;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(buildConceptBrief(parseArgs(process.argv.slice(2))), null, 2));
}
