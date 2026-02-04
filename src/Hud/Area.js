import { Container, Graphics } from 'pixi.js';

export class Area extends Container {
  constructor(x = 0, y = 0, size = 95, radius = 15) {
    super();

    // Начинаем с точки 1
    this.x = 250;
    this.y = 750;
    
    // Состояние: 1 = точка1, 2 = точка2, moving = движение
    this.state = 'point1';
    this.timer = 0;
    
    // Тайминги в миллисекундах
    this.waitTime = 1000; // 1 секунда паузы
    this.moveTime = 1000; // 1 секунда движения

    // Рисуем квадрат
    this.graphics = new Graphics();
    const half = size / 4;
    
    this.graphics
      .clear()
      .roundRect(-half, -half, size, size, radius)
      .fill(0xffffff, 0.5)
      .stroke({ width: 4, color: 0xffffff });

    this.addChild(this.graphics);
  }

  update(delta) {
    // delta примерно 1 при 60 FPS, конвертируем в миллисекунды
    this.timer += delta * 16.67;
    
    if (this.state === 'point1') {
      // Стоим на точке 1
      if (this.timer >= this.waitTime) {
        this.timer = 0;
        this.state = 'toPoint2';
      }
    } 
    else if (this.state === 'toPoint2') {
      // Движемся к точке 2
      const progress = Math.min(this.timer / this.moveTime, 1);
      
      // Плавное движение
      const easedProgress = this.easeInOut(progress);
      
      this.x = 250 + (370 - 250) * easedProgress;
      this.y = 750 + (800 - 750) * easedProgress;
      
      if (progress >= 1) {
        this.timer = 0;
        this.state = 'point2';
        // Точная позиция
        this.x = 370;
        this.y = 800;
      }
    }
    else if (this.state === 'point2') {
      // Стоим на точке 2
      if (this.timer >= this.waitTime) {
        this.timer = 0;
        this.state = 'toPoint1';
      }
    }
    else if (this.state === 'toPoint1') {
      // Движемся к точке 1
      const progress = Math.min(this.timer / this.moveTime, 1);
      
      // Плавное движение
      const easedProgress = this.easeInOut(progress);
      
      this.x = 370 + (250 - 370) * easedProgress;
      this.y = 800 + (750 - 800) * easedProgress;
      
      if (progress >= 1) {
        this.timer = 0;
        this.state = 'point1';
        // Точная позиция
        this.x = 250;
        this.y = 750;
      }
    }
  }
  
  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
}