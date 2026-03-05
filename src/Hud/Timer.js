import { Container, Text, TextStyle } from 'pixi.js'
import { gsap } from 'gsap'

export class Timer extends Container {
  constructor(scene) { // Добавляем scene в конструктор
    super()

    this.scene = scene // Сохраняем ссылку на сцену

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

    this.numbers = ['3', '2', '1', 'FIGHT!']
    this.currentIndex = 0
    
    this.animateNumber()
  }

  animateNumber() {
    // Показываем текущее число
    this.timerText.text = this.numbers[this.currentIndex]
    this.timerText.alpha = 1
    this.timerText.scale.set(2)
    
    // Анимация появления
    gsap.to(this.timerText.scale, {
      x: 1,
      y: 1,
      duration: 0.3,
      ease: 'back.out',
      onComplete: () => {
        // Если это цифра "1" (индекс 2)
        if (this.currentIndex === 2) {
          // Снимаем паузу
          if (this.scene) {
            this.scene.isPaused = false
          }
        }
        
        // Если это не последний элемент (не FIGHT!)
        if (this.currentIndex < this.numbers.length - 1) {
          // Исчезаем и переходим к следующему
          gsap.to(this.timerText, {
            alpha: 0,
            duration: 0.2,
            delay: 0.5,
            onComplete: () => {
              this.currentIndex++
              this.animateNumber()
            }
          })
        } else {
          // Для FIGHT! делаем пульсацию
          gsap.to(this.timerText.scale, {
            x: 1.2,
            y: 1.2,
            duration: 0.3,
            ease: 'back.out',
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              gsap.to(this, {
                alpha: 0,
                duration: 0.5,
                onComplete: () => this.destroy({ children: true })
              })
            }
          })
        }
      }
    })
  }

  resize(w, h) {
    this.x = w / 2
    this.y = h / 3.5
  }
  
  update(delta) {
    // Не нужен
  }
}