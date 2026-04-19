import { Assets, Spritesheet } from 'pixi.js'
import { manifest } from './manifest.js'

// ===== helpers =====

function isBase64(src) {
  return typeof src === 'string' && src.startsWith('data:')
}

function isBase64Json(src) {
  return src.startsWith('data:application/json')
}

function decodeBase64Json(dataUrl) {
  const base64 = dataUrl.split(',')[1]
  const jsonStr = atob(base64)
  return JSON.parse(jsonStr)
}

// ===== loader =====

export async function loadBundle(name) {
  const bundle = manifest.bundles.find((b) => b.name === name)

  if (!bundle) {
    throw new Error(`Bundle not found: ${name}`)
  }

  const tasks = bundle.assets.map(async ({ alias, src }) => {
    // ===== BASE64 JSON (atlas) =====
    if (isBase64Json(src)) {
      const atlas = decodeBase64Json(src)

      const imageBase64 = atlas.meta.image

      const texture = await Assets.load(imageBase64)

      const sheet = new Spritesheet(texture, atlas)
      await sheet.parse()

      // кешируем sheet
      Assets.cache.set(alias, sheet)

      // кешируем фреймы
      for (const key in sheet.textures) {
        Assets.cache.set(key, sheet.textures[key])
      }

      return
    }

    // ===== BASE64 IMAGE =====
    if (isBase64(src)) {
      const texture = await Assets.load(src)

      Assets.cache.set(alias, texture)

      return
    }

    // ===== fallback (если вдруг остались пути) =====
    const texture = await Assets.load(src)
    Assets.cache.set(alias, texture)
    Assets.cache.set(src, texture)
  })

  await Promise.all(tasks)

  return true
}
