import { Assets, Texture } from 'pixi.js'
import { manifest } from './manifest.js'
import { TextureAtlas, SpineTexture } from '@esotericsoftware/spine-pixi-v8'
import { SkeletonJson, AtlasAttachmentLoader } from '@esotericsoftware/spine-core'

function decode(dataUrl) {
  return atob(dataUrl.split(',')[1])
}

const spineCache = {}

export async function loadBundle(name) {
  const bundle = manifest.bundles.find((b) => b.name === name)
  if (!bundle) throw new Error(`Bundle not found: ${name}`)

  const map = Object.fromEntries(bundle.assets.map((a) => [a.alias, a.src]))

const base = Object.keys(map).find(k => !k.endsWith('_atlas') && !k.endsWith('_image'))

  // =========================
  // IMAGE
  // =========================
  const baseTexture = await Assets.load(map[base + '_image'])
  const texture = Texture.from(baseTexture.source)

  // =========================
  // ATLAS
  // =========================
  const atlasText = decode(map[base + '_atlas'])

  const atlas = new TextureAtlas(atlasText, (path, cb) => {
    console.log('Atlas requests:', path)
    cb(texture) 
  })

  // 🔥 ВАЖНО: руками привязываем texture к page
  for (const page of atlas.pages) {
    page.setTexture(
      SpineTexture.from(texture.source)
    )
  }

  // =========================
  // JSON
  // =========================
  const jsonText = decode(map[base])
  const json = JSON.parse(jsonText)

  Assets.cache.set(base, json)
  Assets.cache.set(base + '_atlas', atlas) 
  Assets.cache.set(base + '_image', texture)
}
