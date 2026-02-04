import { Container, Graphics, Sprite, Assets } from 'pixi.js';
import { sound } from '../objects/SoundManager.js';
import { Giant } from '../objects/Giant.js';
import { Enemy } from '../objects/Enemy.js';
import { Throne } from '../objects/RedThrone.js';
import { RedKing } from '../objects/RedKing.js';
import { BlueKing } from '../objects/BlueKing.js';
import { BlueThrone } from '../objects/BlueThrone.js';
import { Area } from '../Hud/Area.js';

export class Game extends Container {
  constructor(designWidth, designHeight, w, h, uiLayer) {
    super();
    this.DESIGN_W = designWidth;
    this.DESIGN_H = designHeight;
    this.roundPixels = true;
    this.objects = [];
    this.collidables = [];

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
    // Фон
    this.bg = new Sprite(Assets.get('bg'));
    this.addChild(this.bg);
    this.bg.anchor.set(0.5, 0.5);
    this.bg.scale.set(2.4);
    this.bg.position.set(this.DESIGN_W / 2, this.DESIGN_H / 2);
    this.objects.push(this.bg);

    // Игрок
    this.player = new Giant(this);
    this.player.x = this.DESIGN_W / 2 - 70;
    this.player.y = this.DESIGN_H / 2 + 150;
    this.addChild(this.player);
    this.player.scale.set(-0.7, 0.7);
    this.player.rotation = 0.4;
    this.player.playRun(5);
    this.objects.push(this.player);

    // Игрок
    this.enemy = new Enemy(this);
    this.enemy.x = this.DESIGN_W / 2 - 145;
    this.enemy.y = this.DESIGN_H / 2 - 155;
    this.addChild(this.enemy);
    this.enemy.scale.set(0.7);
    this.enemy.rotation = 0;
    this.enemy.playRun(5);
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
    this.area1 = new Area(370, 800); // координаты в UiLayer
    this.addChild(this.area1);
    this.objects.push(this.area1);

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
  }

  resize(DESIGN_W, DESIGN_H, w, h) {
    this.children.forEach((child) => {
      if (child?.resize) {
        child.resize(w, h);
      }
    });
  }
}
