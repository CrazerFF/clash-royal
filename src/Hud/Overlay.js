import { Container, Graphics } from 'pixi.js';

export class Overlay extends Container {
  constructor() {
    super();
    
    this.graphics = new Graphics();
    this.addChild(this.graphics);
    this.zIndex=100
  }
  
  resize(w, h) {
    // Очищаем предыдущую графику
    this.graphics.clear();
    
    // Рисуем прямоугольник на весь экран с новыми размерами
    this.graphics
      .rect(0, 0, w, h)
      .fill({ color: 0x000000, alpha: 0.6 });
  }
}