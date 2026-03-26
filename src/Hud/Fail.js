import { Container, Sprite, Text, TextStyle, Assets } from 'pixi.js';

export class Fail extends Container {
  constructor() {
    super();

    this.label = new Sprite(Assets.get('fail'));
    this.label.anchor.set(0, 0);
    this.addChild(this.label);
    this.zIndex = 200
    this.baseScale = 0.78;
    this.label.scale.set(this.baseScale);

   // window.resizeGame();
  }



  resize(w, h, scale_UI) {
    this.label.anchor.set(0.5, 0.5);
    this.x = w / 2;
    this.y = h / 2 
    this.label.scale.set(1.3 * scale_UI);
    this.label.x = 0; // Обнуляем смещение внутри контейнера
    this.label.y = 0;
  }
}