import { mkdir } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export async function sliceSpriteSheet(inputPath, rows, columns, outputDir) {
  if (!Number.isInteger(rows) || rows <= 0 || !Number.isInteger(columns) || columns <= 0) {
    throw new Error('Rows and columns must be positive integers.');
  }

  const resolvedInput = resolve(inputPath);
  const image = sharp(resolvedInput);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Could not read image dimensions.');
  }
  if (metadata.width % columns !== 0 || metadata.height % rows !== 0) {
    throw new Error('Image dimensions must divide evenly by rows and columns.');
  }

  const frameWidth = metadata.width / columns;
  const frameHeight = metadata.height / rows;
  const defaultOutputDir = join(dirname(resolvedInput), `${basename(resolvedInput, extname(resolvedInput))}-frames`);
  const resolvedOutputDir = resolve(outputDir ?? defaultOutputDir);

  await mkdir(resolvedOutputDir, { recursive: true });

  const files = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const filename = `${basename(resolvedInput, extname(resolvedInput))}_r${String(row).padStart(2, '0')}_c${String(column).padStart(2, '0')}.png`;
      const targetPath = join(resolvedOutputDir, filename);
      await image
        .clone()
        .extract({
          left: column * frameWidth,
          top: row * frameHeight,
          width: frameWidth,
          height: frameHeight
        })
        .png()
        .toFile(targetPath);
      files.push(targetPath);
    }
  }

  return {
    outputDir: resolvedOutputDir,
    frameWidth,
    frameHeight,
    files
  };
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const [inputPath, rowsRaw, columnsRaw, outputDir] = process.argv.slice(2);
  if (!inputPath || !rowsRaw || !columnsRaw) {
    console.error('Usage: node skills/sprite-sheet/scripts/slice.mjs <image> <rows> <columns> [outputDir]');
    process.exit(1);
  }

  const result = await sliceSpriteSheet(inputPath, Number(rowsRaw), Number(columnsRaw), outputDir);
  console.log(JSON.stringify(result, null, 2));
}
