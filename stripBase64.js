import fs from 'fs';

const FILE_PATH = './unpackage.js';

if (!fs.existsSync(FILE_PATH)) {
  console.error(`❌ Файл не найден: ${FILE_PATH}`);
  process.exit(1);
}

const content = fs.readFileSync(FILE_PATH, 'utf-8');

let counter = 0;

// ищем ВСЁ base64 внутри data:
const BASE64_REGEX = /data:[^;]+;base64,[A-Za-z0-9+/=]+/g;

const replaced = content.replace(BASE64_REGEX, () => {
  counter++;
  return `__BASE64_${counter}__`;
});

// лучше в новый файл
fs.writeFileSync('./unpackage.cleaned.js', replaced, 'utf-8');

console.log(`🎉 Готово! Заменено Base64 строк: ${counter}`);
