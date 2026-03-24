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
      fontSize: 25 * 2,
      fontWeight: '700',
      fill: '#ffffff',
      stroke: {
        color: '#000000',
        width: 7 * 1.5,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 5 * 1.5,
      dropShadowAngle: Math.PI / 2,
      align: 'center',
    });
  const dpr666 = window.devicePixelRatio
  console.log('dpr666', dpr666)
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
    this.baseScaleText = 0.95;
    this.offSetX = 200;
    this.offSetY = 258;
    this.zIndex = 200

    // this.roundPixels = true;
    // this.text.roundPixels = true;

    // ===== ПУЛЬСАЦИЯ =====
    this.pulseTime = 0;
  }

  // ===== МЕТОД ПУЛЬСАЦИИ =====
  pulseAnimation(delta) {
    this.pulseTime += delta * 0.09;
    const scaleOffset = Math.sin(this.pulseTime) * 0.05;
if (this.isInCenter) {
    this.scale.set(1.7 + scaleOffset);
} else {
    // масштабируем весь контейнер
    this.scale.set(1.1 + scaleOffset);
}
  }

  update(delta) {
    this.pulseAnimation(delta);
  }

  // ===== РЕСАЙЗ КНОПКИ =====
resize(w, h, scale_UI) {
    this.screenWidth = w;
    this.screenHeight = h;
    this.currentScaleUI = scale_UI;

    // Используем флаг для определения позиции
    if (this.isInCenter) {
        
        this.x = w / 2;
        this.y = h / 2 + 300 *scale_UI;
    } else {
        this.x = this.offSetX * scale_UI;
        this.y = this.offSetY * scale_UI;
    }

    this.playNow.scale.set(this.baseScaleX * scale_UI, this.baseScaleY * scale_UI);
    this.text.scale.set(this.baseScaleText * scale_UI * 0.7);
    this.text.x = this.playNow.x + 3 * scale_UI;
    this.text.y = this.playNow.y;
}
}
