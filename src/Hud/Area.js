import { Container, Graphics } from 'pixi.js';

export class Area extends Container {
  constructor(uiLayer, size = 95, radius = 15) {
    super();

    this.uiLayer = uiLayer;

    // ===== ТОЧКИ =====
    this.point1 = { x: 250, y: 750 };
    this.point2 = { x: 370, y: 800 };
    this.object1 = this.uiLayer.blueTree.giantIcon;
    this.object2 =  this.uiLayer.blueTree.archerIcon;

    // Стартовая позиция
    this.x = this.point1.x;
    this.y = this.point1.y;

    // ===== СОСТОЯНИЕ =====
    this.state = 'point1';
    this.timer = 0;
    this.waitTime = 1000; // пауза на точке
    this.moveTime = 1000; // время движения
    this.isAnimating = false; // флаг анимации
    this.pointTriggered = false; // чтобы рука не вызывалась каждый кадр

    // ===== ГРАФИКА =====
    const half = size / 4;
    this.graphics = new Graphics();
    this.graphics
      .roundRect(-half, -half, size, size, radius)
      .fill({ color: 0xffffff, alpha: 0.5 })
      .stroke({ width: 4, color: 0xffffff });
    this.addChild(this.graphics);

    this.startAnimation();
  }

  // Метод для установки в точку 1 (останавливает анимацию)
  setToPoint1() {
    this.isAnimating = false;
    this.state = 'point1';
    this.timer = 0;
    this.pointTriggered = false;
    this.x = this.point1.x;
    this.y = this.point1.y;
  }

  // Метод для установки в точку 2 (останавливает анимацию)
  setToPoint2() {
    this.isAnimating = false;
    this.state = 'point2';
    this.timer = 0;
    this.pointTriggered = false;
    this.x = this.point2.x;
    this.y = this.point2.y;
  }

  // Метод для запуска анимации перемещения
  startAnimation() {
    this.isAnimating = true;
    this.timer = 0;
    this.pointTriggered = false;
    
    // Устанавливаем начальное состояние в зависимости от текущей позиции
    const distanceToPoint1 = Math.sqrt(
      Math.pow(this.x - this.point1.x, 2) + 
      Math.pow(this.y - this.point1.y, 2)
    );
    const distanceToPoint2 = Math.sqrt(
      Math.pow(this.x - this.point2.x, 2) + 
      Math.pow(this.y - this.point2.y, 2)
    );
    
    // Если ближе к точке 1, начинаем с точки 1, иначе с точки 2
    if (distanceToPoint1 < distanceToPoint2) {
      this.state = 'point1';
      this.x = this.point1.x;
      this.y = this.point1.y;
    } else {
      this.state = 'point2';
      this.x = this.point2.x;
      this.y = this.point2.y;
    }
  }

  // Получаем глобальные координаты точки для передачи в Hand
  getGlobalPoint(point) {
    return this.toGlobal(point);
  }

  update(delta) {
    // Если анимация выключена, не обновляем
    if (!this.isAnimating) {
      return;
    }

    this.timer += delta * 16.67; // конвертируем в миллисекунды

    if (this.state === 'point1') {
      // вызываем руку один раз
      if (!this.pointTriggered) {
        this.pointTriggered = true;
        const globalPoint1 = this.getGlobalPosition(); // для point1
        this.uiLayer.hand.play(this.object2, globalPoint1);
      }

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
        this.uiLayer.hand.play(this.object2, globalPoint2);
      }

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