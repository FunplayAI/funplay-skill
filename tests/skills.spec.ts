import { constants } from 'node:fs';
import { access, mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { convertAudio, ensureFfmpeg } from '../skills/audio-format-convert/scripts/convert.mjs';
import { generateNormalMap } from '../skills/normal-map/scripts/generate.mjs';
import { validatePillarContract } from '../skills/playable-game-build-flow/scripts/validate-pillar.mjs';
import { sliceSpriteSheet } from '../skills/sprite-sheet/scripts/slice.mjs';

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
