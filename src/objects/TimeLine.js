import { Enemy } from './Enemy.js'
import { sound } from './SoundManager.js'
import { TextPopup } from './TextPopup.js'
import { Timer } from '../Hud/Timer.js'

import { gsap } from 'gsap'

export class TimeLine {
  constructor(scene, designWidth, designHeight) {
    this.scene = scene
    this.designWidth = designWidth
    this.designHeight = designHeight

    // Для точечного спавна
    this.timeAccumulator = 0

    // обычные спавны по времени
    this.scheduledSpawns = [
      { time: 0.0, type: 'timer' },
      { time: 0.0, type: 'pause' },
      { time: 1.2, type: 'enemyMove1' },
      { time: 1.2, type: 'overlay' },
      { time: 1.2, type: 'showKing' },
      { time: 1.2, type: 'showKingFirstText' },
      { time: 2.3, type: 'hideKing' },
      { time: 3.1, type: 'pause' },
      { time: 3.2, type: 'enemyMove2' },
      { time: 3.3, type: 'giantMove1' },

     
    //  { time: 3.6, type: 'showKing' },
    //  { time: 3.6, type: 'showKingSecondText' },
    //  { time: 4.8, type: 'hideKing' },
      { time: 5.0, type: 'pause2' },

      { time: 5.0, type: 'archerAttack' },
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
    ]
  }

  update(delta) {
    if (!this.scene.isPaused) {
      this.timeAccumulator += delta * (1 / 60)
    }

    //  console.log('this.timeAccumulator', this.timeAccumulator);

    for (const spawn of this.scheduledSpawns) {
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

        this.scene.uiLayer.hand.visible = true;
        this.scene.area.visible = false;

        this.scene.uiLayer.addChild(this.timer)
        this.scene.uiLayer.objects.push(this.timer)
        break
      case 'overlay':
        gsap.to(this.scene.uiLayer.overlay, {
          alpha: 0,
          duration: 1.0,
          ease: 'linear',
        })
        break
      case 'pause':
        if (!this.scene.giant.visible || !this.scene.archer2.visible) {
          this.scene.isPaused = true
        }
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

  // this.scene.uiLayer.hand.visible = false;
  //       this.scene.area.visible = false;


  if (king.baseY === undefined) {
    king.baseY = king.y
  }

  king.visible = true

  king.y = king.baseY + 200

  gsap.to(king, {
    y: king.baseY,
    duration: 0.7,
    ease: 'power2.out',
  })

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

    

  gsap.to(king, {
    y: king.baseY + 200,
    duration: 0.7,
    ease: 'power2.in',
    onComplete: () => {
      king.visible = false
      this.scene.uiLayer.hand.renderable = true;
        this.scene.area.visible = true;
        this.scene.redArea.visible = true
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
        
        // this.scene.area.visible = false;

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

        this.scene.redArea.renderable = false;
        this.scene.archer.playAttack(4, this.scene.enemy)
        this.scene.archer2.playAttack(5, this.scene.enemy)
        this.scene.enemy.flashPlay()
        break
      case 'archerRotate':
        gsap.to(this.scene.archer.sprite, {
          // x: this.scene.giant.x,
          // y: this.scene.giant.y - 150,
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
            this.scene.archer2.playAttack(5)
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

      //   case 'clock':
      //     console.log('ok');

      //     obj = new Sprite(Assets.get('clock'));
      //     obj.scale.set(1.0);
      //     obj.type = 'clock';
      //     obj.anchor.set(0.5, 0.5);
      //     obj.zIndex = 350;
      //     break;
      //   case 'firework':
      //     this.scene.gameFinished = true;
      //     this.scene.seq.start();
      //     this.scene.uiLayer.installButton.visible = true;
      //     this.textPopup = new TextPopup(
      //       'Congratulations!',
      //       this.designWidth / 2 - 510,
      //       this.designHeight / 2 - 200,
      //       40
      //     );
      //     this.scene.addChild(this.textPopup);
      //     this.textPopup.zIndex = 2700;
      //     break;
      //   case 'fail':
      //     obj = new Sprite(Assets.get('fail'));
      //     obj.scale.set(1);
      //     obj.anchor.set(0.5, 0.5);
      //     obj.type = 'fail';
      //     obj.zIndex = 5000;
      //     sound.play('fail');
      //     sound.stopMusic();
      //     break;
    }
    if (!obj) return

    obj.x = spawn.x
    obj.y = spawn.y

    this.scene.addChild(obj)
    this.scene.objects.push(obj)
  }
}
