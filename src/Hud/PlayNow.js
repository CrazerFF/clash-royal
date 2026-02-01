import { Container, Sprite, Text, TextStyle, Assets } from 'pixi.js';

export class PlayNow extends Container {
  constructor() {
    super();

    this.playNow = new Sprite(Assets.get('yellow_plate'));
    this.playNow.anchor.set(0, 0);
    this.addChild(this.playNow);

    this.baseScaleX = 0.88;
    this.baseScaleY = 0.68;
    this.playNow.scale.set(this.baseScale);


    this.offSetX = 22;
    this.offSetY = 158;
  }

  resize(w, h, scale_UI) {
      this.playNow.scale.set(this.baseScaleX * scale_UI, this.baseScaleY * scale_UI);
      this.playNow.anchor.set(0, 0); // правый нижний угол спрайта
      this.playNow.x = this.offSetX * scale_UI;
      this.playNow.y = this.offSetY * scale_UI;
  }
}