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

  resize(w, h, scaleGame) {
    // Масштабируем спрайт относительно игры
    this.bg2.scale.set(2.4 * scaleGame);
    
    // Позиция остается по центру игрового поля
    this.bg2.position.set(
      this.DESIGN_W / 2 * scaleGame,
      this.DESIGN_H / 2 * scaleGame
    );
  }
}