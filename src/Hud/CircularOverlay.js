import { Container, Graphics } from 'pixi.js'
import { gsap } from 'gsap'

export class CircularOverlay extends Container {
  constructor(radius = 200, uiLayer) {
    super()
    this.uiLayer = uiLayer
    this.radius = radius
    this.color = 0x000000
    this.alphaValue = 0.4
    this.dragFlag = false;
    // console.log('dragFlag',  this.dragFlag);
    this.handVisible = false;
    // графика для круга
    this.graphics = new Graphics()
    this.addChild(this.graphics)

    // стартовый угол круга (закрыт полностью)
    this.currentAngle = Math.PI * 2
    this.drawOverlay(this.currentAngle)

    // квадратная маска
    this.maskSquare = new Graphics()
    this.maskSquare
      .roundRect(-66, -93, 132, 164, 5)
      .fill({ color: 0xffffff })
    this.addChild(this.maskSquare)

    // применяем маску
    this.graphics.mask = this.maskSquare

    // настраиваем направление «часовой стрелки»
    this.scale.set(-1, 1)
   

    // запускаем очистку overlay
    this.clearOverlay(5)
  }

  drawOverlay(angle) {
     this.dragFlag = true
   //  console.log('dragFlag',  this.dragFlag);
     
    this.graphics.clear()
    this.graphics
      .arc(0, 0, this.radius, angle-Math.PI/2, Math.PI * 2-Math.PI/2, true) // true = по часовой стрелке
      .lineTo(0, 0)
      .fill({ color: this.color, alpha: this.alphaValue })
    }

  clearOverlay(duration = 5) {
    gsap.to(this, {
      currentAngle: 0,
      duration: duration,
      ease: 'linear',
      onUpdate: () => this.drawOverlay(this.currentAngle),
      onComplete: () => {
        this.graphics.clear(),
        this.handVisible = true
         this.dragFlag = false;
      }
    })
  }

  fillOverlay(duration = 3) {
    gsap.to(this, {
      currentAngle: Math.PI * 2,
      duration: duration,
      ease: 'linear',
      onUpdate: () => this.drawOverlay(this.currentAngle),
    })
     this.graphics.rotation += 1.56 // угол старта
  }
}
