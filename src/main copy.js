import { Application, Sprite, Spritesheet, Assets } from 'pixi.js'
import atlas from './assets/sprites/otherAll.json'
;
(async () => {
  const app = new Application()

  await app.init({
    backgroundColor: 0x1d9612,
  })

  document.body.appendChild(app.canvas)

  await Assets.init()

  const texture = await Assets.load(atlas.meta.image)

  // spritesheet
  const sheet = new Spritesheet(texture, atlas)

  await sheet.parse()
 // Assets.cache.set('label', sheet)
  Assets.cache.set('label', sheet.textures['label'])

  console.log(sheet.textures)

  // const label = new Sprite(sheet.textures['label'])
  const label = new Sprite(Assets.get('label'))

  label.x = 200
  label.y = 200
  label.anchor.set(0.5)

  app.stage.addChild(label)
})()
