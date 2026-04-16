import { spawn, spawnSync } from 'node:child_process';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SUPPORTED_FORMATS = new Set(['wav', 'ogg', 'mp3']);

export function ensureFfmpeg() {
  const result = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  if (result.error || result.status !== 0) {
    throw new Error('ffmpeg is required but was not found in PATH.');
  }
}

export async function convertAudio(inputPath, targetFormat, outputPath) {
  const format = targetFormat.toLowerCase();
  if (!SUPPORTED_FORMATS.has(format)) {
    throw new Error(`Unsupported target format: ${targetFormat}`);
  }

  ensureFfmpeg();

  const resolvedInput = resolve(inputPath);
  const targetPath =
    outputPath ??
    join(dirname(resolvedInput), `${basename(resolvedInput, extname(resolvedInput))}.${format}`);

  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(
      'ffmpeg',
      ['-y', '-i', resolvedInput, targetPath],
      {
        stdio: ['ignore', 'ignore', 'pipe']
      }
    );

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', rejectPromise);
    child.on('close', (code) => {
      if (code === 0) {
        resolvePromise(undefined);
      } else {
        rejectPromise(new Error(stderr.trim() || `ffmpeg exited with code ${code}`));
      }
    });
  });

  return {
    outputPath: targetPath,
    format
  };
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const [inputPath, targetFormat, outputPath] = process.argv.slice(2);
  if (!inputPath || !targetFormat) {
    console.error('Usage: node skills/audio-format-convert/scripts/convert.mjs <input> <format> [outputPath]');
    process.exit(1);
  }

  const result = await convertAudio(inputPath, targetFormat, outputPath);
  console.log(JSON.stringify(result, null, 2));
}
