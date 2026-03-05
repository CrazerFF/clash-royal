import { Container, Graphics } from 'pixi.js';

export class RedArea extends Container {
  constructor(scene, size = 555, radius = 15) {
    super();

    this.scene = scene;

    // ===== ГРАФИКА =====
    const half = size / 2; // Исправлено: было size/4, что смещало центр
    this.graphics = new Graphics();
    this.graphics
      .roundRect(-half+10, -half+290, size, size-200, radius)
      .fill({ color: 0xff0000, alpha: 0.3 })
      .stroke({ width: 4, color: 0xff0000, alpha: 0.6 });
    this.addChild(this.graphics);

    // ===== ПОЗИЦИОНИРОВАНИЕ =====
    // Центрируем по горизонтали
    this.x = this.scene.DESIGN_W / 2;
    
    // Размещаем в верхней половине экрана (например, на 1/4 от верхнего края)
    this.y = this.scene.DESIGN_H / 4;

    
    // Альтернативные варианты для верхней половины:
    // this.y = this.scene.DESIGN_H / 3; // Чуть ниже
    // this.y = this.scene.DESIGN_H / 5; // Чуть выше
  }
}