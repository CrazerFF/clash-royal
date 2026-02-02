import { Container, Sprite, Text, TextStyle, Assets, Ticker } from 'pixi.js';

export class PlayNow extends Container {
  constructor() {
    super();

    // ===== СПРАЙТ КНОПКИ =====
    this.playNow = new Sprite(Assets.get('yellow_plate'));
    this.playNow.anchor.set(0.5);
    this.addChild(this.playNow);

    // ===== СТИЛЬ ТЕКСТА С DROP SHADOW И СОВРЕМЕННЫМ stroke =====
    const textStyle = new TextStyle({
      fontFamily: 'font',
      fontSize: 32,
      fontWeight: '700',
      fill: '#ffffff',
      stroke: '#000000', // цвет обводки
       strokeThickness: 6, // толщина обводки отдельным свойством
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 4,
    dropShadowAngle: Math.PI / 2,
      align: 'center',
    });

    // ===== ТЕКСТ КНОПКИ =====
    this.text = new Text({
      text: 'PLAY NOW',
      style: textStyle,
    });
    this.text.anchor.set(0.5, 0.55);
    this.addChild(this.text);

    // ===== ПАРАМЕТРЫ КНОПКИ =====
    this.baseScaleX = 0.88;
    this.baseScaleY = 0.68;
    this.baseScaleText = 1;
    this.offSetX = 200;
    this.offSetY = 258;

    //this.roundPixels = true;

    // ===== ПУЛЬСАЦИЯ =====
    this.pulseTime = 0;
  }

  // ===== МЕТОД ПУЛЬСАЦИИ =====
pulseAnimation(delta) {
    this.pulseTime += delta * 0.09;
    const scaleOffset = Math.sin(this.pulseTime) * 0.05; 

    // масштабируем весь контейнер
    this.scale.set(1.1 + scaleOffset);
}

  update(delta) {
      this.pulseAnimation(delta);
  }

  // ===== РЕСАЙЗ КНОПКИ =====
  resize(w, h, scale_UI) {
    this.x = this.offSetX * scale_UI;
    this.y = this.offSetY * scale_UI;

    this.playNow.scale.set(this.baseScaleX * scale_UI, this.baseScaleY * scale_UI);
    this.text.scale.set(this.baseScaleText * scale_UI);

    this.text.x = this.playNow.x;
    this.text.y = this.playNow.y;
  }
}
