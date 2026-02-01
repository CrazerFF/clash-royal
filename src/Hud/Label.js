import { Container, Sprite, Text, TextStyle, Assets } from 'pixi.js';

export class Label extends Container {
  constructor() {
    super();

    this.label = new Sprite(Assets.get('label'));
    this.label.anchor.set(0, 0);
    this.addChild(this.label);

    this.baseScale = 0.78;
    this.label.scale.set(this.baseScale);


    this.offSetX = 28;
    this.offSetY = 18;
  }

resize(w, h, scale_UI) {
    this.label.scale.set(this.baseScale * scale_UI);
    this.label.anchor.set(0, 0); // правый нижний угол спрайта
    this.label.x = this.offSetX * scale_UI;
    this.label.y = this.offSetY * scale_UI;
}
}