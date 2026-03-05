import { Container, Sprite, Assets, Graphics } from 'pixi.js'
import { gsap } from 'gsap'
import { Smoke } from './Smoke.js'

export class Clock extends Container {
  constructor() {
    super()

    this.smoke = new Smoke()
    this.addChild(this.smoke)

    /* =========================
       🕒 ОСНОВА ЧАСОВ
    ========================== */

    this.clock = new Sprite(Assets.get('clock'))
    this.clock.anchor.set(0.5, 0.52)
    this.addChild(this.clock)
    // this.clock.zIndex = 500
    /* =========================
       ➡ СТРЕЛКА
    ========================== */

    const handLength = this.clock.height * 0.06
    const handWidth = 4

    this.hand = new Graphics()
      .rect(-handWidth / 2, -handLength, handWidth, handLength)
      .fill({ color: 0x610606 })

    this.hand.pivot.set(0, 0)

    this.addChild(this.hand)

    /* =========================
       ✨ СТАРТОВЫЙ SCALE
    ========================== */

    this.scale.set(4) // стартуем большим
    this.alpha = 0

    /* =========================
       🎬 TIMELINE
    ========================== */

    const tl = gsap.timeline()

    // 1️⃣ Появление (сжатие из большого размера)
    tl.to(this, {
      scale: 1,
      alpha: 1,
      duration: 0.4,
      ease: 'back.out(1.7)',
    })

    // 2️⃣ Один оборот стрелки
    tl.to(this.hand, {
      rotation: Math.PI * 2,
      duration: 0.7,
      ease: 'linear',
    })

    // 3️⃣ Исчезновение в точку
    tl.to(this.scale, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: 'power2.in',
    })

    tl.to(this, {
      alpha: 0,
      duration: 0.2,
      onComplete: () => {
        this.destroy()
      },
    })
  }
}
