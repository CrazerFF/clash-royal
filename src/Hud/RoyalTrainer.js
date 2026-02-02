import { Container, Text, TextStyle } from 'pixi.js';

export class RoyalTrainer extends Container {
  constructor() {
    super();

    // ===== СТИЛИ ТЕКСТА =====
    const textStyle1 = new TextStyle({
      fontFamily: 'font',
      fontSize: 32,
      fontWeight: '700',
      fill: '#00e0e4',
      stroke: '#000000',
      strokeThickness: 6,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 4,
      dropShadowAngle: Math.PI / 2,
      align: 'center',
    });

    const textStyle2 = new TextStyle({
      fontFamily: 'font',
      fontSize: 24,
      fontWeight: '700',
      fill: '#ecf9bf',
      stroke: '#000000',
      strokeThickness: 6,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 4,
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
  resize(width, height, scaleUI) {
    this.x = 0; // левый край канваса
    this.y = height; // нижний край канваса

    // Расположим текст второй строкой под первой
    this.text1.y = 0; // текст1 "прилипает" к нижнему левому углу контейнера
    this.text2.y = -this.text1.height - 5; // текст2 над text1 с отступом 5px
  }
}
