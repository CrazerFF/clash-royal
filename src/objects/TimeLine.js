import { Enemy } from './Enemy.js';
import { sound } from './SoundManager.js';
import { TextPopup } from './TextPopup.js';
import { Timer } from './Timer.js';
import { gsap } from 'gsap';

export class TimeLine {
  constructor(scene, designWidth, designHeight) {
    this.scene = scene;
    this.designWidth = designWidth;
    this.designHeight = designHeight;

    // Для точечного спавна
    this.timeAccumulator = 0;

    // обычные спавны по времени
    this.scheduledSpawns = [
      //  { time: 0.0, type: 'startIntro' },
      { time: 1.2, type: 'enemyMove1' },
      { time: 3.1, type: 'pause' },
      { time: 3.2, type: 'enemyMove2' },
      { time: 3.3, type: 'giantMove1' },
     

      { time: 3.6, type: 'pause2' },
       { time: 3.7, type: 'archerAttack' },
        { time: 3.8, type: 'archerRotate' },
        { time: 3.9, type: 'archer2PlayRun' },

      { time: 3.7, type: 'giantMove2' },
      { time: 3.7, type: 'enemyMove3' },
      { time: 7.7, type: 'enemyMove4' }, // враг поворачивается влево
      { time: 8.3, type: 'enemyMove5' }, 
      { time: 9.0, type: 'enemyMove6' }, 
      { time: 9.4, type: 'enemyMove7' }, 

    
      { time: 7.7, type: 'giantMove3' },
      { time: 8.7, type: 'enemyMove5' }, // враг поворачивается влево
      { time: 11.7, type: 'giantMove4' },//идет к королю 
      { time: 16.7, type: 'giantMove5' },

    ];
  }

  update(delta) {
    if (!this.scene.isPaused) {
      this.timeAccumulator += delta * (1 / 60);
    }

  //  console.log('this.timeAccumulator', this.timeAccumulator);

    for (const spawn of this.scheduledSpawns) {
      if (!spawn.spawned && this.timeAccumulator >= spawn.time && !this.scene.isPaused) {
        this.spawnByType(spawn);
        spawn.spawned = true;
      }
    }
  }

  spawnByType(spawn) {
    let obj;
    switch (spawn.type) {
      case 'pause':
        if (!this.scene.giant.visible || !this.scene.archer2.visible) {
          this.scene.isPaused = true;
        }
        break;
      case 'pause2':
          this.scene.isPaused = true;
        break;
      case 'enemyMove1':
        gsap.to(this.scene.enemy, {
          y: this.scene.enemy.y + 180,
          duration: 2,
          ease: 'linear'
        });
        break;
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
                this.scene.enemy.playRun(4);
                gsap.to(this.scene.enemy, {
                  x: this.scene.enemy.x + 20,
                  y: this.scene.enemy.y + 15,
                  duration: 0.6,
                  ease: 'linear',
                  onComplete: () => {
                    this.scene.enemy.playAttack(2);
                    this.scene.giant.flashPlay();
                    this.scene.giant.healthBar.reduceHealth(10);
                  },
                });
              },
            });
          },
        });
        break;
      case 'enemyMove3':
        gsap.to(this.scene.enemy, {
          x: this.scene.enemy.x - 85,
          duration: 4.7,
          ease: 'linear'
        });
        break;
      case 'enemyMove4':
        this.scene.enemy.playAttack(1);
        break;
      case 'enemyMove5':
        this.scene.enemy.playAttack(6);
        break;
      case 'enemyMove6':
        this.scene.enemy.playAttack(7);
        break;
      case 'enemyMove7':
        this.scene.enemy.playAttack(8);
        break;
      case 'enemyMove8':
        this.scene.enemy.playAttack(9);
        break;
      case 'giantMove1':
        gsap.to(this.scene.giant, {
          x: this.scene.giant.x - 30,
          y: this.scene.giant.y - 20,
          duration: 2,
          ease: 'linear',
        });
        break;
       case 'giantMove2':
          gsap.to(this.scene.giant, {
            x: this.scene.giant.x - 75,
            y: this.scene.giant.y - 10,
            duration: 4,
            ease: 'linear',
          });
          break;
        case 'giantMove3':
          gsap.to(this.scene.giant, {
            x: this.scene.giant.x,
            y: this.scene.giant.y - 150,
            duration: 4,
            ease: 'linear',
          });
          this.scene.giant.playRun(1);
             this.scene.giant.flashStop();
          this.scene.giant.sprite.rotation = -0.05;
          break;
        case 'giantMove4':
          gsap.to(this.scene.giant, {
            x: this.scene.giant.x+100,
            y: this.scene.giant.y - 140,
            duration: 5,
            ease: 'linear',
          });
          this.scene.giant.playRun(2);
          this.scene.giant.sprite.rotation = 0.15;
          this.scene.giant.sprite.scale.set(0.7,0.7);
          break;
        case 'giantMove5':
          this.scene.giant.playAttack(1);
          this.scene.giant.sprite.rotation = 0.5;
          break;
        case 'archerAttack':
          this.scene.archer.playAttack(4);
          this.scene.archer2.playAttack(5);
          break;
        case 'archerRotate':
          gsap.to(this.scene.archer.sprite, {
            // x: this.scene.giant.x,
            // y: this.scene.giant.y - 150,
            duration: 1,
            rotation: -0.2,
            ease: 'linear',
          });
          break;
        case 'archer2PlayRun':
          this.scene.archer2.playRun(5);
          gsap.to(this.scene.archer2, {
             x: this.scene.archer2.x-20,
             y: this.scene.archer2.y - 20,
            duration: 1,
            ease: 'linear',
            onComplete: () => {
              this.scene.archer2.playAttack(5);
            },
          });
          gsap.to(this.scene.archer2.sprite, {
            duration: 0.5,
            rotation: -0.03,
            ease: 'linear',
          });
          break;

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
    if (!obj) return;

    obj.x = spawn.x;
    obj.y = spawn.y;

    this.scene.addChild(obj);
    this.scene.objects.push(obj);
  }
}
