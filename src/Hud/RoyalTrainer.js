import { Container, Text, TextStyle } from 'pixi.js';

export class RoyalTrainer extends Container {
  constructor() {
    super();
this.roundPixels = true;
    // ===== СТИЛИ ТЕКСТА =====
    const textStyle1 = new TextStyle({
      fontFamily: 'font',
      fontSize: 20,
      fontWeight: '700',
      fill: '#00afe4',
      stroke: '#000000',
      strokeThickness: 3,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 2,
      dropShadowAngle: Math.PI / 2,
      align: 'center',
    });

    const textStyle2 = new TextStyle({
      fontFamily: 'font',
      fontSize: 14,
      fontWeight: '700',
      fill: '#e3f4a6',
      stroke: '#000000',
      strokeThickness: 3,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 0,
      dropShadowAngle: Math.PI / 2,
      align: 'center',
    });

    // ===== НАДПИСИ =====
    this.text1 = new Text({ text: "YOU", style: textStyle1 });
    this.text1.anchor.set(0, 1); // левый нижний угол текста
    this.addChild(this.text1);

    this.text2 = new Text({ text: "Royal Trainer", style: textStyle2 });
    this.text2.anchor.set(0, 1);
    this.addChild(this.text2);
  }


  // ===== РЕСАЙЗ И ПРИВЯЗКА К ЛЕВОМУ НИЖНЕМУ УГЛУ =====
  resize(width, height, scaleUI1) {
    const scaleUI = 1;
    this.x = 8 * scaleUI; // левый край канваса
    this.y = (height - 30) * scaleUI; // нижний край канваса

    // Расположим текст второй строкой под первой
    this.text2.y = 0; // текст1 "прилипает" к нижнему левому углу контейнера
    this.text1.y = (-this.text2.height +3) * scaleUI; // текст2 над text1 с отступом 5px
  }
}
