// scripts/convertManifestAndJsonToBase64.js
import fs from 'fs';
import path from 'path';
import { manifest } from '../src/objects/Manifest.js';

const PUBLIC_DIR = path.resolve('./public');

// Конвертация файла изображения в Base64
function fileToBase64(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Файл не найден: ${filePath}`);
  const ext = path.extname(filePath).toLowerCase();
  if (!['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) {
    throw new Error(`Поддерживаются только изображения: ${filePath}`);
  }
  const mimeType = ext === '.webp' ? 'image/webp' :
                   ext === '.png'  ? 'image/png' :
                   'image/jpeg';
  const data = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${data.toString('base64')}`;
}

// Обрабатываем JSON: заменяем meta.image и skeleton.images на Base64
function processJson(asset) {
  const jsonPath = path.join(PUBLIC_DIR, asset.src);
  if (!fs.existsSync(jsonPath)) {
    console.warn(`⚠️ JSON не найден: ${jsonPath}`);
    return;
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const jsonData = JSON.parse(raw);

  // TexturePacker: meta.image
  if (jsonData.meta && jsonData.meta.image) {
    const imagePath = path.join(path.dirname(jsonPath), jsonData.meta.image);
    if (fs.existsSync(imagePath)) {
      jsonData.meta.image = fileToBase64(imagePath);
      console.log(`✅ ${asset.alias} meta.image → Base64`);
    }
  }

  // Spine: skeleton.images
  if (jsonData.skeleton && jsonData.skeleton.images) {
    const imagesPath = path.join(path.dirname(jsonPath), jsonData.skeleton.images);
    if (fs.existsSync(imagesPath) && fs.statSync(imagesPath).isDirectory()) {
      const files = fs.readdirSync(imagesPath).filter(f => /\.(webp|png|jpg|jpeg)$/.test(f));
      const imagesObj = {};
      files.forEach(f => {
        imagesObj[f] = fileToBase64(path.join(imagesPath, f));
      });
      jsonData.skeleton.images = imagesObj;
      console.log(`✅ ${asset.alias} skeleton.images → Base64`);
    } else if (fs.existsSync(imagesPath)) {
      jsonData.skeleton.images = fileToBase64(imagesPath);
      console.log(`✅ ${asset.alias} skeleton.images → Base64`);
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');
}

// Проходим по манифесту
manifest.bundles.forEach(bundle => {
  bundle.assets.forEach(asset => {
    const assetPath = path.join(PUBLIC_DIR, asset.src);

    if (!fs.existsSync(assetPath)) {
      console.warn(`⚠️ Файл не найден: ${asset.src}`);
      return;
    }

    // Если это картинка — меняем src на Base64
    if (/\.(webp|png|jpg|jpeg)$/.test(asset.src)) {
      asset.src = fileToBase64(assetPath);
      console.log(`📦 ${asset.alias} src → Base64`);
    }

    // Если JSON — обрабатываем изображения внутри
    else if (asset.src.endsWith('.json')) {
      processJson(asset);
    }
  });
});

// Перезаписываем исходный манифест
const manifestPath = path.resolve('./src/objects/Manifest.js');
fs.writeFileSync(
  manifestPath,
  `// Auto-updated manifest with Base64 images\nexport const manifest = ${JSON.stringify(manifest, null, 2)};\n`,
  'utf-8'
);

console.log('\n✅ Все вебп и JSON обработаны. Манифест перезаписан.');
