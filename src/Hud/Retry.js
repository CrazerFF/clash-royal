import { Container, Sprite, Text, TextStyle, Assets } from 'pixi.js'

export class Retry extends Container {
  constructor() {
    super()

    // ===== СПРАЙТ КНОПКИ =====
    this.sprite = new Sprite(Assets.get('blue_plate'))
    this.sprite.anchor.set(0.5)
    this.addChild(this.sprite)

    // ===== СТИЛЬ ТЕКСТА =====
    const textStyle = new TextStyle({
      fontFamily: 'font',
      fontSize: 25 * 2,
      fontWeight: '700',
      fill: '#ffffff',
      stroke: {
        color: '#000000',
        width: 7 * 1.5,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 5 * 1.5,
      dropShadowAngle: Math.PI / 2,
      align: 'center',
    })

    // ===== ТЕКСТ =====
    this.text = new Text({
      text: 'RETRY',
      style: textStyle,
    })

    this.text.anchor.set(0.5, 0.55)
    this.addChild(this.text)

    // ===== ПАРАМЕТРЫ =====
    this.baseScaleX = 0.88
    this.baseScaleY = 0.68
    this.baseScaleText = 0.95
    this.offSetX = 200
    this.offSetY = 258
    this.zIndex = 200

    // ===== ПУЛЬСАЦИЯ =====
    this.pulseTime = 0

    // ===== ИНТЕРАКТИВ =====
    this.eventMode = 'static'
    this.cursor = 'pointer'

    this.on('pointerdown', () => {
      if (window.restartGame) {
        window.restartGame()
      }
    })
  }

  // ===== ПУЛЬСАЦИЯ =====
  pulseAnimation(delta) {
    this.pulseTime += delta * 0.09
    const scaleOffset = Math.sin(this.pulseTime) * 0.05
    this.scale.set(1.7 + scaleOffset)
  }

  update(delta) {
    this.pulseAnimation(delta)
  }

  // ===== RESIZE =====
  resize(w, h, scale_UI) {
    this.screenWidth = w
    this.screenHeight = h
    this.currentScaleUI = scale_UI

    this.x = w / 2
    this.y = h / 2 + 500 * scale_UI

    this.sprite.scale.set(
      this.baseScaleX * scale_UI,
      this.baseScaleY * scale_UI
    )

    this.text.scale.set(this.baseScaleText * scale_UI * 0.7)

    this.text.x = this.sprite.x + 3 * scale_UI
    this.text.y = this.sprite.y
  }
}
