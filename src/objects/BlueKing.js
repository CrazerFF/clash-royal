import { Container } from 'pixi.js';
import { AnimatedSprite, Assets } from 'pixi.js';

export class BlueKing extends Container {
  constructor(scene) {
    super();
    this.scene = scene;
    this.zIndex = 20;
    
    // Загружаем спрайтшит
    const sheet = Assets.get('blueking_json');
    
    // Создаем анимированный спрайт (idle по умолчанию)
    this.sprite = new AnimatedSprite(sheet.animations['blueking_idle']);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.animationSpeed = 0.3;
    this.sprite.loop = true;
    this.addChild(this.sprite);
    this.sprite.play();
    
    this.currentAnimation = 'idle';
  }
  
  // Переключить на анимацию канона
  playCanon() {
    const sheet = Assets.get('blueking_json');
    this.sprite.textures = sheet.animations['blueking_canon'];
    this.sprite.gotoAndPlay(0);
    this.currentAnimation = 'canon';
  }
  
  // Вернуться к idle
  playIdle() {
    const sheet = Assets.get('blueking_json');
    this.sprite.textures = sheet.animations['blueking_idle'];
    this.sprite.gotoAndPlay(0);
    this.currentAnimation = 'idle';
  }
}