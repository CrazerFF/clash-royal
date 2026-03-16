import fs from 'fs';
import path from 'path';

// Папка с исходными JSON и спрайтами
const folder = './public/assets/sprites';

// Конфигурация масштабов
const scales = [
  { suffix: '', scale: 1 },
  { suffix: '@0.5x', scale: 0.5 },
  { suffix: '@0.333x', scale: 0.333 }
];

function scaleFrame(frame, factor) {
  return {
    x: Math.round(frame.x * factor),
    y: Math.round(frame.y * factor),
    w: Math.round(frame.w * factor),
    h: Math.round(frame.h * factor)
  };
}

function scaleSize(size, factor) {
  return {
    w: Math.round(size.w * factor),
    h: Math.round(size.h * factor)
  };
}

// Проходим по JSON файлам в папке
const files = fs.readdirSync(folder).filter(f => f.endsWith('.json'));

for (const file of files) {
  const filePath = path.join(folder, file);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  scales.forEach(({ suffix, scale }) => {
    if (scale === 1) return; // исходник оставляем без изменений
    
    const clone = JSON.parse(JSON.stringify(json));

    // Обновляем пути к картинке
    clone.meta.image = clone.meta.image.replace('.webp', `${suffix}.webp`);

    // Масштабируем frames
    for (const key in clone.frames) {
      clone.frames[key] = scaleFrame(clone.frames[key], scale);
    }

    // Масштабируем size
    if (clone.meta.size) {
      clone.meta.size = scaleSize(clone.meta.size, scale);
    }

    // Устанавливаем правильный meta.scale
    clone.meta.scale = scale;

    // Создаём новый файл
    const newFileName = file.replace('.json', `${suffix}.json`);
    const newFilePath = path.join(folder, newFileName);
    fs.writeFileSync(newFilePath, JSON.stringify(clone, null, 2));
    console.log('created', newFileName);
  });
}
