import { Container, Sprite, Assets } from 'pixi.js'
import { CharacterIcon } from './CharacterIcon'
import { gsap } from 'gsap'
import { CircularOverlay } from './CircularOverlay'

export class BlueTree extends Container {
  constructor(uiLayer) {
    super()
    this.uiLayer = uiLayer
    this.zIndex = 0.1
    this.overlay = null

    this.baseScale = 0.61
    this.offSetX = 0
    this.offSetY = 20

    // ===== ПЛАШКА =====
    this.blueTree = new Sprite(Assets.get('blue_tree'))
    this.blueTree.anchor.set(0.5, 1)
    this.blueTree.scale.set(this.baseScale)
    this.addChild(this.blueTree)

    // ===== КНОПКИ =====
    const buttonOffsetY = -this.blueTree.height * 0.55
    const buttonSpacing = 100

    this.giantIcon = new CharacterIcon({
      iconKey: 'giant_icon',
      frameKey: 'big_character_icon',
      x: -buttonSpacing,
      y: buttonOffsetY,
      scale: 0.49,
      iconScale: 1,
      uiLayer: this.uiLayer,
    })

    this.archerIcon = new CharacterIcon({
      iconKey: 'archer_icon',
      frameKey: 'big_character_icon',
      x: buttonSpacing,
      y: buttonOffsetY,
      scale: 0.49,
      iconScale: 1.05,
      uiLayer: this.uiLayer,
    })

    this.addChild(this.giantIcon, this.archerIcon)

    // сохраняем исходные позиции
    this.giantIcon.baseX = this.giantIcon.x
    this.archerIcon.baseX = this.archerIcon.x
    this.centerX = 0 // центр плашки
  }

  // ================================
  // выбор юнита: "giant" или "archer"
  // ================================
  selectUnit(unitType) {
    if (unitType === 'giant') {
      // гигант выбран → исчезает гигант
      gsap.to(this.giantIcon.scale, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          this.giantIcon.visible = false
        },
      })
      // лучник переезжает в центр
      gsap.to(this.archerIcon, {
        x: this.centerX,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          this.overlay = new CircularOverlay(150)
          this.addChild(this.overlay)
          overlay.y-=120
        },
      })
    } else if (unitType === 'archer') {
      // лучник выбран → исчезает лучник
      gsap.to(this.archerIcon.scale, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          this.archerIcon.visible = false
        },
      })

      // гигант переезжает в центр
      gsap.to(this.giantIcon, {
        x: this.centerX,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          this.overlay = new CircularOverlay(150)
          this.addChild(this.overlay)
          overlay.y-=120
        },
      })
    }
  }

  resize(w, h, scale_UI, scaleGame) {
    this.scale.set(scaleGame)

    const halfWidth = (this.blueTree.width * this.scale.x) / 2

    if (w < h) {
      this.x = w - halfWidth
      this.y = h + 30 * scale_UI
    } else {
      this.x = w / 2
      this.y = h + (this.blueTree.height / 8) * scaleGame
    }
  }

  update(delta) {
    this.children.forEach((child) => child.update?.(delta))
  }
}
