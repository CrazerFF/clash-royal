import { Container } from 'pixi.js';
import { AnimatedSprite, Assets, Text, TextStyle } from 'pixi.js';

export class Giant extends Container {
  constructor(scene) {
    super();
    this.scene = scene;
    this.zIndex = 50;

    // Загружаем три спрайтшита
    const runSheet = Assets.get('giant_run_json');
    const attackSheet = Assets.get('giant_attack_json');
    const deploySheet = Assets.get('giant_deploy_json');

    // Создаем анимированный спрайт
    this.sprite = new AnimatedSprite(runSheet.animations['giant_run1']);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(1);
    this.sprite.animationSpeed = 0.24; // Фиксированная скорость
    this.sprite.loop = true;
    this.addChild(this.sprite);
    this.sprite.scale.set(-0.7, 0.7);
    this.sprite.rotation = 6.2;

    // Сохраняем все анимации
    this.animations = {
      // Бег
      run1: runSheet.animations['giant_run1'],
      run2: runSheet.animations['giant_run2'],
      run3: runSheet.animations['giant_run3'],
      run4: runSheet.animations['giant_run4'],
      run5: runSheet.animations['giant_run5'],
      
      // Атака
      attack1: attackSheet.animations['giant_attack1'],
      attack2: attackSheet.animations['giant_attack2'],
      attack3: attackSheet.animations['giant_attack3'],
      attack4: attackSheet.animations['giant_attack4'],
      attack5: attackSheet.animations['giant_attack5'],
      
      // Появление (деплой)
      deploy: deploySheet.animations['giant_deploy']
    };

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
    
        // ===== ТЕКСТ КНОПКИ =====
        this.textGiant = new Text({
          text: 'Giant',
          style: textStyle,
        });
        this.textGiant.anchor.set(0.5, 1);
        this.textGiant.scale.set(0.7);
        this.textGiant.y = this.sprite.y-90;
        this.addChild(this.textGiant);
  }

   // Установить один кадр из анимации атаки
  setAttackFrame(attackNumber, frameIndex) {
      if (attackNumber < 1 || attackNumber > 5) return;
      
      const animationKey = `attack${attackNumber}`;
      const frames = this.animations[animationKey];
      
      if (!frames) return;
      
      // Устанавливаем один кадр и останавливаем анимацию
      this.sprite.textures = [frames[frameIndex]];
      this.sprite.gotoAndStop(0);
      this.sprite.stop(); // Используем stop() вместо playing = false
      
      this.currentAnimation = animationKey;
  }

  // Воспроизвести одну из 5 анимаций бега
  playRun(runNumber) {
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
    this.sprite.loop = true;
    this.sprite.gotoAndPlay(0);

    this.currentAnimation = animationKey;
  }

  // Воспроизвести одну из 5 анимаций атаки
  playAttack(attackNumber) {
    // Проверяем номер (должен быть от 1 до 5)
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

    // Если уже играет эта анимация - ничего не делаем
    if (this.currentAnimation === animationKey) return;

    // Устанавливаем новые кадры
    this.sprite.textures = frames;
    this.sprite.loop = true; // или false, если хотите чтобы атака проигрывалась один раз
    this.sprite.gotoAndPlay(0);

    this.currentAnimation = animationKey;
  }

  // Воспроизвести анимацию появления
  playDeploy() {
    this.textGiant.destroy();
    this.textGiant = null;
    const animationKey = 'deploy';
    const frames = this.animations[animationKey];

    if (!frames) {
      console.warn(`Giant.playDeploy: animation ${animationKey} not found`);
      return;
    }

    // Если уже играет эта анимация - ничего не делаем
    if (this.currentAnimation === animationKey) return;

    // Устанавливаем новые кадры
    this.sprite.textures = frames;
    this.sprite.loop = false; // Обычно деплой проигрывается один раз
    this.sprite.gotoAndPlay(0);

    this.currentAnimation = animationKey;
    
    // Если хотите, чтобы после деплоя автоматически начинался бег
    this.sprite.onComplete = () => {
        this.rotation = 0.4;
        this.playRun(5);
    };
  }

  update(delta) {
    // Простая логика обновления
  }
}