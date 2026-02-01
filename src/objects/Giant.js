import { Container } from 'pixi.js';
import { AnimatedSprite, Assets } from 'pixi.js';

export class Giant extends Container {
  constructor(scene) {
    super();
    this.scene = scene;
    this.zIndex = 20;
    
    // Загружаем спрайтшит бега
    const sheet = Assets.get('giant_run_json');
    
    // Создаем анимированный спрайт
    this.sprite = new AnimatedSprite(sheet.animations['giant_run1']);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(1);
    this.sprite.animationSpeed = 0.24; // Фиксированная скорость
    this.sprite.loop = true;
    this.addChild(this.sprite);
    
    // Сохраняем все 5 анимаций бега
    this.animations = {
      run1: sheet.animations['giant_run1'],
      run2: sheet.animations['giant_run2'],
      run3: sheet.animations['giant_run3'],
      run4: sheet.animations['giant_run4'],
      run5: sheet.animations['giant_run5']
    };
    
    // Текущая анимация
    this.currentAnimation = 'run1';
    
    // Стартуем с первой анимации
    this.sprite.play();
  }
  
  // Воспроизвести одну из 5 анимаций бега
  playRun(runNumber) {
    console.log("ok");
    
    // Проверяем номер (должен быть от 1 до 5)
    if (runNumber < 1 || runNumber > 5) {
      console.warn(`Giant.playRun: runNumber must be 1-5, got ${runNumber}`);
      return;
    }
    
    const animationKey = `run${runNumber}`;
    const frames = this.animations[animationKey];
    
    if (!frames) {
      console.warn(`Giant.playRun: animation ${animationKey} not found`);
      return;
    }
    
    // Если уже играет эта анимация - ничего не делаем
    if (this.currentAnimation === animationKey) return;
    
    // Устанавливаем новые кадры
    this.sprite.textures = frames;
    this.sprite.gotoAndPlay(0);
    
    this.currentAnimation = animationKey;
  }
  
  update(delta) {
    // Пока пусто, можно добавить логику позже
  }
}