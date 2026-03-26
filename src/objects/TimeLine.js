import { Container, Graphics, Sprite, Assets } from 'pixi.js'
import { Enemy } from './Enemy.js'
import { sound } from './SoundManager.js'
import { TextPopup } from './TextPopup.js'
import { Timer } from '../Hud/Timer.js'
import { CrownAnim } from '../Hud/CrownAnim.js'
import { FinalText } from '../Hud/FinalText.js'
import { Bg2 } from '../Hud/Bg2.js'
import { Fail } from '../Hud/Fail.js'
import { Retry } from '../Hud/Retry.js'
import { Spine } from '@esotericsoftware/spine-pixi-v8'
import { gsap } from 'gsap'
import { ConfettiManager } from './ConfettiManager.js'

export class TimeLine {
  constructor(scene, designWidth, designHeight) {
    this.scene = scene
    this.designWidth = designWidth
    this.designHeight = designHeight
    this.sortableChildren = true
    this.currentSpawns = null
    this.scheduledSpawns0 = null
    this.scheduledSpawns1 = null
    this.scheduledSpawns2 = null
    // Для точечного спавна
    this.timeAccumulator = 0

    // обычные спавны по времени
    this.scheduledSpawns0 = [
      { time: 0.0, type: 'timer' },
      { time: 0.0, type: 'pause' },
      // { time: 1.0, type: 'fail' },
      // { time: 1.0, type: 'overlayIn' },
      // { time: 1.0, type: 'finalScreen2' },

      { time: 1.2, type: 'enemyMove1' },
      { time: 1.2, type: 'overlay' },
      { time: 1.2, type: 'showKing' },
      { time: 3.1, type: 'pause' },
      { time: 3.2, type: 'enemyMove2' },
      { time: 3.3, type: 'giantMove1' },
      { time: 5.0, type: 'showKing' },
      { time: 5.0, type: 'pause2' }, // пауза для выбора сценария
    ]
    this.scheduledSpawns1 = [
      // вот здесь выбор сценария 1 или 2. ниже идут тайминги сценария 1
      { time: 5.1, type: 'archerAttack' },
      { time: 5.8, type: 'archerRotate' },
      { time: 5.9, type: 'archer2PlayRun' },

      { time: 5.7, type: 'giantMove2' },
      { time: 5.7, type: 'enemyMove3' },
      { time: 9.7, type: 'enemyMove4' }, // враг поворачивается влево
      { time: 10.3, type: 'enemyMove5' },
      { time: 11.0, type: 'enemyMove6' },
      { time: 11.4, type: 'enemyMove7' },

      { time: 9.7, type: 'giantMove3' },
      { time: 10.7, type: 'enemyMove5' }, // враг поворачивается влево
      { time: 13.7, type: 'giantMove4' }, //идет к королю
      { time: 11.7, type: 'archerGoToBridge' },
      { time: 12.7, type: 'archer2GoToBridge' },

      { time: 14.7, type: 'archerAcrossBridge' },
      { time: 15.7, type: 'archer2AcrossBridge' },

      { time: 18.7, type: 'giantMove5' },
      { time: 19.0, type: 'attackThrone' },
      { time: 24.4, type: 'overlayIn' },
      { time: 28.2, type: 'finalScreen' },
    ]

    this.scheduledSpawns2 = [
      { time: 3.1, type: 'enemyMove9' },
      { time: 4.2, type: 'showKing' },
      // вот здесь выбор сценария 1 или 2. ниже идут тайминги сценария 1
      { time: 3.1, type: 'archerAttack' },
      { time: 5.8, type: 'archerRotate' },
      { time: 5.9, type: 'archer2PlayRun' },

      { time: 10.0, type: 'overlayIn2' },
      { time: 11.0, type: 'fail' },
      { time: 13.2, type: 'finalScreen2' },
    ]
    this.currentSpawns = this.scheduledSpawns0
  }

  update(delta) {
    if (!this.scene.isPaused) {
      this.timeAccumulator += delta * (1 / 60)
    }

    // console.log('this.timeAccumulator', this.timeAccumulator);

    for (const spawn of this.currentSpawns) {
      if (
        !spawn.spawned &&
        this.timeAccumulator >= spawn.time &&
        !this.scene.isPaused
      ) {
        this.spawnByType(spawn)
        spawn.spawned = true
      }
    }
  }

  spawnByType(spawn) {
    let obj
    switch (spawn.type) {
      case 'timer':
        this.timer = new Timer(this.scene)
        this.timer.x = window.innerWidth / 2
        this.timer.y = window.innerHeight / 2
        this.timer.resize(window.innerWidth, window.innerHeight)
        this.timer.zIndex = 9999

        this.scene.uiLayer.hand.visible = true
        this.scene.area.visible = false

        this.scene.uiLayer.addChild(this.timer)
        this.scene.uiLayer.objects.push(this.timer)
        break
      case 'overlay':
        gsap.to(this.scene.uiLayer.overlay, {
          alpha: 0,
          duration: 0.5,
          ease: 'linear',
        })
        break
      case 'overlayIn':
        gsap.to(this.scene.uiLayer.overlay, {
          alpha: 0.8,
          duration: 0.5,
          ease: 'linear',
          onComplete: () => {
            this.crownAnim = new CrownAnim(
              this.scene.uiLayer.w,
              this.scene.uiLayer.h,
              this.scene.uiLayer.scaleUI,
              this.scene.uiLayer.scaleGame,
              this.scene
            )
            setTimeout(() => {
              const confettiManager = new ConfettiManager()

              confettiManager.mixedFireMyVer({ x: 0.3, y: 0.4 })
              confettiManager.mixedFireMyVer({ x: 0.7, y: 0.85 })
            }, 1500)
            this.crownAnim.setAnimation1()
            this.scene.uiLayer.addChild(this.crownAnim)
          },
        })
        break
      case 'overlayIn2':
        this.scene.uiLayer.blueTree.destroy()
        gsap.to(this.scene.uiLayer.overlay, {
          alpha: 0.8,
          duration: 0.5,
          ease: 'linear',
        })
        break
      case 'pause':
        //if (!this.scene.giant.visible || !this.scene.archer2.visible) {
        this.scene.isPaused = true
        //}
        break
      case 'unPause':
        if (!this.scene.giant.visible || !this.scene.archer2.visible) {
          this.scene.isPaused = false
        }
        break
      case 'pause2':
        this.scene.isPaused = true
        break
      case 'showKing': {
        const king = this.scene.uiLayer.labelKing
        const blueTree = this.scene.uiLayer.blueTree

        // Создаем флаг в конструкторе TimeLine или здесь проверяем
        if (this.kingFirstTime === undefined) {
          this.kingFirstTime = true // первый раз
        }

        if (king.baseY === undefined) king.baseY = king.y
        if (blueTree.baseY === undefined) blueTree.baseY = blueTree.y
        king.popupContainer.scale.set(0)

        // Появление короля
        // Сначала ставим нужный текст
        if (this.kingFirstTime) {
          king.showFirstText()
        } else {
          king.showSecondText()
        }

        king.popupContainer.scale.set(0)

        king.visible = true
        king.y = king.baseY + 200

        gsap.to(king.popupContainer.scale, {
          y: 1,
          x: 1,
          duration: 0.7,
          ease: 'power2.out',
          onComplete: () => {
            window.resizeGame()
          },
        })

        gsap.to(king, {
          y: king.baseY,
          duration: 0.7,
          ease: 'power2.out',
          onComplete: () => {
            window.resizeGame()
            // Показываем текст в зависимости от флага

            // Через 0.7 секунды скрываем
            setTimeout(() => {
              gsap.to(king.popupContainer.scale, {
                x: 0,
                y: 0,
                duration: 0.25,
                ease: 'power2.in',
              })

              gsap.to(king.popupContainer, {
                y: king.popupContainer.y - 20,
                duration: 0.25,
                ease: 'power2.in',
              })

              gsap.to(king, {
                y: king.baseY + 200,
                duration: 0.7,
                ease: 'power2.in',
                onComplete: () => {
                  king.visible = false
                  this.scene.uiLayer.hand.renderable = true
                  this.scene.area.visible = true
                  this.scene.redArea.visible = true
                  window.resizeGame()
                  // Меняем флаг после первого раза
                  if (this.kingFirstTime) {
                    this.kingFirstTime = false
                  }
                },
              })

              blueTree.visible = true
              blueTree.y = blueTree.baseY + 200
              gsap.to(blueTree, {
                y: blueTree.baseY,
                duration: 0.7,
                ease: 'power2.out',
                onComplete: () => {
                  window.resizeGame()
                },
              })
            }, 700)
          },
        })

        // Анимация дерева
        gsap.to(blueTree, {
          y: blueTree.baseY + 200,
          duration: 0.7,
          ease: 'power2.in',
          onComplete: () => {
            blueTree.visible = false
            window.resizeGame()
          },
        })

        break
      }
      case 'showKingFirstText':
        this.scene.uiLayer.labelKing.showFirstText()
        break
      case 'showKingSecondText':
        this.scene.uiLayer.labelKing.showSecondText()
        break
      case 'hideKing': {
        const king = this.scene.uiLayer.labelKing
        const blueTree = this.scene.uiLayer.blueTree

        // 💬 POPUP исчезает в точку
        gsap.to(king.popupContainer.scale, {
          x: 0,
          y: 0,
          duration: 0.25,
          ease: 'power2.in',
        })

        gsap.to(king.popupContainer, {
          y: king.popupContainer.y - 20,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            king.showSecondText()
          },
        })

        gsap.to(king, {
          y: king.baseY + 200,
          duration: 0.7,
          ease: 'power2.in',
          onComplete: () => {
            king.visible = false
            this.scene.uiLayer.hand.renderable = true
            this.scene.area.visible = true
            this.scene.redArea.visible = true

            window.resizeGame()
          },
        })

        blueTree.visible = true
        blueTree.y = blueTree.baseY + 200

        gsap.to(blueTree, {
          y: blueTree.baseY,
          duration: 0.7,
          ease: 'power2.out',
        })

        break
      }
      case 'enemyMove1':
        gsap.to(this.scene.enemy, {
          y: this.scene.enemy.y + 180,
          duration: 2,
          ease: 'linear',
        })
        break
      case 'enemyMove2':
        gsap.to(this.scene.enemy, {
          y: this.scene.enemy.y + 100,
          duration: 2,
          ease: 'linear',
          onComplete: () => {
            gsap.to(this.scene.enemy, {
              rotation: this.scene.enemy.sprite.rotation,
              duration: 0.2,
              onComplete: () => {
                this.scene.enemy.playRun(4)
                gsap.to(this.scene.enemy, {
                  x: this.scene.enemy.x + 20,
                  y: this.scene.enemy.y + 15,
                  duration: 0.6,
                  ease: 'linear',
                  onComplete: () => {
                    this.scene.enemy.playAttack(2)
                    this.scene.giant.flashPlay()
                    this.scene.giant.healthBar.reduceHealth(10)
                  },
                })
              },
            })
          },
        })
        break
      case 'enemyMove3':
        this.scene.giant.healthBar.reduceHealth(5)
        gsap.to(this.scene.enemy, {
          x: this.scene.enemy.x - 85,
          duration: 4.7,
          ease: 'linear',
        })
        break
      case 'enemyMove4':
        this.scene.enemy.playAttack(1)
        this.scene.giant.healthBar.reduceHealth(5)
        break
      case 'enemyMove5':
        this.scene.enemy.playAttack(6)
        this.scene.giant.healthBar.reduceHealth(5)
        break
      case 'enemyMove6':
        this.scene.enemy.playAttack(7)
        this.scene.giant.healthBar.reduceHealth(5)
        break
      case 'enemyMove7':
        this.scene.enemy.playAttack(8)

        break
      case 'enemyMove8':
        this.scene.enemy.playAttack(9)
        break
      case 'enemyMove9':
        const tl1 = gsap.timeline({
          onComplete: () => {
          //  console.log('Все анимации завершены')
          },
        })

        // Добавляем анимации последовательно
        tl1
          .to(this.scene.enemy, {
            x: '+=0', // относительное смещение
            y: '+=110',
            duration: 2,
            ease: 'linear',
            onComplete: () => {
              this.scene.enemy.playRun(3)
            },
          })
          .to(this.scene.enemy, {
            x: '+=80', // добавит 100 к текущей позиции
            y: '+=50', // 190 - 120 = 70
            duration: 1.5,
            ease: 'linear',
            onComplete: () => {
              this.scene.enemy.playRun(2)
            },
          })

          .to(this.scene.enemy, {
            x: '+=30', // отнимет 50 (чтобы вернуться)
            // y: оставьте без изменений или добавьте свое значение
            duration: 0.5,
            ease: 'linear',
            onComplete: () => {
              this.scene.enemy.playAttack(2)
              const tl3 = gsap.timeline({ repeat: 0 })
              tl3
                .set(this.scene?.archer, { tint: 0xff0000 })
                .to({}, { duration: 0.3 })
                .set(this.scene?.archer, { tint: 0xffffff })
                .to({}, { duration: 0.3 })
            },
          })
          .to(this.scene.archer, {
            duration: 0.5,
            ease: 'linear',
            onComplete: () => {
              this.scene.archer.playDeath()
              this.scene.archer.clearAnimationCallbacks()

              this.scene.enemy.playRun(1)
            },
          })
          .to(this.scene.enemy, {
            x: '+=20', // добавит 100 к текущей позиции
            // y: '+=50', // 190 - 120 = 70
            duration: 0.5,
            ease: 'linear',
            onComplete: () => {
              this.scene.enemy.playAttack(1)
              const tl3 = gsap.timeline({ repeat: 0 })
              tl3
                .set(this.scene?.archer2, { tint: 0xff0000 })
                .to({}, { duration: 0.3 })
                .set(this.scene?.archer2, { tint: 0xffffff })
                .to({}, { duration: 0.3 })
            },
          })
          .to(this.scene.enemy, {
            duration: 0.5,
            ease: 'linear',
            onComplete: () => {
              this.scene.archer2.playDeath()
              this.scene.archer2.clearAnimationCallbacks()
            },
          })
          .to(this.scene.enemy, {
            duration: 0.5,
            ease: 'linear',
            onComplete: () => {
              this.scene.enemy.sprite.stop()
              this.scene.enemy.shadow.stop()
            },
          })

        break
      case 'giantMove1':
        gsap.to(this.scene.giant, {
          x: this.scene.giant.x - 30,
          y: this.scene.giant.y - 20,
          duration: 2,
          ease: 'linear',
        })
        break
      case 'giantMove2':
        gsap.to(this.scene.giant, {
          x: this.scene.giant.x - 75,
          y: this.scene.giant.y - 10,
          duration: 4,
          ease: 'linear',
        })
        break
      case 'giantMove3':
        gsap.to(this.scene.giant, {
          x: this.scene.giant.x,
          y: this.scene.giant.y - 150,
          duration: 4,
          ease: 'linear',
        })
        this.scene.giant.playRun(1)
        this.scene.giant.flashStop()
        this.scene.giant.sprite.rotation = -0.05
        break
      case 'giantMove4':
        gsap.to(this.scene.giant, {
          x: this.scene.giant.x + 100,
          y: this.scene.giant.y - 140,
          duration: 5,
          ease: 'linear',
        })
        this.scene.giant.playRun(2)
        this.scene.giant.sprite.rotation = 0.15
        this.scene.giant.sprite.scale.set(0.7, 0.7)
        break
      case 'giantMove5':
        this.scene.giant.playAttack(1)
        this.scene.giant.sprite.rotation = 0.5
        break
      case 'archerAttack':
        const blueTree = this.scene.uiLayer.blueTree
        const treeBaseY = blueTree.baseY ?? blueTree.y
        blueTree.baseY = treeBaseY

        gsap.to(blueTree, {
          y: treeBaseY + 200,
          duration: 0.7,
          ease: 'power2.in',
          onComplete: () => {
            blueTree.visible = false
          },
        })

        this.scene.redArea.renderable = false
        this.scene.archer.playAttack(4, this.scene.enemy)
        this.scene.archer2.playAttack(5, this.scene.enemy)
        this.scene.enemy.flashPlay()
        break
      case 'archerRotate':
        gsap.to(this.scene.archer.sprite, {
          duration: 1,
          rotation: -0.2,
          ease: 'linear',
        })
        break
      case 'archer2PlayRun':
        this.scene.archer2.playRun(5)
        gsap.to(this.scene.archer2, {
          x: this.scene.archer2.x - 20,
          y: this.scene.archer2.y - 20,
          duration: 1,
          ease: 'linear',
          onComplete: () => {
            this.scene.archer2.playAttack(5, this.scene.enemy)
          },
        })
        gsap.to(this.scene.archer2.sprite, {
          duration: 0.5,
          rotation: -0.03,
          ease: 'linear',
        })
        break
      case 'archerGoToBridge':
        this.scene.archer.playRun(4)
        this.scene.archer2.clearAnimationCallbacks()
        this.scene.archer.clearAnimationCallbacks()

        gsap.to(this.scene.archer, {
          x: this.scene.archer.x - 190,
          y: this.scene.archer.y - 110,
          duration: 3,
          ease: 'linear',
          onComplete: () => {
            this.scene.archer.playRun(2)
          },
        })
        break
      case 'archer2GoToBridge':
        this.scene.archer2.playRun(4)
        this.scene.archer2.clearAnimationCallbacks()
        gsap.to(this.scene.archer2, {
          x: this.scene.archer2.x - 220,
          y: this.scene.archer2.y - 80,
          duration: 3,
          ease: 'linear',
          onComplete: () => {
            this.scene.archer2.playRun(2)
            this.scene.archer.sprite.rotation = 0.18
          },
        })
        break
      case 'archerAcrossBridge':
        this.scene.archer.playRun(2)
        gsap.to(this.scene.archer, {
          y: this.scene.archer.y - 100,
          duration: 2,
          ease: 'linear',
          onComplete: () => {
            this.scene.archer.sprite.rotation = 0.28
            gsap.to(this.scene.archer, {
              x: this.scene.archer.x + 100,
              y: this.scene.archer.y - 90,
              duration: 2.8,
              ease: 'linear',
              onComplete: () => {
                this.scene.archer.playAttack(1, this.scene.throne)
              },
            })
          },
        })
        break
      case 'archer2AcrossBridge':
        this.scene.archer2.playRun(2)
        gsap.to(this.scene.archer2, {
          y: this.scene.archer2.y - 100,
          duration: 2,
          ease: 'linear',
          onComplete: () => {
            this.scene.archer2.sprite.rotation = 0.28
            gsap.to(this.scene.archer2, {
              x: this.scene.archer2.x + 50,
              y: this.scene.archer2.y - 80,
              duration: 2.8,
              ease: 'linear',
              onComplete: () => {
                this.scene.archer2.playAttack(1, this.scene.redKing)
              },
            })
          },
        })
        break
      case 'attackThrone':
        //Пульсация красного цвета
        const throne = [this.scene.throne, this.scene.redKing]

        const tl = gsap.timeline({ repeat: -1 })

        tl.set(throne, { tint: 0xff0000 })
          .to({}, { duration: 0.3 })
          .set(throne, { tint: 0xffffff })
          .to({}, { duration: 0.3 })

        gsap.to(this.scene.throne.scale, {
          x: 0.8, // сжатие
          duration: 0.3,
          ease: 'elastic.inOut(2, 0.7)',
          yoyo: true,
          repeat: -1,
        })

        break
      case 'fail':
        this.fail = new Fail()
        this.scene.uiLayer.addChild(this.fail)
        window.resizeGame()
        this.fail.scale.set(0)

        gsap
          .timeline()
          .to(this.fail.scale, { x: 1, y: 1, duration: 0.3, ease: 'back.out' })
          .to({}, { duration: 1 })
          .to(this.fail.scale, { x: 0, y: 0, duration: 0.3, ease: 'back.in' })
          .call(() => {
            this.fail.parent?.removeChild(this.fail)
            this.fail.destroy?.()
            this.fail = null
          })
        break
      case 'finalScreen':
        this.bg2 = new Bg2(this.scene.uiLayer.w, this.scene.uiLayer.h)
        this.scene.uiLayer.addChild(this.bg2)
        this.scene.objects.push(this.bg2)

        this.scene.uiLayer.overlay.alpha = 0
        this.crownAnim.destroy()

        this.scene.uiLayer.playNow.visible = true
        this.scene.uiLayer.playNow.isInCenter = true
        this.scene.uiLayer.playNow.x = this.scene.uiLayer.w / 2
        this.scene.uiLayer.playNow.y = this.scene.uiLayer.h / 2 + 200

        this.scene.uiLayer.label.visible = true
        this.scene.uiLayer.label.isInCenter = true
        this.scene.uiLayer.label.x = this.scene.uiLayer.w / 2
        this.scene.uiLayer.label.y = this.scene.uiLayer.h / 2

        // ПУЛЬСАЦИЯ
        gsap.to(this.scene.uiLayer.label.scale, {
          x: '+=0.05',
          y: '+=0.05',
          duration: 1.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })

        this.finalText = new FinalText(this.scene.uiLayer.scaleUI)
        this.finalText.x = this.scene.uiLayer.w / 2
        this.finalText.y = this.scene.uiLayer.h / 2
        this.scene.uiLayer.addChild(this.finalText)

        window.resizeGame()
        break
      case 'finalScreen2':
        this.bg2 = new Bg2(this.scene.uiLayer.w, this.scene.uiLayer.h)
        this.scene.uiLayer.addChild(this.bg2)
        this.scene.objects.push(this.bg2)

        this.scene.uiLayer.overlay.alpha = 0

        this.scene.uiLayer.playNow.visible = true
        this.scene.uiLayer.playNow.isInCenter = true
        this.scene.uiLayer.playNow.x = this.scene.uiLayer.w / 2
        this.scene.uiLayer.playNow.y = this.scene.uiLayer.h / 2 + 800

        this.retry = new Retry()
        this.scene.uiLayer.addChild(this.retry)
        this.retry.y = this.scene.uiLayer.h / 2 + 400

        this.scene.uiLayer.label.visible = true
        this.scene.uiLayer.label.isInCenter = true
        this.scene.uiLayer.label.x = this.scene.uiLayer.w / 2
        this.scene.uiLayer.label.y = this.scene.uiLayer.h / 2

        // ПУЛЬСАЦИЯ
        gsap.to(this.scene.uiLayer.label.scale, {
          x: '+=0.05',
          y: '+=0.05',
          duration: 1.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })

        this.finalText = new FinalText(this.scene.uiLayer.scaleUI)
        this.finalText.x = this.scene.uiLayer.w / 2
        this.finalText.y = this.scene.uiLayer.h / 2 - 100
        this.finalText.setText("ALRIGHT\n LET'S TURN THAT MESS\n INTO A WIN!")
        this.scene.uiLayer.addChild(this.finalText)

        window.resizeGame()
        break
    }
    if (!obj) return

    obj.x = spawn.x
    obj.y = spawn.y

    this.scene.addChild(obj)
    this.scene.objects.push(obj)
  }
}
