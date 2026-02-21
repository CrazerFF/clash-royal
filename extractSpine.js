import fs from "fs";

const file = "unpacked.js";
const data = fs.readFileSync(file, "utf8");

// Находим все JSON spine строки
const jsonRegex = /json:\s*'({[\s\S]*?})'/g;

let match;
let count = 0;

while ((match = jsonRegex.exec(data)) !== null) {
  count++;
  let jsonText = match[1];

  // Разэкранируем переносы, табуляцию и кавычки
  jsonText = jsonText.replace(/\\n/g, "")
                     .replace(/\\t/g, "")
                     .replace(/\\"/g, '"');

  // Парсим JSON
  let spineJSON;
  try {
    spineJSON = JSON.parse(jsonText);
  } catch (e) {
    console.log(`❌ JSON parse error for spine #${count}:`, e.message);
    continue;
  }

  // Ищем atlas рядом после spine
  const atlasRegex = /atlas:\s*"(.*?)"/s;
  const atlasMatch = atlasRegex.exec(data.slice(match.index));

  // Определяем имя по первой строке атласа или fallback
  let baseName = `spine${count}`;
  if (atlasMatch) {
    let atlasText = atlasMatch[1]
      .replace(/\\n/g, "\n")   // реальные переносы
      .replace(/\\"/g, '"');   // экранированные кавычки

    const firstLine = atlasText.split("\n")[0];
    if (firstLine && firstLine.endsWith(".png")) {
      baseName = firstLine.replace(".png", "");
    }

    fs.writeFileSync(`${baseName}.atlas`, atlasText);
    console.log(`✅ Saved atlas: ${baseName}.atlas`);
  } else {
    console.log(`⚠️ Atlas not found for spine #${count}`);
  }

  // Сохраняем JSON под тем же именем
  fs.writeFileSync(`${baseName}.json`, JSON.stringify(spineJSON, null, 2));
  console.log(`✅ Saved JSON spine: ${baseName}.json`);
}

console.log(`Done. Found ${count} JSON spine objects.`);
