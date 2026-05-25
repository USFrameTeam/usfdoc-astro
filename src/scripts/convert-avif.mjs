import sharp from 'sharp';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';

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

        console.log(`[convert-images] 找到 ${files.length} 张图片，开始转换...`);

        let converted = 0;
        let totalSaved = 0;

        for (const file of files) {
          try {
            const inputBuffer = await readFile(file);
            const originalSize = inputBuffer.length;
            const relativePath = relative(outputDir, file);

            // 生成 AVIF
            const avifPath = file.replace(/\.[^.]+$/, '.avif');
            const avifBuffer = await sharp(inputBuffer)
              .avif({ quality: 65, effort: 6, chromaSubsampling: '4:2:0' })
              .toBuffer();
            await writeFile(avifPath, avifBuffer);

            const avifSaved = originalSize - avifBuffer.length;
            const avifReduction = ((avifSaved / originalSize) * 100).toFixed(1);
            console.log(
              `  ${relativePath} → AVIF (${(originalSize / 1024).toFixed(1)}KB → ${(avifBuffer.length / 1024).toFixed(1)}KB, -${avifReduction}%)`
            );

            // 生成 WebP
            const webpPath = file.replace(/\.[^.]+$/, '.webp');
            const webpBuffer = await sharp(inputBuffer)
              .webp({ quality: 75 })
              .toBuffer();
            await writeFile(webpPath, webpBuffer);

            const webpSaved = originalSize - webpBuffer.length;
            const webpReduction = ((webpSaved / originalSize) * 100).toFixed(1);
            console.log(
              `  ${relativePath} → WebP (${(originalSize / 1024).toFixed(1)}KB → ${(webpBuffer.length / 1024).toFixed(1)}KB, -${webpReduction}%)`
            );

            totalSaved += avifSaved + webpSaved;
            converted++;
          } catch (err) {
            console.error(`  [错误] 转换失败: ${file}`, err.message);
          }
        }

        console.log(
          `[convert-images] 完成！转换 ${converted} 张图片（AVIF + WebP），共节省 ${(totalSaved / 1024).toFixed(1)}KB`
        );
      },
    },
  };
}
