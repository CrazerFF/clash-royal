import { Container, Text, TextStyle } from 'pixi.js'
import { gsap } from 'gsap'
import { loadBundle } from '../objects/loader.js'


export class Timer extends Container {
  constructor(scene) {
    super()

    this.scene = scene

    const textStyle = new TextStyle({
      fontFamily: 'font',
      fill: '#ffffff',
      fontSize: 80,
      fontWeight: 'bold',
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

    this.timerText = new Text({
      text: '3',
      style: textStyle,
    })

    this.timerText.anchor.set(0.5)
    this.timerText.scale.set(2)
    this.addChild(this.timerText)

    this.numbers = ['3', '2', '1']
    this.currentIndex = 0

    this.isLoaded = false

    this.loadBundle()
    this.animateNumber()
  }

  // 📦 просто грузим
  async loadBundle() {
    await loadBundle('gameContinue')
    this.isLoaded = true
  }

  // ⏱ таймер
  animateNumber() {
    this.timerText.text = this.numbers[this.currentIndex]
    this.timerText.alpha = 1
    this.timerText.scale.set(2)

    gsap.to(this.timerText.scale, {
      x: 1,
      y: 1,
      duration: 0.3,
      ease: 'back.out',
      onComplete: () => {
        // 👉 на "1" снимаем паузу
        if (this.currentIndex === 2) {
          this.scene.isPaused = false

          // 🔥 ЖДЁМ загрузку
          this.waitForLoad()
          return
        }

        // обычный переход
        gsap.to(this.timerText, {
          alpha: 0,
          duration: 0.2,
          delay: 0.5,
          onComplete: () => {
            this.currentIndex++
            this.animateNumber()
          },
        })
      },
    })
  }

  // 🔥 ожидание загрузки
  waitForLoad() {
    this.oneStartTime = performance.now()

    const check = () => {
      const elapsed = performance.now() - this.oneStartTime
      const minDelayPassed = elapsed >= 1000 // 1 секунда

      if (this.isLoaded && minDelayPassed) {
        this.showFight()
      } else {
        requestAnimationFrame(check)
      }
    }

    check()
  }

  // 💥 FIGHT
  showFight() {
    this.timerText.text = 'FIGHT!'
    this.timerText.alpha = 1
    this.timerText.scale.set(2)

    gsap.to(this.timerText.scale, {
      x: 1.2,
      y: 1.2,
      duration: 0.3,
      ease: 'back.out',
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.finish()
      },
    })
  }

  // 🎬 финал
  finish() {
    gsap.to(this, {
      alpha: 0,
      duration: 0.5,
      onComplete: () => {
        this.destroy({ children: true })

        this.scene.createContinue()
        this.scene.uiLayer.createContinue()
      },
    })
  }

  resize(w, h) {
    this.x = w / 2
    this.y = h / 3.5
  }
}
