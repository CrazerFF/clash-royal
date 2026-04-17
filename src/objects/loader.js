import { Assets, Spritesheet } from 'pixi.js'
import { Spine } from '@esotericsoftware/spine-pixi-v8'
import { manifest } from './manifest.js'

// ===== helpers =====

function isBase64(src) {
  return typeof src === 'string' && src.startsWith('data:')
}

function isBase64Json(src) {
  return src.startsWith('data:application/json')
}

function isBase64Texture(src) {
  return src.startsWith('data:image/')
}

function decodeBase64Json(dataUrl) {
  const base64 = dataUrl.split(',')[1]
  const jsonStr = atob(base64)
  return JSON.parse(jsonStr)
}

// ===== Spine loader =====

async function loadSpineBundle(alias, skeletonSrc, atlasSrc, imageSrc) {
  // 1. Декодируем skeleton.json из base64
  const skeletonJson = decodeBase64Json(skeletonSrc)
  
  // 2. Декодируем atlas из base64
  const atlasText = decodeBase64Json(atlasSrc)
  
  // 3. Загружаем текстуру из base64
  const texture = await Assets.load(imageSrc)
  
  // 4. Создаем атлас для Spine из текстуры
  // Для работы нужно будет создать текстуру в формате, понятном Spine
  // Используем временный canvas для создания Spine-текстуры
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // Получаем размеры текстуры
  const { width, height } = texture
  canvas.width = width
  canvas.height = height
  
  // Рисуем текстуру на canvas
  const renderTexture = await Assets.load({
    src: imageSrc,
    format: 'png',
    alpha: true
  })
  
  // Временное решение: используем PIXI Texture для создания Spine Atlas
  // Для полноценной работы может потребоваться дополнительная обработка
  const spineAtlas = new AtlasFromTexture(texture, atlasText)
  
  // 5. Создаем Spine объект
  const spine = new Spine(skeletonJson, spineAtlas)
  
  // Кешируем готовый Spine объект
  Assets.cache.set(alias, spine)
  
  return spine
}

// Вспомогательный класс для создания Spine атласа из текстуры
class AtlasFromTexture {
  constructor(texture, atlasText) {
    this.texture = texture
    this.atlasText = atlasText
    this.pages = []
    this.regions = new Map()
    
    this.parseAtlasText(atlasText)
    this.createRegions()
  }
  
  parseAtlasText(text) {
    const lines = text.split('\n')
    let currentPage = null
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      if (line.endsWith('.png')) {
        currentPage = {
          name: line,
          width: 0,
          height: 0,
          regions: []
        }
        this.pages.push(currentPage)
        
        // Следующая строка содержит размеры
        const sizeLine = lines[++i].trim()
        const sizeMatch = sizeLine.match(/size:(\d+),(\d+)/)
        if (sizeMatch) {
          currentPage.width = parseInt(sizeMatch[1])
          currentPage.height = parseInt(sizeMatch[2])
        }
      } else if (currentPage && line.includes(':')) {
        // Парсим параметры региона
        const region = { name: '', rotate: false, x: 0, y: 0, width: 0, height: 0 }
        
        // Имя региона
        region.name = line
        
        // Следующие строки содержат параметры
        for (let j = i + 1; j < lines.length; j++) {
          const paramLine = lines[j].trim()
          if (!paramLine || paramLine.includes('.png')) break
          
          const [key, value] = paramLine.split(':')
          if (key === 'rotate') region.rotate = value === 'true'
          else if (key === 'xy') {
            const [x, y] = value.split(',').map(Number)
            region.x = x
            region.y = y
          } else if (key === 'size') {
            const [w, h] = value.split(',').map(Number)
            region.width = w
            region.height = h
          } else if (key === 'orig') {
            const [w, h] = value.split(',').map(Number)
            region.origWidth = w
            region.origHeight = h
          } else if (key === 'offset') {
            const [x, y] = value.split(',').map(Number)
            region.offsetX = x
            region.offsetY = y
          } else if (key === 'index') {
            region.index = parseInt(value)
          }
          
          i = j
        }
        
        currentPage.regions.push(region)
      }
    }
  }
  
  createRegions() {
    for (const page of this.pages) {
      for (const regionData of page.regions) {
        // Создаем субтекстуру для каждого региона
        const frame = new PIXI.Rectangle(
          regionData.x,
          regionData.y,
          regionData.width,
          regionData.height
        )
        
        const regionTexture = new PIXI.Texture(this.texture, frame)
        
        this.regions.set(regionData.name, {
          page: page,
          texture: regionTexture,
          width: regionData.width,
          height: regionData.height,
          x: regionData.x,
          y: regionData.y,
          rotate: regionData.rotate || false
        })
      }
    }
  }
  
  findRegion(name) {
    return this.regions.get(name)
  }
}

// ===== loader =====

export async function loadBundle(name) {
  const bundle = manifest.bundles.find((b) => b.name === name)

  if (!bundle) {
    throw new Error(`Bundle not found: ${name}`)
  }

  const tasks = bundle.assets.map(async ({ alias, src }) => {
    // ===== SPINE (три последовательных файла) =====
    // Проверяем, не является ли это Spine-бандлом из трех частей
    if (typeof src === 'object' && src.skeleton && src.atlas && src.image) {
      return await loadSpineBundle(alias, src.skeleton, src.atlas, src.image)
    }
    
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
    if (isBase64Texture(src)) {
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