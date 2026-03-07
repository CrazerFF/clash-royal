import { Container, Text, TextStyle } from 'pixi.js';

export class FinalText extends Container {
  constructor() {
    super();

    // ===== СТИЛЬ ТЕКСТА =====
    const textStyle = new TextStyle({
      fontFamily: 'font',
      fontSize: 25 * 2,
      fontWeight: '700',
      fill: '#ffffff',
      stroke: {
        color: '#000000',
        width: 7 * 1.5,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 5 * 1.5,
      dropShadowAngle: Math.PI / 2,
      align: 'center',
    });

    // ===== ТЕКСТ =====
    this.text = new Text({
      text: 'FIGHT IN THE NEW ARENA!',
      style: textStyle,
    });
    this.text.anchor.set(0.5, 0.55);
    this.addChild(this.text);
    this.visible = true;

    // ===== ПАРАМЕТРЫ =====
    this.baseScale = 1.2; // Базовая шкала текста
    this.offsetY = 100; // Смещение по Y от центра
    window.resizeGame(); // вызоз через несколько секунд после старта игры
  }

  // ===== МЕТОД ДЛЯ СМЕНЫ ТЕКСТА =====
  setText(newText) {
    this.text.text = newText;
  }

  // ===== МЕТОД ДЛЯ СМЕНЫ ЦВЕТА =====
  setColor(color) {
    this.text.style.fill = color;
  }

  // ===== РЕСАЙЗ =====
  resize(w, h, scale_UI) {
    // Масштабируем ВЕСЬ контейнер, а не только текст
    this.scale.set(this.baseScale * scale_UI);
    
    // Позиционируем контейнер
    this.x = w / 2;
    this.y = h / 2 + this.offsetY * scale_UI;
  }

  // ===== ПОКАЗАТЬ/СКРЫТЬ =====
  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}