import { Container, Sprite, Assets } from 'pixi.js';

export class Throne extends Container {
  constructor(scene) {
    super();

    // Получаем спрайтшит
    const sheet = Assets.get('otherAll_json');

    // Создаем спрайт с текстурой 'throne'
    this.sprite = new Sprite(sheet.textures['throne']);
    this.sprite.anchor.set(0.5, 1); // Центр по X, низ по Y
    this.addChild(this.sprite);
  }
}
