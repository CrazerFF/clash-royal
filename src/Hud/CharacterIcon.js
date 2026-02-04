import { Container, Sprite, Assets, Ticker } from 'pixi.js';

export class CharacterIcon extends Container {
  constructor({
    iconKey, // 'giant_icon' | 'archer_icon'
    frameKey, // 'frame'
    x = 0,
    y = 0,
    scale = 1, // общий scale
    iconScale = 1, // scale только иконки
    onClick = null,
  }) {
    super();

    this.x = x;
    this.y = y;

    this.eventMode = 'static';
    this.cursor = 'pointer';

    // ===== ПАРАМЕТРЫ =====
    this.baseScale = scale;
    this.targetScale = scale;
    this.pressScale = scale * 0.82;

    this.scale.set(this.baseScale);

    // ===== ИКОНКА =====
    this.icon = new Sprite(Assets.get(iconKey));
    this.icon.anchor.set(0.5);
    this.icon.scale.set(iconScale);
    this.addChild(this.icon);

    // ===== РАМКА =====
    this.frame = new Sprite(Assets.get(frameKey));
    this.frame.anchor.set(0.5);
    this.frame.scale.set(0.9);
    this.addChild(this.frame);

    // ===== ЛЕВАЯ и ПРАВАЯ подсветки =====
    this.shineLeft = new Sprite(Assets.get('shine'));
    this.shineLeft.anchor.set(0.5, 0.5);
    this.shineLeft.alpha = 0;
    this.shineLeft.x = -this.frame.width / 2 + 12; // левая сторона
    this.shineLeft.y = 0;
    this.shineLeft.scale.set(0.7, 0.9);
    this.shineLeft.rotation = 7.86;
    this.addChild(this.shineLeft);

    this.shineRight = new Sprite(Assets.get('shine'));
    this.shineRight.anchor.set(0.5, 0.5);
    this.shineRight.alpha = 0;
    this.shineRight.x = this.frame.width / 2 - 12; // правая сторона
    this.shineRight.y = 0;
    this.shineRight.scale.set(0.7, 0.9);
    this.shineRight.rotation = 7.86;
    this.addChild(this.shineRight);

    // ===== Анимация =====
    this._shineTime = 0;
    this._shineDuration = 2000; // время движения вверх/вниз
    this._shineDirection = 1; // направление цикла

    // ===== СОБЫТИЯ =====
    this.on('pointerdown', this.onPress, this)
      .on('pointerup', this.onRelease, this)
      .on('pointerupoutside', this.onRelease, this);

    if (onClick) this.on('pointertap', onClick);
  }

  onPress() {
    this.targetScale = this.pressScale;

    // автоматический release через 50 мс
    clearTimeout(this._releaseTimeout);
    this._releaseTimeout = setTimeout(() => {
      this.onRelease();
    }, 50);
  }

  onRelease() {
    this.targetScale = this.baseScale;
  }

  updateAnimations(delta) {
    this._shineTime += delta * 16.67;

        // ===== плавная анимация масштаба =====
    const speed = 0.6;
    const diff = this.targetScale - this.scale.x;
    if (Math.abs(diff) > 0.001) {
      this.scale.set(this.scale.x + diff * speed * delta);
    } else {
      this.scale.set(this.targetScale);
    }

    // нормируем t от 0 до 1
    let t = (this._shineTime % this._shineDuration) / this._shineDuration;

    // цикличное движение
    if (Math.floor(this._shineTime / this._shineDuration) % 2 === 0) {
      // фаза 1: левый вверх, правый вниз
      this.shineLeft.y = -30 * t; // поднимаем
      this.shineRight.y = 30 * t; // опускаем
    } else {
      // фаза 2: левый вниз, правый вверх
      this.shineLeft.y = -30 + 40 * t; // двигаем вниз
      this.shineRight.y = 30 - 40 * t; // двигаем вверх
    }

    // alpha появляется/исчезает в начале и конце движения
    this.shineLeft.alpha = Math.sin(Math.PI * t);
    this.shineRight.alpha = Math.sin(Math.PI * t);
  }

  update(delta) {
    this.updateAnimations(delta);
  }

  destroy(options) {
    clearTimeout(this._releaseTimeout);
    this.ticker.stop();
    this.ticker.destroy();
    super.destroy(options);
  }
}
