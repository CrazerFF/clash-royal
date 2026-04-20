import fs from 'fs'
import path from 'path'
import { manifest } from '../src/objects/Manifest.js'

// 👉 корень проекта
const ROOT_DIR = path.resolve('./')

// 👉 папка со spine
const SPINE_DIR = path.join(ROOT_DIR, 'assets/sprites/spine')

// ===== MIME =====
function getMime(ext) {
  switch (ext) {
    case '.webp':
      return 'image/webp'
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.json':
      return 'application/json'
    case '.atlas':
      return 'text/plain'
    default:
      return 'application/octet-stream'
  }
}

// ===== base64 =====
function fileToBase64(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const mime = getMime(ext)

  const data = fs.readFileSync(filePath)
  return `data:${mime};base64,${data.toString('base64')}`
}

// ===== check base64 =====
function isBase64(str) {
  return typeof str === 'string' && str.startsWith('data:')
}

// ===== JSON =====
function processJson(fullPath) {
  const raw = fs.readFileSync(fullPath, 'utf-8')
  const json = JSON.parse(raw)

  if (json.meta && json.meta.image) {
    if (!isBase64(json.meta.image)) {
      const imgPath = path.join(path.dirname(fullPath), json.meta.image)

      if (fs.existsSync(imgPath)) {
        json.meta.image = fileToBase64(imgPath)
        console.log(`🟢 atlas image → base64: ${path.basename(fullPath)}`)
      }
    }
  }

  return json
}

// ===== EXTRACT IMAGE NAME FROM ATLAS =====
function extractImageFromAtlas(atlasPath) {
  const content = fs.readFileSync(atlasPath, 'utf-8')
  return content.split('\n')[0].trim()
}

// ===== MAIN =====
manifest.bundles.forEach((bundle) => {
  for (let i = 0; i < bundle.assets.length; i++) {
    const asset = bundle.assets[i]
    const src = asset.src

    if (typeof src !== 'string') continue

    const fullPath = path.join(ROOT_DIR, src)
    const ext = path.extname(src).toLowerCase()

    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ file not found: ${src}`)
      continue
    }

    // =========================
    // 🟢 IMAGE → base64
    // =========================
    if (['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) {
      asset.src = fileToBase64(fullPath)
      console.log(`🟢 image → base64: ${asset.alias}`)
    }

    // =========================
    // 🔵 JSON → base64
    // =========================
    else if (ext === '.json') {
      const json = processJson(fullPath)
      const base64 = Buffer.from(JSON.stringify(json)).toString('base64')
      asset.src = `data:application/json;base64,${base64}`
      console.log(`🔵 json → base64: ${asset.alias}`)
    }

    // =========================
    // 🟣 ATLAS → INLINE + IMAGE
    // =========================
    else if (ext === '.atlas') {
      const atlasText = fs.readFileSync(fullPath, 'utf-8')

      // 👉 имя картинки из atlas
      const imageFile = extractImageFromAtlas(fullPath)

      // 👉 ищем ТОЛЬКО в spine папке
      const imagePath = path.join(SPINE_DIR, imageFile)

      if (fs.existsSync(imagePath)) {
        const imageBase64 = fileToBase64(imagePath)

        const imageAlias = asset.alias.replace('_atlas', '_image')

        bundle.assets.splice(i + 1, 0, {
          alias: imageAlias,
          src: imageBase64,
        })

        i++

        console.log(`🟢 spine image added: ${imageFile} → ${imageAlias}`)
      } else {
        console.warn(`❌ spine image not found: ${imageFile}`)
      }

      // 👉 atlas → base64
      const base64 = Buffer.from(atlasText).toString('base64')
      asset.src = `data:text/plain;base64,${base64}`

      console.log(`🟣 atlas → base64: ${asset.alias}`)
    } else {
      console.warn(`⚠️ unknown type: ${src}`)
    }
  }
})

// ===== WRITE OUTPUT =====
const manifestPath = path.resolve('./src/objects/manifest.js')

fs.writeFileSync(
  manifestPath,
  `// AUTO-GENERATED (INLINE PLAYABLE)
export const manifest = ${JSON.stringify(manifest, null, 2)};
`,
  'utf-8'
)

console.log('\n✅ INLINE MANIFEST READY')

function fileToBase64Audio(filePath) {
  const ext = path.extname(filePath).toLowerCase()

  let mime = 'audio/mpeg'

  switch (ext) {
    case '.m4a':
      mime = 'audio/mp4'
      break
    case '.mp3':
      mime = 'audio/mpeg'
      break
    case '.ogg':
      mime = 'audio/ogg'
      break
  }

  const data = fs.readFileSync(filePath)
  return `data:${mime};base64,${data.toString('base64')}`
}

function patchSoundManager() {
  const filePath = path.resolve('./src/objects/SoundManager.js')

  let code = fs.readFileSync(filePath, 'utf-8')

  const regex = /src:\s*\[\s*['"`](assets\/audio\/[^'"`]+)['"`]\s*\]/g

  code = code.replace(regex, (match, audioPath) => {
    const fullPath = path.join(ROOT_DIR, audioPath)

    if (!fs.existsSync(fullPath)) {
      console.warn(`❌ audio not found: ${audioPath}`)
      return match
    }

    const base64 = fileToBase64Audio(fullPath)

    console.log(`🎵 audio → base64: ${audioPath}`)

    return `src: ['${base64}']`
  })

  fs.writeFileSync(filePath, code, 'utf-8')

  console.log('🎧 SoundManager patched')
}
patchSoundManager()

function fileToBase64Font(filePath) {
  const ext = path.extname(filePath).toLowerCase()

  let mime = 'font/woff2'
  if (ext === '.woff') mime = 'font/woff'
  if (ext === '.ttf') mime = 'font/ttf'
  if (ext === '.otf') mime = 'font/otf'

  const data = fs.readFileSync(filePath)
  return `data:${mime};base64,${data.toString('base64')}`
}

if (['.woff2', '.woff', '.ttf', '.otf'].includes(ext)) {
  asset.src = fileToBase64Font(fullPath)
  console.log(`🔤 font → base64: ${asset.alias}`)
}

//node scripts/generateManifestBase64.js
