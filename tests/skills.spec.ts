import { constants } from 'node:fs';
import { access, mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { convertAudio, ensureFfmpeg } from '../skills/audio-format-convert/scripts/convert.mjs';
import { validateCanvasEntry } from '../skills/canvas-page-popup-bootstrap/scripts/validate-canvas-entry.mjs';
import { checkRemovalBlockers } from '../skills/canvas-page-popup-removal/scripts/check-removal-blockers.mjs';
import { classifyRetrofitIntent } from '../skills/cocos-ui-node-retrofit/scripts/classify-retrofit.mjs';
import { validateCommercialPlan } from '../skills/commercial-unity-game/scripts/validate-commercial-plan.mjs';
import { buildConceptBrief } from '../skills/game-concept-brief/scripts/build-brief.mjs';
import { buildUiAssetBrief } from '../skills/game-ui-asset-brief/scripts/build-brief.mjs';
import { validateMinigameSubpackagesConfig } from '../skills/minigame-subpackage-rules/scripts/validate-minigame-subpackages.mjs';
import { generateNormalMap } from '../skills/normal-map/scripts/generate.mjs';
import { validatePillarContract } from '../skills/playable-game-build-flow/scripts/validate-pillar.mjs';
import { sliceSpriteSheet } from '../skills/sprite-sheet/scripts/slice.mjs';
import { planAssetReplacement } from '../skills/workbench-asset-replace/scripts/plan-asset-replace.mjs';

async function createSpriteSheet(tempDir) {
  const source = join(tempDir, 'sheet.png');
  await sharp({
    create: {
      width: 16,
      height: 16,
      channels: 3,
      background: '#000000'
    }
  })
    .png()
    .toFile(source);
  return source;
}

describe('sprite-sheet skill', () => {
  it('slices a sheet into numbered frames', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'funplay-sprite-'));
    const source = await createSpriteSheet(tempDir);

    const result = await sliceSpriteSheet(source, 2, 2);
    expect(result.files).toHaveLength(4);
  });
});

describe('normal-map skill', () => {
  it('creates a png normal map', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'funplay-normal-'));
    const source = await createSpriteSheet(tempDir);

    const result = await generateNormalMap(source);
    await access(result.outputPath, constants.F_OK);
    expect(result.outputPath.endsWith('.png')).toBe(true);
  });
});

describe('audio-format-convert skill', () => {
  it('reports a clear error when ffmpeg is unavailable', async () => {
    const ffmpegAvailable = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;
    if (!ffmpegAvailable) {
      expect(() => ensureFfmpeg()).toThrow(/ffmpeg/);
      return;
    }

    const tempDir = await mkdtemp(join(tmpdir(), 'funplay-audio-'));
    const inputPath = join(tempDir, 'tone.wav');
    const outputPath = join(tempDir, 'tone.mp3');

    const makeWave = spawnSync(
      'ffmpeg',
      ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1', inputPath],
      { stdio: 'ignore' }
    );
    expect(makeWave.status).toBe(0);

    const result = await convertAudio(inputPath, 'mp3', outputPath);
    await access(result.outputPath, constants.F_OK);
    expect(result.format).toBe('mp3');
  });
});

describe('playable-game-build-flow skill', () => {
  it('validates a pillar contract shape', () => {
    const pillar = `# Meteor Dash - Pillar Contract

## Intent
- Dodge fast falling hazards with one-touch movement.
- Chase score streaks that tempt risky routes.
- Keep each run readable within the first second.

## Core Fun
Threading through danger should feel immediate and fair.
The player should always see why a run was lost.

## Pillars
### tight-loop
Runs restart quickly and the next interesting choice appears immediately.
Every input should produce visible movement.

### readable-chaos
Hazards can overlap, but their lanes and timing stay legible.
No hit should feel like it came from nowhere.

### score-pressure
Score pickups pull the player toward danger without requiring them.
The safest route should not always be the highest scoring route.

## Core Loop
- Read the next hazard pattern.
- Move through the safest lane.
- Detour for score pickups when the gap is tempting.
- Survive long enough for speed to rise.
- Lose, understand why, and restart.

## Art Direction
Use PixiJS by default because the brief is a fast 2D arcade slice.
Use bright hazard silhouettes on a dark spacefield.

## Modules
### player-control
- Carries: movement, input smoothing, and boundary limits.
- Watch-out: overcomplicated physics can make dodging feel unfair.

### encounter-pressure
- Carries: hazard spawning, speed ramp, and collision pressure.
- Watch-out: random overlap can create impossible lanes.

### scoring-feedback
- Carries: pickup placement, score streaks, and restart feedback.
- Watch-out: score UI can crowd the playfield on small screens.
`;

    expect(validatePillarContract(pillar).ok).toBe(true);
  });

  it('rejects an underspecified pillar contract', () => {
    const result = validatePillarContract(`# Tiny - Pillar Contract

## Intent
- Be fun.

## Core Fun
Fun.
`);

    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('game-concept-brief skill', () => {
  it('builds a concept brief with creative and playable gates', () => {
    const result = buildConceptBrief({
      prompt: 'a browser game about protecting a lamp in heavy rain',
      platform: 'web',
      style: 'rainy paper-cut fantasy'
    });

    expect(result.status).toBe('ok');
    expect(result.inferred.platform).toBe('web');
    expect(result.markdownTemplate).toContain('Creative North Star');
    expect(result.readinessGates).toContain('10-30 second core loop is testable.');
  });
});

describe('commercial-unity-game skill', () => {
  it('validates a commercial Unity production plan', () => {
    const plan = `# Rainforge Puzzle - Commercial Unity Plan

## Core Loop
Players clear weather tiles, earn coins, and choose whether to spend boosters before the next board.

## Architecture
Use a Unity framework with controllers, models, panels, a typed event bus, and shared services.

## Bootstrap
GameInit owns the initialization order for storage, content, economy, audio, analytics, and UI routing.

## Save And Persistence
Player level, coin balance, inventory, settings, timers, and tutorial flags use Property<T> and Storage.

## Data-Driven Content Pipeline
Levels, shop products, reward curves, and chapter unlocks import from CSV or JSON into ScriptableObject assets.

## Economy And Currency
Coins, boosters, sources, sinks, reward curve tuning, and late-game rounding are defined in config.

## Monetization IAP Shop
The shop catalog stores product ids, localized price display, purchase grant rules, and restore behavior.

## Retention And Meta Progression
Daily login, streaks, offline reward, and chapter meta-progression give returning players a reason to come back.

## Asset Pipeline And Audio
Art direction, UI assets, SFX, BGM, reward juice, particles, and sprite import rules are planned together.

## Analytics And Remote Config
Telemetry covers first session, economy, retention, and stability while remote config tunes economy and feature flags.

## Unity MCP Verification
Use Funplay MCP to compile, enter Play Mode, inspect console output, capture screenshots, and read back scene state.

## Risks And Readiness
IAP sandbox, SDK integration, store policy, privacy prompts, and device performance remain manual validation gates.
`;

    const result = validateCommercialPlan(plan);
    expect(result.ok).toBe(true);
    expect(result.stats.gateCount).toBe(result.stats.requiredGateCount);
  });

  it('rejects a prototype-only Unity note', () => {
    const result = validateCommercialPlan(`# Tap Blocks

## Core Loop
Tap blocks and score points.
`);

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('economy'))).toBe(true);
  });
});

describe('game-ui-asset-brief skill', () => {
  it('marks foreground UI for cutout and backgrounds as full-screen assets', () => {
    const result = buildUiAssetBrief({
      style: 'rainy cozy fantasy UI',
      assets: ['background', 'button_skin']
    });

    const background = result.assets.find((asset) => asset.asset === 'background');
    const button = result.assets.find((asset) => asset.asset === 'button_skin');

    expect(background?.cutoutRequired).toBe(false);
    expect(button?.role).toBe('button_wide');
    expect(button?.cutoutRequired).toBe(true);
  });
});

describe('minigame-subpackage-rules skill', () => {
  it('validates configured minigame subpackage groups', () => {
    const result = validateMinigameSubpackagesConfig({
      minigameSubpackages: {
        wechatgame: { groups: [{ name: 'battle', root: 'db://assets/bundles/battle' }] },
        'bytedance-mini-game': { groups: [] }
      }
    }, { platform: 'wechatgame', requireGroups: true });

    expect(result.ok).toBe(true);
    expect(result.stats.groupCount).toBe(1);
  });

  it('distinguishes empty template from missing template', () => {
    const result = validateMinigameSubpackagesConfig({
      minigameSubpackages: {
        wechatgame: { groups: [] },
        'bytedance-mini-game': { groups: [] }
      }
    }, { platform: 'wechatgame' });

    expect(result.ok).toBe(true);
    expect(result.warnings[0]).toContain('default template');
  });
});

describe('cocos engine workflow skills', () => {
  const canvas = {
    version: 'v0',
    nodes: [
      { id: 'page:home', type: 'page', title: 'Home', pos: { x: 0, y: 0 }, entry: 'assets/ui/pages/home/home.prefab' },
      { id: 'popup:coupon', type: 'popup', title: 'Coupon', pos: { x: 240, y: 0 }, entry: 'assets/ui/popups/coupon/coupon.prefab', parent_id: 'page:home' }
    ],
    flow: {
      root_node_id: 'page:home',
      edges: [{ from: 'page:home', to: 'popup:coupon', kind: 'opens_popup' }]
    }
  };

  it('validates canonical page and popup entries', () => {
    expect(validateCanvasEntry(canvas, 'page:home').ok).toBe(true);

    const bad = validateCanvasEntry({
      version: 'v0',
      nodes: [{ id: 'page:bad', type: 'page', title: 'Bad', pos: { x: 0, y: 0 }, entry: 'assets/main.scene' }]
    }, 'page:bad');
    expect(bad.ok).toBe(false);
    expect(bad.errors[0]).toContain('authored');
  });

  it('reports removal blockers before canvas node deletion', () => {
    const blocked = checkRemovalBlockers(canvas, 'page:home');
    expect(blocked.canDelete).toBe(false);
    expect(blocked.blockers.map((blocker) => blocker.kind)).toContain('child_node');
    expect(blocked.blockers.map((blocker) => blocker.kind)).toContain('flow_root');

    const removable = checkRemovalBlockers(canvas, 'popup:coupon');
    expect(removable.canDelete).toBe(true);
    expect(removable.referencingEdges).toBe(1);
  });

  it('classifies Cocos UI retrofit intent', () => {
    const result = classifyRetrofitIntent({
      intent: 'replace label with image-backed start button',
      components: ['cc.Label'],
      sourceAsset: 'assets/ui/start.png',
      actionable: true
    });

    expect(result.classification).toBe('structure-retrofit');
    expect(result.recommendedShape[0]).toContain('Sprite');
    expect(result.requiredProof.join(' ')).toContain('Button');
  });

  it('plans Workbench asset replacement for generated and static targets', () => {
    const runtime = planAssetReplacement({
      source: 'workbench://asset/123',
      targetLabel: 'GeneratedBackground'
    });
    expect(runtime.targetKind).toBe('runtime-generated-slot');

    const staticTarget = planAssetReplacement({
      source: 'workbench://asset/456',
      targetLabel: 'Canvas/Home/StartButton',
      hasStaticSprite: true
    });
    expect(staticTarget.targetKind).toBe('static-sprite-node');
  });
});
