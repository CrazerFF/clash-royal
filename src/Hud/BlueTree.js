import { Container, Sprite, Text, TextStyle, Assets } from 'pixi.js';

export class BlueTree extends Container {
  constructor() {
    super();

    this.blueTree = new Sprite(Assets.get('blue_tree'));
    this.blueTree.anchor.set(0, 0);
    this.addChild(this.blueTree);

    this.baseScale = 0.63;
    this.blueTree.scale.set(this.baseScale);


    this.offSetX = 1;
    this.offSetY = 20;
  }

  resize(w, h, scale_UI) {
      this.blueTree.scale.set(this.baseScale * scale_UI);
      this.blueTree.anchor.set(1, 1); // правый нижний угол спрайта
      this.blueTree.x = w - this.offSetX * scale_UI;
      this.blueTree.y = h + this.offSetY * scale_UI;
  }
}