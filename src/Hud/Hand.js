import { Container, Sprite, Assets } from 'pixi.js';

export class Hand extends Container {
  constructor() {
    super();

    this.visible = false;
    this.zIndex=30;

    // ===== СПРАЙТЫ =====
    this.frame = new Sprite(Assets.get('frame'));
    this.fingerDown = new Sprite(Assets.get('finger_down'));
    this.fingerUp = new Sprite(Assets.get('finger_up'));

    this.frame.anchor.set(0.2, 0.2);
    this.frame.scale.set(0.7);
    this.fingerDown.anchor.set(0.7, 0.7);
    this.fingerUp.anchor.set(0.7, 0.7);

    this.addChild(this.frame, this.fingerDown, this.fingerUp);

    this.fingerUp.visible = false;

    // ===== ПАРАМЕТРЫ =====
    this.baseScale = 0.5;
    this.scaleLayer = 1;
    this.appearScale = 0.72;

    this.alpha = 0;
    this.scale.set(this.appearScale);

    // ===== АНИМАЦИЯ =====
    this._time = 0;
    this._duration = 700; // движение
    this._fadeTime = 300;

    this._from = { x: 0, y: 0 };
    this._to = { x: 0, y: 0 };

    this._state = 'idle';
    // idle | appear | move | release | hide
  }

  play(object, globalTarget) {
    const fromGlobal = object.getGlobalPosition();
    
    const toGlobal = globalTarget; // передаем глобальные координаты точки

    // конвертируем сразу в локальные UiLayer
    const localFrom = this.parent.toLocal(fromGlobal);
    const localTo = this.parent.toLocal(toGlobal);

    this._from.x = localFrom.x;
    this._from.y = localFrom.y;
    this._to.x = localTo.x;
    this._to.y = localTo.y;

    this.position.set(this._from.x, this._from.y);

    this.visible = true;
    this.alpha = 0;
    this.scale.set(this.appearScale *this.scaleLayer);

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
      this.scale.set((this.appearScale + (this.baseScale - this.appearScale) * t) * this.scaleLayer);

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
      this.scale.set((this.baseScale + 0.05 * t) * this.scaleLayer);

      if (t === 1) {
        this._state = 'idle';
        this.visible = false;
      }
    }
  }

  resize(w, h, scale_UI, scaleGame) {
    this.scaleLayer = scaleGame;
  }

  stop() {
   // this._state = 'idle';
    this.visible = false;
  }

  handVisible() {
    this.visible = true;
  }
}
