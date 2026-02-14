import { Container } from 'pixi.js';
import { AnimatedSprite, Assets, Text, TextStyle } from 'pixi.js';
import { HealthBar } from './HealthBar.js';

export class Giant extends Container {
  constructor(scene) {
    super();
    this.scene = scene;
    this.zIndex = 50;
    this.baseScale = 1;
    this.isResize = false;

    // Загружаем три спрайтшита
    const runSheet = Assets.get('giant_run_json');
    const attackSheet = Assets.get('giant_attack_json');
    const deploySheet = Assets.get('giant_deploy_json');

    // Создаем анимированный спрайт
    this.sprite = new AnimatedSprite(runSheet.animations['giant_run1']);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(1);
    this.sprite.animationSpeed = 0.22;
    this.sprite.loop = true;
    this.addChild(this.sprite);
    this.sprite.scale.set(-0.7, 0.7);
    this.sprite.rotation = 6.2;

    // Сохраняем все анимации
    this.animations = {
      run1: runSheet.animations['giant_run1'],
      run2: runSheet.animations['giant_run2'],
      run3: runSheet.animations['giant_run3'],
      run4: runSheet.animations['giant_run4'],
      run5: runSheet.animations['giant_run5'],
      attack1: attackSheet.animations['giant_attack1'],
      attack2: attackSheet.animations['giant_attack2'],
      attack3: attackSheet.animations['giant_attack3'],
      attack4: attackSheet.animations['giant_attack4'],
      attack5: attackSheet.animations['giant_attack5'],
      deploy: deploySheet.animations['giant_deploy'],
    };

    // Переменные для мигания
    this.isFlashing = false;
    this.flashTime = 0;
    this.originalTint = 0xFFFFFF;
    this.healthBar = null;
    
    this.textGiant();
  }

  textGiant() {
    const textStyle = new TextStyle({
      fontFamily: 'font',
      fontSize: 25 * 2,
      fontWeight: '700',
      fill: '#ffffff',
      stroke: {
        color: '#000000',
        width: 6 * 1.5,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 5 * 1.5,
      dropShadowAngle: Math.PI / 2,
      align: 'center',
    });

    this.textGiant = new Text({
      text: 'Giant',
      style: textStyle,
    });
    this.textGiant.anchor.set(0.5, 1);
    this.textGiant.scale.set(0.7);
    this.textGiant.y = this.sprite.y - 90;
    this.addChild(this.textGiant);
  }

  // Включить мигание (3 раза в секунду)
  flashPlay() {
    this.isFlashing = true;
    this.flashTime = 0;
  }

  // Выключить мигание
  flashStop() {
    this.isFlashing = false;
    this.flashTime = 0;
    
    // Возвращаем оригинальные цвета
    if (this.sprite) {
      this.sprite.tint = this.originalTint;
    }
    
    if (this.healthBar) {
      this.healthBar.setType('blue');
    }
  }

updateFlash(delta) {
  if (!this.isFlashing) return;

  this.flashTime += delta;

  const flashInterval = 28.15; // оставим твой подобранный интервал
  const intervals = Math.floor(this.flashTime / flashInterval);
  const isRedFlash = intervals % 2 === 0;

  // Мигаем спрайтом
  if (this.sprite) {
    this.sprite.tint = isRedFlash ? 0xFFFFFF : 0xFF8888;
  }

  // Мигаем хелзбаром белым/синим
  if (this.healthBar) {
    this.healthBar.setHealthBarColor(isRedFlash ? 'blue' : 'white' );
  }
}



  setAttackFrame(attackNumber, frameIndex) {
    if (attackNumber < 1 || attackNumber > 5) return;

    const animationKey = `attack${attackNumber}`;
    const frames = this.animations[animationKey];

    if (!frames) return;

    this.sprite.textures = [frames[frameIndex]];
    this.sprite.gotoAndStop(0);
    this.sprite.stop();

    this.currentAnimation = animationKey;
  }

  playRun(runNumber) {
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

    if (this.currentAnimation === animationKey) return;

    this.sprite.textures = frames;
    this.sprite.loop = true;
    this.sprite.gotoAndPlay(0);

    this.currentAnimation = animationKey;
  }

  playAttack(attackNumber) {
    if (attackNumber < 1 || attackNumber > 5) {
      console.warn(`Giant.playAttack: attackNumber must be 1-5, got ${attackNumber}`);
      return;
    }

    const animationKey = `attack${attackNumber}`;
    const frames = this.animations[animationKey];

    if (!frames) {
      console.warn(`Giant.playAttack: animation ${animationKey} not found`);
      return;
    }

    if (this.currentAnimation === animationKey) return;

    this.sprite.textures = frames;
    this.sprite.loop = true;
    this.sprite.gotoAndPlay(0);

    this.currentAnimation = animationKey;
  }

  playDeploy() {
    this.textGiant.destroy();
    this.textGiant = null;
    
    // Создаем хелзбар
    this.healthBar = new HealthBar(120, 18, 'blue');
    this.healthBar.x -= 60;
    this.healthBar.y -= 110;
    this.addChild(this.healthBar);

    const animationKey = 'deploy';
    const frames = this.animations[animationKey];

    if (!frames) {
      console.warn(`Giant.playDeploy: animation ${animationKey} not found`);
      return;
    }

    if (this.currentAnimation === animationKey) return;

    this.sprite.textures = frames;
    this.sprite.loop = false;
    this.sprite.gotoAndPlay(0);

    this.currentAnimation = animationKey;

    this.sprite.onComplete = () => {
      this.sprite.rotation = 0.4;
      this.playRun(5);
      this.scene.isPaused = false;
    };
  }

  resize(w, h, scale_UI, scaleGame) {
    if (!this.isResize) return;
    this.scale.set(this.baseScale * scaleGame);
  }

  update(delta) {
    // Обновляем эффект мигания
    this.updateFlash(delta);
  }
}