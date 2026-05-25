import sharp from 'sharp';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';

const CONCURRENCY = 4;

/**
 * 递归查找目录下匹配扩展名的文件
 */
async function findFiles(dir, extensions) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await findFiles(fullPath, extensions));
    } else if (extensions.includes(extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * 转换单张图片为 AVIF 和 WebP
 */
async function convertImage(file, outputDir) {
  const inputBuffer = await readFile(file);
  const originalSize = inputBuffer.length;
  const relativePath = relative(outputDir, file);

  const [avifBuffer, webpBuffer] = await Promise.all([
    sharp(inputBuffer)
      .avif({ quality: 65, effort: 6, chromaSubsampling: '4:2:0' })
      .toBuffer(),
    sharp(inputBuffer)
      .webp({ quality: 75 })
      .toBuffer(),
  ]);

  await Promise.all([
    writeFile(file.replace(/\.[^.]+$/, '.avif'), avifBuffer),
    writeFile(file.replace(/\.[^.]+$/, '.webp'), webpBuffer),
  ]);

  const avifSaved = originalSize - avifBuffer.length;
  const avifReduction = ((avifSaved / originalSize) * 100).toFixed(1);
  const webpSaved = originalSize - webpBuffer.length;
  const webpReduction = ((webpSaved / originalSize) * 100).toFixed(1);
  const totalSaved = avifSaved + webpSaved;

  console.log(
    `  ${relativePath} → AVIF (${(originalSize / 1024).toFixed(1)}KB → ${(avifBuffer.length / 1024).toFixed(1)}KB, -${avifReduction}%) | WebP (-${webpReduction}%)`
  );

  return { converted: 1, totalSaved };
}

/**
 * 分批并发执行
 */
async function runWithConcurrency(tasks, limit) {
  const results = [];
  for (let i = 0; i < tasks.length; i += limit) {
    const batch = tasks.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map((task) => task()));
    results.push(...batchResults);
  }
  return results;
}

/**
 * Astro 集成：构建后将 dist 目录中的 JPG/PNG 图片转换为 AVIF 和 WebP 格式。
 * 配合 remark-picture 插件生成的 <picture> 标签使用，
 * 浏览器会按 AVIF → WebP → 原始格式的优先级加载图片。
 */
export function convertToAvif() {
  return {
    name: 'convert-to-avif',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outputDir = new URL('.', dir).pathname.replace(/^\/([A-Z]:)/, '$1');
        const imageExtensions = ['.jpg', '.jpeg', '.png'];

        const files = await findFiles(outputDir, imageExtensions);

        if (files.length === 0) {
          console.log('[convert-images] 没有找到需要转换的图片');
          return;
        }

        console.log(`[convert-images] 找到 ${files.length} 张图片，并发 ${CONCURRENCY}，开始转换...`);

        const tasks = files.map((file) => () => convertImage(file, outputDir));
        const results = await runWithConcurrency(tasks, CONCURRENCY);

        const totalConverted = results.reduce((sum, r) => sum + r.converted, 0);
        const totalSaved = results.reduce((sum, r) => sum + r.totalSaved, 0);

        console.log(
          `[convert-images] 完成！转换 ${totalConverted} 张图片，共节省 ${(totalSaved / 1024).toFixed(1)}KB`
        );
      },
    },
  };
}
