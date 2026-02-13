import { Container, Graphics } from 'pixi.js';

export class HealthBar extends Container {
  constructor(width = 100, height = 14, type = 'red') {
    super();

    this.barWidth = width;
    this.barHeight = height;
    this.type = type;
    this.currentHealth = 100;
    this.zIndex = 60;
    this.roundPixels = true;

    this.createBar();
  }

  createBar() {
    this.removeChildren();

    // 1. Черная рамка с закругленными углами (увеличенная толщина)
    this.border = new Graphics();
    this.border.roundRect(0, 0, this.barWidth, this.barHeight, 6);
    this.border.fill({ color: '#000000' }); // Черная заливка

    // 2. Внутренняя область (фон) - теперь без рамки, просто заливка
    this.background = new Graphics();

    if (this.type === 'red') {
      // Темно-красный фон
      this.background.roundRect(2, 2, this.barWidth - 4, this.barHeight - 4, 4);
      this.background.fill({ color: '#9b0202' });

      // 3. Верхняя светлая полоса (30% от высоты)
      this.topHighlight = new Graphics();
      this.topHighlight.roundRect(2, 2, this.barWidth - 4, (this.barHeight - 4) * 0.3, 4);
      this.topHighlight.fill({ color: '#FFB8B8' }); // Светло-красный
    } else {
      // Темно-синий фон
      this.background.roundRect(2, 2, this.barWidth - 4, this.barHeight - 4, 4);
      this.background.fill({ color: '#4A6FA5' }); // Темно-синий

      // Верхняя светлая полоса для синего
      this.topHighlight = new Graphics();
      this.topHighlight.roundRect(2, 2, this.barWidth - 4, (this.barHeight - 4) * 0.3, 4);
      this.topHighlight.fill({ color: '#B8D0FF' }); // Светло-синий
    }

    // 4. Полоса здоровья
    this.healthFill = new Graphics();
    this.updateHealthFill();

    // Добавляем в правильном порядке
    this.addChild(this.border);
    this.addChild(this.background);
    this.addChild(this.healthFill);
    this.addChild(this.topHighlight);
  }

  updateHealthFill() {
    this.healthFill.clear();

    const fillWidth = Math.max(0, (this.barWidth - 4) * (this.currentHealth / 100));

    this.healthFill.roundRect(2, 2, fillWidth, this.barHeight - 4, 4);

    if (this.type === 'red') {
      this.healthFill.fill({ color: '#f53131' }); // Ярко-красный
    } else {
      this.healthFill.fill({ color: '#428bf8' }); // Ярко-синий
    }
  }

  reduceHealth(percent) {
    this.currentHealth = Math.max(0, this.currentHealth - percent);
    this.updateHealthFill();
    return this.currentHealth;
  }

  setHealth(percent) {
    this.currentHealth = Math.max(0, Math.min(100, percent));
    this.updateHealthFill();
  }

  heal(percent) {
    this.currentHealth = Math.min(100, this.currentHealth + percent);
    this.updateHealthFill();
  }

  setType(type) {
    if (type === 'red' || type === 'blue' || type === '#9fd7db') {
      this.type = type;
      this.createBar();
    }
  }

  setSize(width, height) {
    this.barWidth = width;
    this.barHeight = height;
    this.createBar();
  }

  // Добавьте этот метод в класс HealthBar.js
  setHealthBarColor(color) {
    // Очистим полоску здоровья и блик
    this.healthFill.clear();
    this.topHighlight.clear();

    const fillWidth = Math.max(0, (this.barWidth - 4) * (this.currentHealth / 100));
    const highlightHeight = (this.barHeight - 4) * 0.3;

    if (color === 'white') {
      // Мигание: белый для полосы и блика
      this.healthFill.roundRect(2, 2, fillWidth, this.barHeight - 4, 4);
      this.healthFill.fill({ color: 0xffffff });

      this.topHighlight.roundRect(2, 2, fillWidth, highlightHeight, 4);
      this.topHighlight.fill({ color: 0xffffff });
    } else if (color === 'blue') {
      // Восстанавливаем стандартный синий цвет
      this.healthFill.roundRect(2, 2, fillWidth, this.barHeight - 4, 4);
      this.healthFill.fill({ color: 0x428bf8 });

      this.topHighlight.roundRect(2, 2, fillWidth, highlightHeight, 4);
      this.topHighlight.fill({ color: 0xb8d0ff });
    } else if (color === 'red') {
      // Восстанавливаем стандартный красный цвет
      this.healthFill.roundRect(2, 2, fillWidth, this.barHeight - 4, 4);
      this.healthFill.fill({ color: 0xf53131 });

      this.topHighlight.roundRect(2, 2, fillWidth, highlightHeight, 4);
      this.topHighlight.fill({ color: 0xffb8b8 });
    }
  }
}
