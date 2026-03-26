// scripts/generateManifestBase64.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { manifest } from '../src/objects/Manifest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Функция для конвертации файла в Base64
function fileToBase64(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const buffer = fs.readFileSync(filePath);

  // Для json просто строка
  if (ext === '.json' || ext === '.atlas') {
    return `data:text/plain;base64,${buffer.toString('base64')}`;
  }

  // Для изображений
  if (ext === '.png') {
    return `data:image/png;base64,${buffer.toString('base64')}`;
  }
  if (ext === '.webp') {
    return `data:image/webp;base64,${buffer.toString('base64')}`;
  }

  throw new Error('Неизвестный тип файла: ' + filePath);
}

// Создаём новый манифест
const manifestBase64 = {
  bundles: manifest.bundles.map(bundle => ({
    name: bundle.name,
    assets: bundle.assets.map(asset => {
      const srcPath = path.resolve(__dirname, '../public', asset.src);
      if (!fs.existsSync(srcPath)) {
        console.warn('Файл не найден:', srcPath);
        return asset;
      }
      return {
        alias: asset.alias,
        src: fileToBase64(srcPath),
      };
    }),
  })),
};

// Сохраняем в файл для продакшна
const outPath = path.resolve(__dirname, '../src/manifestBase64.js');
fs.writeFileSync(
  outPath,
  'export const manifestBase64 = ' + JSON.stringify(manifestBase64, null, 2) + ';'
);

console.log('✅ manifestBase64 сгенерирован в', outPath);
