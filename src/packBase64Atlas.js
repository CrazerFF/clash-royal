import fs from 'fs'
import path from 'path'

// Пути к исходным файлам
const jsonPath = './assets/bg.json'       // исходный JSON атлас
const imagePath = './assets/bg.webp'      // картинка PNG/WebP

// Путь для сохранения готового Base64 JSON
const outPath = './assets/bg_base64.json'

async function packBase64Atlas() {
  try {
    // 1️⃣ читаем JSON атлас
    const jsonRaw = fs.readFileSync(jsonPath, 'utf-8')
    const atlas = JSON.parse(jsonRaw)

    // 2️⃣ читаем картинку и конвертируем в Base64
    const imgBuffer = fs.readFileSync(imagePath)
    const ext = path.extname(imagePath).slice(1) // например 'webp'
    const base64Image = `data:image/${ext};base64,${imgBuffer.toString('base64')}`

    // 3️⃣ заменяем поле meta.image на Base64 строку
    atlas.meta.image = base64Image

    // 4️⃣ сохраняем готовый JSON
    fs.writeFileSync(outPath, JSON.stringify(atlas))

    console.log(`✅ Base64 атлас готов: ${outPath}`)
  } catch (err) {
    console.error('Ошибка при создании Base64 атласа:', err)
  }
}

packBase64Atlas()
