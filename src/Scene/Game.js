import { Container, Graphics, Sprite, Assets } from 'pixi.js';
import { sound } from '../objects/SoundManager.js';
import { Giant } from '../objects/Giant.js';
import { Archer } from '../objects/Archer.js';
import { Enemy } from '../objects/Enemy.js';
import { Throne } from '../objects/RedThrone.js';
import { RedKing } from '../objects/RedKing.js';
import { BlueKing } from '../objects/BlueKing.js';
import { BlueThrone } from '../objects/BlueThrone.js';
import { DragManager } from '../objects/DragManager.js';
import { Area } from '../Hud/Area.js';
import { Hand } from '../Hud/Hand.js';
import { TimeLine } from '../objects/TimeLine.js';
import { gsap } from 'gsap';
import { Spine } from "@esotericsoftware/spine-pixi-v8";




export class Game extends Container {
  constructor(designWidth, designHeight, w, h, uiLayer) {
    super();
    this.DESIGN_W = designWidth;
    this.DESIGN_H = designHeight;
    this.roundPixels = true;
    this.uiLayer = uiLayer;
    this.objects = [];
    this.collidables = [];
    this.isPaused = false;

    this.create();

    // запуск фоновой музыки
    window.addEventListener(
      'pointerdown',
      () => {
        sound.playMusic();
      },
      { once: true }
    );
  }

  create() {
    this.sortableChildren = true;
    this.eventMode = 'static';
    this.interactive = true;
    // Фон
    this.bg = new Sprite(Assets.get('bg'));
    this.addChild(this.bg);
    this.bg.anchor.set(0.5, 0.5);
    this.bg.scale.set(2.4);
    this.bg.position.set(this.DESIGN_W / 2, this.DESIGN_H / 2);
    this.objects.push(this.bg);

    // Игрок
    this.giant = new Giant(this);
    this.giant.x = this.DESIGN_W / 2 - 70;
    this.giant.y = this.DESIGN_H / 2 + 150;
    this.addChild(this.giant);
    this.giant.alpha = 0.5;
    this.giant.setAttackFrame(1, 9);
    this.giant.visible = false;
    this.objects.push(this.giant);

    this.archer = new Archer(this);
    this.archer.x = this.DESIGN_W / 2 - 10;
    this.archer.y = this.DESIGN_H / 2 + 150;
    this.addChild(this.archer);
    this.archer.alpha = 0.5;
    this.archer.visible = false;
    this.objects.push(this.archer);


    this.archer2 = new Archer(this);
    this.archer2.x = this.DESIGN_W / 2 - 100;
    this.archer2.y = this.DESIGN_H / 2 + 150;
    this.addChild(this.archer2);
    this.archer2.alpha = 0.5;
    this.archer2.visible = false;
    this.objects.push(this.archer2);
  


    // Игрок
    this.enemy = new Enemy(this);
    this.enemy.x = this.DESIGN_W / 2 - 145;
    this.enemy.y = this.DESIGN_H / 2 - 155;
    this.addChild(this.enemy);
    this.enemy.scale.set(0.7);
  //  this.enemy.rotation = 0;
    this.enemy.playRun(5);
  // this.enemy.playAttack(8);
    this.objects.push(this.enemy);

    // Создаем трон
    this.throne = new Throne(this);
    this.throne.x = 344; // Позиция X
    this.throne.y = 415; // Позиция Y (низ трона будет в этой точке)
    this.throne.scale.set(0.65); // Масштаб если нужно
    this.addChild(this.throne);
    this.objects.push(this.throne);

    this.blueThrone = new BlueThrone(this);
    this.blueThrone.x = 344; // Позиция X
    this.blueThrone.y = 1035; // Позиция Y (низ трона будет в этой точке)
    this.blueThrone.scale.set(0.65); // Масштаб если нужно
    this.addChild(this.blueThrone);
    this.objects.push(this.blueThrone);

    // красный король
    this.redKing = new RedKing(this);
    this.redKing.x = 300 + 45;
    this.redKing.y = 480 - 75;
    this.redKing.scale.set(0.4);
    this.addChild(this.redKing);
    this.objects.push(this.redKing);
    // this.redKing.playCanon();
    this.redKing.playIdle();

    // создаём контейнер для UI
    this.area = new Area(this.uiLayer); // координаты в UiLayer
    this.addChild(this.area);
    this.objects.push(this.area);

    this.dragManager = new DragManager(this);
    this.objects.push(this.dragManager);

    this.timeLine = new TimeLine(this, 1280, 720);
    //this.timeLine.start();
    this.objects.push(this.timeLine);

    // Синий король
    this.blueking = new BlueKing(this);
    this.blueking.x = 300 + 45;
    this.blueking.y = 1015;
    this.blueking.scale.set(0.4);
    this.addChild(this.blueking);
    this.objects.push(this.blueking);
    this.blueking.playIdle();


    // const click = new Howl({ src: ['click.mp3'], volume: 0.6 });

    this.on('pointerdown', () => {
      click.play();
    });

    const music = new Howl({
      src: ['music.mp3'],
      loop: true,
      volume: 0.3,
    });

    
  }

  update(delta) {
    // апдейт всех объектов
    for (const obj of this.objects) {
      if (obj.update) obj.update(delta);
      if (obj._collectUpdate) {
        obj._collectUpdate();
      }
    }

    // if (this.timeLine?.timer) {
    //   this.timeLine.timer.update(delta);
    // }
  }

  resize(DESIGN_W, DESIGN_H, w, h) {
    this.children.forEach((child) => {
      if (child?.resize) {
        child.resize(w, h);
      }
    });
  }
}
