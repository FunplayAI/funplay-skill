import { constants } from 'node:fs';
import { access, mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { convertAudio, ensureFfmpeg } from '../skills/audio-format-convert/scripts/convert.mjs';
import { generateNormalMap } from '../skills/normal-map/scripts/generate.mjs';
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
