import fs from 'fs';
import path from 'path';

// Папка с исходными JSON и спрайтами
const folder = './public/assets/sprites';

// Конфигурация масштабов
const scales = [
  { suffix: '', scale: 0.333 },
  { suffix: '@2x', scale: 0.5 },
  { suffix: '@3x', scale: 1 }
];

function scaleFrame(frame, factor) {
  // Проверяем, что frame имеет необходимые поля
  if (!frame || frame.x === undefined || frame.y === undefined || 
      frame.w === undefined || frame.h === undefined) {
    return frame;
  }
  
  return {
    x: Math.round(frame.x * factor),
    y: Math.round(frame.y * factor),
    w: Math.round(frame.w * factor),
    h: Math.round(frame.h * factor)
  };
}

function scaleSize(size, factor) {
  if (!size || size.w === undefined || size.h === undefined) {
    return size;
  }
  
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
    // Для оригинального масштаба (1) пропускаем, так как исходник уже есть
  //  if (scale === 1) return;
    
    const clone = JSON.parse(JSON.stringify(json));

    // Обновляем пути к картинке, только если meta.image существует
    if (clone.meta && clone.meta.image) {
      clone.meta.image = clone.meta.image.replace('.webp', `${suffix}.webp`);
    }

    // Масштабируем frames
    if (clone.frames && typeof clone.frames === 'object') {
      for (const key in clone.frames) {
        if (clone.frames[key] && typeof clone.frames[key] === 'object') {
          // Проверяем структуру фрейма - может быть либо прямым объектом, либо с вложенным frame
          if (clone.frames[key].frame) {
            // Формат TexturePacker с вложенным frame
            clone.frames[key].frame = scaleFrame(clone.frames[key].frame, scale);
            if (clone.frames[key].spriteSourceSize) {
              clone.frames[key].spriteSourceSize = scaleFrame(clone.frames[key].spriteSourceSize, scale);
            }
            if (clone.frames[key].sourceSize) {
              clone.frames[key].sourceSize = scaleSize(clone.frames[key].sourceSize, scale);
            }
          } else {
            // Простой формат без вложенности
            clone.frames[key] = scaleFrame(clone.frames[key], scale);
          }
        }
      }
    }

    // Масштабируем meta.size
    if (clone.meta && clone.meta.size) {
      clone.meta.size = scaleSize(clone.meta.size, scale);
    }

    // Устанавливаем правильный meta.scale
    if (clone.meta) {
      clone.meta.scale = scale;
    }

    // Создаём новый файл только для масштабированных версий
    // Оригинальный файл остается без изменений
    const newFileName = file.replace('.json', `${suffix}.json`);
    const newFilePath = path.join(folder, newFileName);
    fs.writeFileSync(newFilePath, JSON.stringify(clone, null, 2));
    console.log('created', newFileName);
  });
}

console.log('Done!');