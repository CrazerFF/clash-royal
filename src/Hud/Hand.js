import { Container, Sprite, Assets } from 'pixi.js';

export class Hand extends Container {
  constructor() {
    super();

    this.visible = false;

    // ===== СПРАЙТЫ =====
    this.fingerDown = new Sprite(Assets.get('finger_down'));
    this.fingerUp = new Sprite(Assets.get('finger_up'));

    this.fingerDown.anchor.set(0.5);
    this.fingerUp.anchor.set(0.5);

    this.addChild(this.fingerDown, this.fingerUp);

    this.fingerUp.visible = false;

    // ===== ПАРАМЕТРЫ =====
    this.baseScale = 0.3;
    this.appearScale = 0.92;

    this.alpha = 0;
    this.scale.set(this.appearScale);

    // ===== АНИМАЦИЯ =====
    this._time = 0;
    this._duration = 1300; // движение
    this._fadeTime = 300;

    this._from = { x: 0, y: 0 };
    this._to = { x: 0, y: 0 };

    this._state = 'idle';
    // idle | appear | move | release | hide
  }

  // ===== ЗАПУСК ОДНОГО ПРОХОДА =====
  play(object, toX, toY) {
    // START — координаты центра иконки в системе UiLayer
    const from = object.getBounds();
    this._from.x = from.x + from.width / 2;
    this._from.y = from.y + from.height / 2;
    // TO — тоже в системе UiLayer
    this._to.x = toX; // сюда передаем координаты в UiLayer
    this._to.y = toY;

    this.position.set(this._from.x, this._from.y);

    this.visible = true;
    this.alpha = 0;
    this.scale.set(this.appearScale);

    this.fingerDown.visible = true;
    this.fingerUp.visible = false;

    this._time = 0;
    this._state = 'appear';
  }

  update(delta) {
    if (this._state === 'idle') return;

    const dt = delta * 16.67;
    this._time += dt;

    // ===== ПОЯВЛЕНИЕ =====
    if (this._state === 'appear') {
      const t = Math.min(this._time / this._fadeTime, 1);
      this.alpha = t;
      this.scale.set(this.appearScale + (this.baseScale - this.appearScale) * t);

      if (t === 1) {
        this._time = 0;
        this._state = 'move';
      }
    }

    // ===== ДВИЖЕНИЕ =====
    else if (this._state === 'move') {
      const t = Math.min(this._time / this._duration, 1);

      this.x = this._from.x + (this._to.x - this._from.x) * t;
      this.y = this._from.y + (this._to.y - this._from.y) * t;

      if (t === 1) {
        this._time = 0;
        this.fingerDown.visible = false;
        this.fingerUp.visible = true;
        this._state = 'release';
      }
    }

    // ===== ОТПУСКАНИЕ =====
    else if (this._state === 'release') {
      const t = Math.min(this._time / this._fadeTime, 1);

      this.alpha = 1 - t;
      this.scale.set(this.baseScale + 0.05 * t);

      if (t === 1) {
        this._state = 'idle';
        this.visible = false;
      }
    }
  }

  stop() {
    this._state = 'idle';
    this.visible = false;
  }
}
