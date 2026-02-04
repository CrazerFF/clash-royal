import { Container, Sprite, Assets } from 'pixi.js';
import { CharacterIcon } from './CharacterIcon';

export class BlueTree extends Container {
  constructor() {
    super();

    this.baseScale = 0.61;
    this.offSetX = 0;
    this.offSetY = 20;

    // ===== ПЛАШКА =====
    this.blueTree = new Sprite(Assets.get('blue_tree'));
    this.blueTree.anchor.set(1, 1); // низ по Y, центр по X
    this.blueTree.scale.set(this.baseScale);
    this.addChild(this.blueTree);

    // ===== КНОПКИ =====
    const buttonOffsetY = -this.blueTree.height * 0.55; // кнопки чуть выше центра плашки
    const buttonSpacing = 100; // расстояние между кнопками

    this.giantIcon = new CharacterIcon({
      iconKey: 'giant_icon',
      frameKey: 'big_character_icon',
      x: -buttonSpacing -205,
      y: buttonOffsetY,
      scale: 0.49,
      iconScale: 1
    });

    this.archerIcon = new CharacterIcon({
      iconKey: 'archer_icon',
      frameKey: 'big_character_icon',
      x: buttonSpacing - 210,
      y: buttonOffsetY,
      scale: 0.49,
      iconScale: 1.05
    });

    this.addChild(this.giantIcon, this.archerIcon);
  }

  resize(w, h, scale_UI, scaleGame) {
    // ===== Масштаб контейнера =====
    const containerScale = scaleGame;
    this.scale.set(containerScale);

    // ===== Позиция контейнера =====
    if (w < h) {
      // портрет — правый нижний угол
      this.x = w;
      this.y = h + 30 * scale_UI;
    } else {
      // ландшафт — по центру снизу
      this.x = w / 2 + (this.blueTree.height / 2);
      this.y = h + (this.blueTree.height / 8) * scale_UI;
    }

    // Плашка сохраняет свой базовый масштаб
    this.blueTree.scale.set(this.baseScale);
  }

  update(delta) {
    this.children.forEach((child) => child.update?.(delta));
  }
}
