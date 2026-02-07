import { Container, Graphics } from 'pixi.js';

export class Area extends Container {
  constructor(uiLayer, size = 95, radius = 15) {
    super();

    this.uiLayer = uiLayer;

    // ===== ТОЧКИ =====
    this.point1 = { x: 250, y: 750 };
    this.point2 = { x: 370, y: 800 };

    // Стартовая позиция
    this.x = this.point1.x;
    this.y = this.point1.y;

    // ===== СОСТОЯНИЕ =====
    this.state = 'point1';
    this.timer = 0;
    this.waitTime = 1000; // пауза на точке
    this.moveTime = 1000; // время движения

    this.pointTriggered = false; // чтобы рука не вызывалась каждый кадр

    // ===== ГРАФИКА =====
    const half = size / 4;
    this.graphics = new Graphics();
    this.graphics
      .roundRect(-half, -half, size, size, radius)
      .fill(0xffffff, 0.5)
      .stroke({ width: 4, color: 0xffffff });
    this.addChild(this.graphics);
  }

  // Получаем глобальные координаты точки для передачи в Hand
  getGlobalPoint(point) {
    return this.toGlobal(point);
  }

  update(delta) {
    this.timer += delta * 16.67; // конвертируем в миллисекунды

    if (this.state === 'point1') {
      // вызываем руку один раз
      if (!this.pointTriggered) {
        this.pointTriggered = true;

      const globalPoint1 = this.getGlobalPosition(); // для point1
      this.uiLayer.hand.play(this.uiLayer.blueTree.giantIcon, globalPoint1)      }

      if (this.timer >= this.waitTime) {
        this.timer = 0;
        this.state = 'toPoint2';
        this.pointTriggered = false;
      }
    }
    else if (this.state === 'toPoint2') {
      const progress = Math.min(this.timer / this.moveTime, 1);
      const eased = this.easeInOut(progress);

      this.x = this.point1.x + (this.point2.x - this.point1.x) * eased;
      this.y = this.point1.y + (this.point2.y - this.point1.y) * eased;

      if (progress >= 1) {
        this.timer = 0;
        this.state = 'point2';
        this.x = this.point2.x;
        this.y = this.point2.y;
      }
    }
    else if (this.state === 'point2') {
      if (!this.pointTriggered) {
        this.pointTriggered = true;

      const globalPoint2 = this.getGlobalPosition(); // для point2
      this.uiLayer.hand.play(this.uiLayer.blueTree.archerIcon, globalPoint2)      }

      if (this.timer >= this.waitTime) {
        this.timer = 0;
        this.state = 'toPoint1';
        this.pointTriggered = false;
      }
    }
    else if (this.state === 'toPoint1') {
      const progress = Math.min(this.timer / this.moveTime, 1);
      const eased = this.easeInOut(progress);

      this.x = this.point2.x + (this.point1.x - this.point2.x) * eased;
      this.y = this.point2.y + (this.point1.y - this.point2.y) * eased;

      if (progress >= 1) {
        this.timer = 0;
        this.state = 'point1';
        this.x = this.point1.x;
        this.y = this.point1.y;
      }
    }
  }

  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
}
