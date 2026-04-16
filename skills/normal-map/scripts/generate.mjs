import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

function luminance(data, width, x, y) {
  const clampedX = Math.max(0, Math.min(width - 1, x));
  const index = (y * width + clampedX) * 3;
  return (data[index] + data[index + 1] + data[index + 2]) / (3 * 255);
}

export async function generateNormalMap(inputPath, outputPath, strength = 2) {
  if (!Number.isFinite(strength) || strength <= 0) {
    throw new Error('Strength must be a positive number.');
  }

  const resolvedInput = resolve(inputPath);
  const { data, info } = await sharp(resolvedInput).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const output = Buffer.alloc(info.width * info.height * 3);

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const left = luminance(data, info.width, x - 1, y);
      const right = luminance(data, info.width, x + 1, y);
      const up = luminance(data, info.width, x, Math.max(0, y - 1));
      const down = luminance(data, info.width, x, Math.min(info.height - 1, y + 1));

      const dx = (right - left) * strength;
      const dy = (down - up) * strength;
      const dz = 1;
      const length = Math.hypot(dx, dy, dz) || 1;

      const index = (y * info.width + x) * 3;
      output[index] = Math.round(((dx / length) * 0.5 + 0.5) * 255);
      output[index + 1] = Math.round(((1 - dy / length) * 0.5) * 255);
      output[index + 2] = Math.round(((dz / length) * 0.5 + 0.5) * 255);
    }
  }

  const targetPath =
    outputPath ??
    join(dirname(resolvedInput), `${basename(resolvedInput, extname(resolvedInput))}-normal.png`);

  await sharp(output, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 3
    }
  })
    .png()
    .toFile(targetPath);

  return {
    outputPath: targetPath,
    width: info.width,
    height: info.height
  };
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const [inputPath, strengthRaw, outputPath] = process.argv.slice(2);
  if (!inputPath) {
    console.error('Usage: node skills/normal-map/scripts/generate.mjs <image> [strength] [outputPath]');
    process.exit(1);
  }

  const result = await generateNormalMap(
    inputPath,
    outputPath,
    strengthRaw ? Number(strengthRaw) : 2
  );
  console.log(JSON.stringify(result, null, 2));
}
