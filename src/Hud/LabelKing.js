import { Container, Sprite, Assets, Text, TextStyle } from 'pixi.js'

export class LabelKing extends Container {
  constructor() {
    super()

    /* =========================
       👑 КОРОЛЬ
    ========================== */

    this.labelKing = new Sprite(Assets.get('blue_king_icon'))
    this.labelKing.anchor.set(0.5, 1)
    this.addChild(this.labelKing)
    this.labelKing.zIndex=9999

    this.baseScale = 0.82
    this.labelKing.scale.set(this.baseScale)

    this.offSetX = 130
    this.offSetY = 50

    /* =========================
       💬 POPUP CONTAINER
    ========================== */

    this.popupContainer = new Container()
    this.popupContainer.visible = false
    this.addChild(this.popupContainer)

    // Облачко
    this.popup = new Sprite(Assets.get('popup'))
    this.popup.anchor.set(0.5) // центр!
    this.popup.scale.set(0.7)
    this.popupContainer.addChild(this.popup)

    // Стиль текста
    this.textStyle = new TextStyle({
      fontFamily: 'font',
      fill: '#ffffff',
      fontSize: 35,
      fontWeight: 'bold',
      align: 'center',
      wordWrap: true,
      stroke: {
        color: '#000000',
        width: 10,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 3,
      dropShadowAngle: Math.PI / 2,
    })

    // Текст
    this.popupText = new Text({
      text: '',
      style: this.textStyle,
    })

    this.popupText.anchor.set(0.5)
    this.popupContainer.addChild(this.popupText)
  }

  /* =========================
     📢 ПОКАЗ ТЕКСТА
  ========================== */

  showText(text) {
    this.popupText.text = text

    // Ограничиваем ширину текста (после scale!)
    this.popupText.style.wordWrapWidth =
      this.popup.width * 0.75

    // Центр текста относительно popup
    this.popupText.position.set(20, 0)

    // Позиция всего облачка относительно короля
    this.popupContainer.x =
      this.labelKing.width * 0.75

    this.popupContainer.y =
      -this.labelKing.height * 0.85

    this.popupContainer.visible = true
  }

  showFirstText() {
    this.showText("What's your character?")
  }

  showSecondText() {
    this.showText('Spawn archers!')
  }

  /* =========================
     🙈 СКРЫТЬ
  ========================== */

  hideText() {
    this.popupContainer.visible = false
  }

  /* =========================
     📐 RESIZE
  ========================== */

  resize(w, h, scale_UI, scaleGame) {
    this.scale.set(this.baseScale * scale_UI)
    this.x = w / 2 - this.offSetX * scaleGame
    this.y = h + this.offSetY * scaleGame
  }
}
