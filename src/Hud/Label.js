import { Container, Sprite, Text, TextStyle, Assets } from 'pixi.js';

export class Label extends Container {
  constructor() {
    super();

    this.label = new Sprite(Assets.get('label'));
    this.label.anchor.set(0, 0);
    this.addChild(this.label);
    this.zIndex = 200
    this.baseScale = 0.78;
    this.label.scale.set(this.baseScale);

    this.offSetX = 28;
    this.offSetY = 18;
  }

  resize(w, h, scale_UI) {
     if (this.isInCenter) {
        this.label.anchor.set(0.5, 0.5);
        this.x = w / 2;
        this.y = h / 2 - 250 * scale_UI;
        this.label.scale.set(1.3 * scale_UI);
        this.label.x = 0; // Обнуляем смещение внутри контейнера
      this.label.y = 0;
     } else {
      this.label.anchor.set(0, 0); // правый нижний угол спрайта
      this.label.x = this.offSetX * scale_UI;
      this.label.y = this.offSetY * scale_UI;
          this.label.scale.set(this.baseScale * scale_UI);

     }
  }
}
