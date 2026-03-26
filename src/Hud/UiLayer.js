import { Container, Graphics, Text } from 'pixi.js'
import { Label } from './Label.js'
import { BlueTree } from './BlueTree.js'
import { PlayNow } from './PlayNow.js'
import { RoyalTrainer } from './RoyalTrainer.js'
import { Hand } from './Hand.js'
import { Overlay } from './Overlay.js'
import { LabelKing } from './LabelKing.js'
import { Giant } from '../objects/Giant.js'
import { Archer } from '../objects/Archer.js'

export class UiLayer extends Container {
  constructor(designWidth, designHeight, w, h) {
    super()
    this.designWidth = designWidth
    this.designHeight = designHeight
    this.uiScale = new Container()
    this.addChild(this.uiScale)
    //  this.roundPixels = true;
    this.objects = []
    this.create()
  }

  create() {
    this.sortableChildren = true

    this.label = new Label()
    this.addChild(this.label)

    this.blueTree = new BlueTree(this)
    this.addChild(this.blueTree)
    this.blueTree.visible = false

    this.playNow = new PlayNow()
    this.addChild(this.playNow)

    this.royalTrainer = new RoyalTrainer()
    this.addChild(this.royalTrainer)

    this.hand = new Hand(this)
    this.addChild(this.hand)

    this.overlay = new Overlay(this)
    this.addChild(this.overlay)

    this.labelKing = new LabelKing(this)
    this.addChild(this.labelKing)
    this.labelKing.visible = false
  }

  createContinue() {
    this.giant2 = new Giant(this)
    this.giant2.x = this.designWidth / 2 - 70
    this.giant2.y = this.designHeight / 2 + 150
    this.addChild(this.giant2)
    this.giant2.alpha = 0.5
    this.giant2.setAttackFrame(1, 9)
    this.giant2.visible = false
    this.giant2.isResize = true
    this.giant2.scale.set(0.7)

    this.archer3 = new Archer(this)
    this.archer3.x = this.designWidth / 2 - 70
    this.archer3.y = this.designHeight / 2 + 150
    this.addChild(this.archer3)
    this.archer3.alpha = 0.5
    this.archer3.textArcher()
    this.archer3.setAttackFrame(6, 1)
    this.archer3.visible = false
    this.archer3.isResize = true
    this.archer3.scale.set(0.7)

    this.archer4 = new Archer(this)
    this.archer4.x = this.designWidth / 2 - 70
    this.archer4.y = this.designHeight / 2 + 150
    this.addChild(this.archer4)
    this.archer4.alpha = 0.5
    this.archer4.setAttackFrame(6, 1)
    this.archer4.visible = false
    this.archer4.isResize = true
    this.archer4.scale.set(0.7)
  }

  update(delta) {
    this.children.forEach((child) => {
      if (child?.update) {
        child.update(delta)
      }
    })
  }
  resize(w, h, scale_UI, scaleGame) {
    this.x = 0
    this.y = 0

    this.w = w
    this.h = h
    this.scaleUI = scale_UI
    this.scaleGame = scaleGame

    const startGlobal = this.blueTree.giantIcon.getGlobalPosition()

    this.uiScale.scale.set(scale_UI)
    // центрируем дизайн-UI
    this.uiScale.x = (w - 660 * scale_UI) / 2
    this.uiScale.y = (h - 1220 * scale_UI) / 2

    this.uiScale.children.forEach((c) => c.resize?.(w, h, scale_UI, scaleGame))

    this.children.forEach((c) => {
      c.resize?.(w, h, scale_UI, scaleGame)
    })
  }
}
