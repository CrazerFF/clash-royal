import { Container, Sprite, Assets } from 'pixi.js';

export class Bg2 extends Container {
  constructor(DESIGN_W, DESIGN_H) {
    super();

    this.bg2 = new Sprite(Assets.get('bg2'));
    this.bg2.anchor.set(0.5, 0.5);
    this.bg2.scale.set(2.4);
    this.bg2.position.set(DESIGN_W / 2, DESIGN_H / 2);
    this.bg2.zIndex = 1;
    
    this.addChild(this.bg2);
    
    // Сохраняем референс для ресайза
    this.DESIGN_W = DESIGN_W;
    this.DESIGN_H = DESIGN_H;
  }

resize(w, h) {

  const texW = this.bg2.texture.width
  const texH = this.bg2.texture.height

  const scale = Math.max(w / texW, h / texH)

  this.bg2.scale.set(scale)

  this.bg2.position.set(
    w / 2,
    h / 2
  )

  this.bg2.anchor.set(0.5)
}

}