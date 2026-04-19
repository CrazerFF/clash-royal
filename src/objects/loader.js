import { Assets, Texture, Spritesheet } from 'pixi.js'
import { manifest } from './manifest.js'
import { TextureAtlas, SpineTexture } from '@esotericsoftware/spine-pixi-v8'
import { SkeletonJson, AtlasAttachmentLoader } from '@esotericsoftware/spine-core'

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

function decode(dataUrl) {
  return atob(dataUrl.split(',')[1])
}

const spineCache = {}
//Assets


export async function loadBundle(name) {
  const bundle = manifest.bundles.find(b => b.name === name)
  if (!bundle) throw new Error(`Bundle not found: ${name}`)

  const spineAssets = []
  const spriteAssets = []

  for (const a of bundle.assets) {
    // Spine определяем только по atlas (это главный маркер spine)
    if (a.alias.endsWith('_atlas')) {
      spineAssets.push(a)
    } else {
      spriteAssets.push(a)
    }
  }

  const tasks = []

  if (spineAssets.length > 0) {
    tasks.push(loadSpineBundle(spineAssets))
  }

  if (spriteAssets.length > 0) {
    tasks.push(loadSpritesBundle(spriteAssets))
  }

  await Promise.all(tasks)

  return true
}



export async function loadSpritesBundle(assets) {
  const tasks = assets.map(async ({ alias, src }) => {

    // ===== BASE64 JSON (spritesheet) =====
    if (isBase64Json(src)) {
      const atlas = decodeBase64Json(src)
      const texture = await Assets.load(atlas.meta.image)

      const sheet = new Spritesheet(texture, atlas)
      await sheet.parse()

      Assets.cache.set(alias, sheet)

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

    // ===== normal =====
    const texture = await Assets.load(src)
    Assets.cache.set(alias, texture)
  })

  await Promise.all(tasks)
  return true
}

export async function loadSpineBundle(assets) {

  const map = Object.fromEntries(
    assets.map(a => [a.alias, a.src])
  )

  const atlasKey = assets.find(a => a.alias.endsWith('_atlas')).alias
  const base = atlasKey.replace('_atlas', '')

  const texture = Texture.from(
    (await Assets.load(map[base + '_image'])).source
  )

  const atlasText = decode(map[base + '_atlas'])

  const atlas = new TextureAtlas(atlasText, (path, cb) => {
    cb(texture)
  })

  for (const page of atlas.pages) {
    page.setTexture(
      SpineTexture.from(texture.source)
    )
  }

  const json = JSON.parse(decode(map[base]))

  Assets.cache.set(base, json)
  Assets.cache.set(base + '_atlas', atlas)
  Assets.cache.set(base + '_image', texture)

  return true
}

