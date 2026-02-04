import { Container, Text, TextStyle } from 'pixi.js';

export class RoyalTrainer extends Container {
  constructor() {
    super();

    const textStyle1 = new TextStyle({
      fontFamily: 'font',
      fontSize: 100,
      fontWeight: '700',
      fill: '#15a1ff',
      stroke: {
        color: '#000000',
        width: 16,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 11,
      dropShadowAngle: Math.PI / 2.5,
    });

    const textStyle2 = new TextStyle({
      fontFamily: 'font',
      fontSize: 52,
      fontWeight: '700',
      fill: '#ecf9bf',
      stroke: {
        color: '#000000',
        width: 6,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 4,
      dropShadowAngle: Math.PI / 2,
    });

    // нижняя строка
    this.text1 = new Text({ text: 'Royal Trainer', style: textStyle2 });
    this.text1.anchor.set(0, 1);
    this.text1.scale.set(0.7);
    this.addChild(this.text1);

    // строка над ней
    this.text2 = new Text({ text: 'YOU', style: textStyle1 });
    this.text2.anchor.set(0, 1);
    this.text2.scale.set(0.5);
    this.addChild(this.text2);

    // базовые параметры
    this.padding = 42;
    this.baseScale = 1;
  }

  resize(w, h, scale_UI, scaleGame) {
    // позиция — левый нижний угол
    if (w > h) {
      this.x = this.padding * scale_UI;
      this.y = h - this.padding * scale_UI;

      // масштабируем ВЕСЬ контейнер
      this.scale.set(this.baseScale * scaleGame);

      // раскладка текста
      this.text1.y = 0;
      this.text2.y = -this.text1.height + 3 * scale_UI;
    } else {
      const scale1 = 0.7;
      this.x = this.padding * scale_UI * scale1;
      this.y = h - this.padding * scale_UI;
      this.scale.set(this.baseScale * scaleGame * scale1);
      // раскладка текста
      this.text1.y = 0;
      this.text2.y = -this.text1.height + 3 * scale_UI;
    }
  }
}
