import { Container, Sprite, Assets } from 'pixi.js'

export class Throne extends Container {
  constructor(scene) {
    super()

    // Получаем спрайтшит
    const sheet = Assets.get('otherAll_json')

    this.shadow = new Sprite(sheet.textures['throne'])
    this.shadow.anchor.set(0.5, 0.5)
    this.shadow.scale.set(1.2, -0.7) // сплющивание
    this.shadow.skew.x = -0.7
    this.shadow.x = -40
    this.shadow.y = -20

    this.shadow.tint = 0x676e66 // чёрный цвет
    this.shadow.animationSpeed = 0.4
    this.shadow.loop = true
    this.shadow.alpha = 0.3
    this.addChild(this.shadow)

    // Создаем спрайт с текстурой 'throne'
    this.sprite = new Sprite(sheet.textures['throne'])
    this.sprite.anchor.set(0.5, 1) // Центр по X, низ по Y
    this.addChild(this.sprite)
  }
}
