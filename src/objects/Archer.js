import { Container } from 'pixi.js';
import { AnimatedSprite, Assets, Text, TextStyle } from 'pixi.js';
import { HealthBar } from './HealthBar.js';
import { Arrow } from './Arrow.js';

export class Archer extends Container {
  constructor(scene) {
    super();
    this.scene = scene;
    this.zIndex = 50;
    this.baseScale = 0.9;
    this.isResize = false;

    // Загружаем три спрайтшита
    const runSheet = Assets.get('archer_run_json');
    const attackSheet = Assets.get('archer_attack_json');
    const deploySheet = Assets.get('archer_deploy_json');

    // Создаем анимированный спрайт
    this.sprite = new AnimatedSprite(runSheet.animations['archer_run1']);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(1);
    this.sprite.animationSpeed = 0.2;
    this.sprite.loop = true;
    this.addChild(this.sprite);
    this.sprite.scale.set(-0.7, 0.7);
    this.sprite.rotation = 6.2;

    // Сохраняем все анимации
    this.animations = {
      run1: runSheet.animations['archer_run1'],
      run2: runSheet.animations['archer_run2'],
      run3: runSheet.animations['archer_run3'],
      run4: runSheet.animations['archer_run4'],
      run5: runSheet.animations['archer_run5'],
      attack1: attackSheet.animations['archer_attack1'],
      attack2: attackSheet.animations['archer_attack2'],
      attack3: attackSheet.animations['archer_attack3'],
      attack4: attackSheet.animations['archer_attack4'],
      attack5: attackSheet.animations['archer_attack5'],
      deploy: deploySheet.animations['archer_deploy'],
    };

    // Переменные для мигания
    this.isFlashing = false;
    this.flashTime = 0;
    this.originalTint = 0xffffff;
    this.healthBar = null;

    this.textArcher();
  }

  textArcher() {
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

    this.textarcher = new Text({
      text: 'Archer',
      style: textStyle,
    });
    this.textarcher.anchor.set(0.5, 1);
    this.textarcher.scale.set(0.7);
    this.textarcher.y = this.sprite.y - 90;
    this.addChild(this.textarcher);
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
      this.sprite.tint = isRedFlash ? 0xffffff : 0xff8888;
    }

    // Мигаем хелзбаром белым/синим
    if (this.healthBar) {
      this.healthBar.setHealthBarColor(isRedFlash ? 'blue' : 'white');
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
      console.warn(`archer.playRun: runNumber must be 1-5, got ${runNumber}`);
      return;
    }

    const animationKey = `run${runNumber}`;
    const frames = this.animations[animationKey];

    if (!frames) {
      console.warn(`archer.playRun: animation ${animationKey} not found`);
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
      console.warn(`archer.playAttack: attackNumber must be 1-5, got ${attackNumber}`);
      return;
    }

    const animationKey = `attack${attackNumber}`;
    const frames = this.animations[animationKey];

    if (!frames) {
      console.warn(`archer.playAttack: animation ${animationKey} not found`);
      return;
    }

    if (this.currentAnimation === animationKey) return;

    this.sprite.textures = frames;
    this.sprite.loop = true;
    this.sprite.gotoAndPlay(0);

    this.currentAnimation = animationKey;

    this.sprite.onLoop = null;

    this.sprite.onLoop = () => {
      this.shootArrow();
       this.scene.enemy?.healthBar.reduceHealth(5);
    };
  }

  shootArrow() {
    const arrow = new Arrow(this);
    arrow.shoot(this.x, this.y, this.scene.enemy);
    this.scene.addChild(arrow);
    this.scene.objects.push(arrow);
  }

  playDeploy() {
    this.textarcher.destroy();
    this.textarcher = null;

    // Создаем хелзбар
    this.healthBar = new HealthBar(120, 18, 'blue');
    this.healthBar.x -= 40;
    this.healthBar.y -= 110;
    this.healthBar.scale.set(0.7);
    this.addChild(this.healthBar);

    const animationKey = 'deploy';
    const frames = this.animations[animationKey];

    if (!frames) {
      console.warn(`archer.playDeploy: animation ${animationKey} not found`);
      return;
    }

    if (this.currentAnimation === animationKey) return;

    this.sprite.textures = frames;
    this.sprite.loop = false;
    this.sprite.gotoAndPlay(0);

    this.currentAnimation = animationKey;

    this.sprite.onComplete = () => {
      this.sprite.rotation = 0.4;
      this.playRun(1);
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
