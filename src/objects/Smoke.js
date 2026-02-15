import { Container, AnimatedSprite, Assets } from 'pixi.js';

export class Smoke extends Container {
  constructor() {
    super();

    const sheet = Assets.get('smoke_json');

    this.animations = {
      smoke: sheet.animations['smoke']
    };

    this.sprite = new AnimatedSprite(this.animations.smoke);
    this.sprite.anchor.set(0.5);
    this.sprite.loop = false;
    this.sprite.animationSpeed = 0.5;

    this.addChild(this.sprite);

    this.visible = false;

    this.sprite.onComplete = () => {
      this.stop();
    };
  }

  // -------------------------
  // Запуск
  // -------------------------
  play() {
    this.visible = true;
    this.sprite.gotoAndPlay(0);
  }

  // -------------------------
  // Остановка
  // -------------------------
  stop() {
    this.visible = false;
    this.sprite.gotoAndStop(0);
  }
}
