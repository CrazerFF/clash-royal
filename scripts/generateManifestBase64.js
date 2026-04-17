// scripts/convertManifestToInline.js
import fs from 'fs'
import path from 'path'
import { manifest } from '../src/objects/manifest.js'

// 👉 корень проекта
const ROOT_DIR = path.resolve('./')

// ===== MIME =====
function getMime(ext) {
  switch (ext) {
    case '.webp': return 'image/webp'
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.json': return 'application/json'
    case '.atlas': return 'text/plain'
    default: return 'application/octet-stream'
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

// ===== JSON (spritesheet / spine json safe) =====
function processJson(fullPath) {
  const raw = fs.readFileSync(fullPath, 'utf-8')
  const json = JSON.parse(raw)

  // 👉 atlas image embedding (TexturePacker)
  if (json.meta && json.meta.image) {
    if (!isBase64(json.meta.image)) {
      const imgPath = path.join(path.dirname(fullPath), json.meta.image)

      if (fs.existsSync(imgPath)) {
        json.meta.image = fileToBase64(imgPath)
        console.log(`🟢 atlas image → base64: ${path.basename(fullPath)}`)
      } else {
        console.warn(`⚠️ atlas image not found: ${imgPath}`)
      }
    }
  }

  return json
}

// ===== MAIN =====
manifest.bundles.forEach(bundle => {
  bundle.assets.forEach(asset => {
    const src = asset.src

    // уже обработано или не строка
    if (typeof src !== 'string') return

    const fullPath = path.join(ROOT_DIR, src)
    const ext = path.extname(src).toLowerCase()

    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ file not found: ${src}`)
      return
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
    // 🟣 ATLAS → INLINE TEXT
    // =========================
    else if (ext === '.atlas') {
      const atlasText = fs.readFileSync(fullPath, 'utf-8')

      asset.src = atlasText

      console.log(`🟣 atlas → inline: ${asset.alias}`)
    }

    // =========================
    // ❓ unknown
    // =========================
    else {
      console.warn(`⚠️ unknown type: ${src}`)
    }
  })
})

// ===== WRITE OUTPUT =====
const manifestPath = path.resolve('./src/objects/Manifest.js')

fs.writeFileSync(
  manifestPath,
  `// AUTO-GENERATED (INLINE PLAYABLE)
export const manifest = ${JSON.stringify(manifest, null, 2)};
`,
  'utf-8'
)

console.log('\n✅ INLINE MANIFEST READY (base64 + atlas inline)')
