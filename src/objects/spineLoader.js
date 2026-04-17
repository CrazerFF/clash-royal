import { Assets } from 'pixi.js'
import { TextureAtlas } from '@esotericsoftware/spine-pixi-v8'

// =====================
// helpers
// =====================

function isBase64Json(src) {
  return typeof src === 'string' && src.startsWith('data:application/json')
}

function decodeBase64Json(dataUrl) {
  const base64 = dataUrl.split(',')[1]
  return JSON.parse(atob(base64))
}

// =====================
// SPINE LOADER
// =====================

export async function loadSpineFromManifest(asset) {
  const { alias, src } = asset

  // 1. decode skeleton json
  const skeletonJson = decodeBase64Json(src)

  const atlasAlias = alias.replace('_json', '_atlas')
  const imageAlias = alias.replace('_json', '_image')

  const atlasText = Assets.get(atlasAlias)
  const image = Assets.get(imageAlias)

  if (!atlasText) {
    console.warn(`⚠️ Spine atlas missing: ${atlasAlias}`)
    return null
  }

  if (!image) {
    console.warn(`⚠️ Spine image missing: ${imageAlias}`)
    return null
  }

  // 2. build atlas
  const atlas = new TextureAtlas(atlasText, (line, cb) => {
    cb(image.baseTexture)
  })

  // 3. return ready data for Spine.from
  return {
    skeleton: skeletonJson,
    atlas
  }
}
