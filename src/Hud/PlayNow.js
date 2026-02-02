import { Container, Sprite, Text, TextStyle, Assets } from 'pixi.js';

export class PlayNow extends Container {
  constructor() {
    super();

    // ===== ВНУТРЕННИЙ КОНТЕЙНЕР ДЛЯ КНОПКИ =====
    this.buttonContainer = new Container();
    this.addChild(this.buttonContainer);

    // ===== СПРАЙТ КНОПКИ =====
    this.playNow = new Sprite(Assets.get('yellow_plate'));
    this.playNow.anchor.set(0.5); // центрируем спрайт
    this.buttonContainer.addChild(this.playNow);

    // ===== СТИЛИ =====
    const mainTextStyle = new TextStyle({
      fontFamily: 'font',
      fill: '#ffffff', // основной текст — белый
      fontSize: 52 * 2,
      fontWeight: '700',
      align: 'center',
      stroke: {
        color: 0x000000,
        width: 10 * 2,
      },
    });

    const shadowTextStyle = new TextStyle({
      fontFamily: 'font',
      fill: '#000000', // тень — черная
      fontSize: 52 * 2,
      fontWeight: '700',
      align: 'center',
      stroke: {
        color: 0x000000,
        width: 10 * 2,
      },
    });

    // ===== ТЕНЬ ТЕКСТА =====
    this.textShadow = new Text({
      text: 'PLAY NOW',
      style: shadowTextStyle,
    });
    this.textShadow.anchor.set(0.5, 0.55);
    this.textShadow.scale.set(0.5);
    this.buttonContainer.addChild(this.textShadow);

    // ===== ОСНОВНОЙ ТЕКСТ =====
    this.text = new Text({
      text: 'PLAY NOW',
      style: mainTextStyle,
    });
    this.text.anchor.set(0.5, 0.55);
    this.text.scale.set(0.5);
    this.buttonContainer.addChild(this.text);

    // ===== БАЗОВЫЕ ПАРАМЕТРЫ =====
    this.baseScaleX = 0.88;
    this.baseScaleY = 0.68;
    this.offSetX = 200;
    this.offSetY = 258;

    this.baseScaleText = 0.35;

    // сразу позиционируем текст по центру кнопки
    this.centerText();
    this.roundPixels = true;
  }

  // центрируем текст относительно спрайта
  centerText() {
    const cx = this.playNow.x;
    const cy = this.playNow.y;

    this.text.x = cx;
    this.text.y = cy;

    this.textShadow.x = cx;
    this.textShadow.y = cy + 6; // тень чуть ниже
  }

  resize(w, h, scale_UI) {
    this.x = this.offSetX * scale_UI;
    this.y = this.offSetY * scale_UI;

    // масштабируем только спрайт
    this.playNow.scale.set(
      this.baseScaleX * scale_UI,
      this.baseScaleY * scale_UI,
    );

    this.text.scale.set(
       this.baseScaleText * scale_UI,
       this.baseScaleText * scale_UI,
    );

     this.textShadow.scale.set(
       this.baseScaleText * scale_UI,
       this.baseScaleText * scale_UI,
    );

    // текст остаётся без растяжения
    this.centerText();
  }
}
