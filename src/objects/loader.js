import { Assets, Texture, Spritesheet } from 'pixi.js'
import { manifest } from './Manifest.js'
import { TextureAtlas, SpineTexture } from '@esotericsoftware/spine-pixi-v8'
import {
  SkeletonJson,
  AtlasAttachmentLoader,
} from '@esotericsoftware/spine-core'

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


export async function loadBundle(name) {
  const bundle = manifest.bundles.find((b) => b.name === name)
  if (!bundle) throw new Error(`Bundle not found: ${name}`)

  // 1. находим все spine базы
  const spineBases = bundle.assets
    .filter((a) => a.alias.endsWith('_atlas'))
    .map((a) => a.alias.replace('_atlas', ''))

  const spineAssets = []
  const spriteAssets = []

  // 2. делим ассеты
  for (const asset of bundle.assets) {
    const isSpine = spineBases.some(
      (base) =>
        asset.alias === base ||
        asset.alias === base + '_atlas' ||
        asset.alias === base + '_image'
    )

    if (isSpine) {
      spineAssets.push(asset)
    } else {
      spriteAssets.push(asset)
    }
  }

  // 3. грузим
  const tasks = []

  if (spineAssets.length) {
    tasks.push(loadSpineBundle(spineAssets))
  }

  if (spriteAssets.length) {
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

  const bases = assets
    .filter(a => a.alias.endsWith('_atlas'))
    .map(a => a.alias.replace('_atlas', ''))

  const tasks = bases.map(async (base) => {

    const atlasSrc = map[base + '_atlas']
    const jsonSrc = map[base]
    const imageSrc = map[base + '_image']

    if (!atlasSrc || !jsonSrc || !imageSrc) {
      console.warn(`⚠️ Skip spine ${base}`)
      return
    }

    const texture = await Assets.load(imageSrc)

    const atlas = new TextureAtlas(decode(atlasSrc), (path, cb) => {
      cb(texture)
    })

    for (const page of atlas.pages) {
      page.setTexture(
        SpineTexture.from(texture.source)
      )
    }

    const json = JSON.parse(decode(jsonSrc))

    Assets.cache.set(base, json)
    Assets.cache.set(base + '_atlas', atlas)
    Assets.cache.set(base + '_image', texture)
  })

  await Promise.all(tasks)
  return true
}

