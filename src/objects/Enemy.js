import { Container } from 'pixi.js';
import { AnimatedSprite, Assets } from 'pixi.js';
import { HealthBar } from './HealthBar.js';
import { Spine } from '@esotericsoftware/spine-pixi-v8'; // Новый импорт

export class Enemy extends Container {
  constructor(scene) {
    super();
    this.scene = scene;
    this.zIndex = 20;

    // Загружаем спрайтшиты
    const runSheet = Assets.get('megaknight_run_json');
    const attackSheet = Assets.get('megaknight_attack_json');

    // Создаем анимированный спрайт (по умолчанию с анимацией бега)
    this.sprite = new AnimatedSprite(runSheet.animations['megaknight_run1']);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(1);
    this.sprite.animationSpeed = 0.40;
    this.sprite.loop = true;
    this.addChild(this.sprite);

    

     this.healthBar = new HealthBar(120, 18, 'red', scene);
        this.healthBar.x -= 60;
        this.healthBar.y -= 165;
        this.addChild(this.healthBar);

    // Сохраняем все анимации бега
    this.animations = {
      run1: runSheet.animations['megaknight_run1'],
      run2: runSheet.animations['megaknight_run2'],
      run3: runSheet.animations['megaknight_run3'],
      run4: runSheet.animations['megaknight_run4'],
      run5: runSheet.animations['megaknight_run5'],
      run6: runSheet.animations['megaknight_run6'],
      run7: runSheet.animations['megaknight_run7'],
      run8: runSheet.animations['megaknight_run8'],
      run9: runSheet.animations['megaknight_run9'],
      
      // Добавляем анимации атаки
      attack1: attackSheet.animations['mknight_attack1'],
      attack2: attackSheet.animations['mknight_attack2'],
      attack3: attackSheet.animations['mknight_attack3'],
      attack4: attackSheet.animations['mknight_attack4'],
      attack5: attackSheet.animations['mknight_attack5'],
      attack6: attackSheet.animations['mknight_attack6'],
      attack7: attackSheet.animations['mknight_attack7'],
      attack8: attackSheet.animations['mknight_attack8'],
      attack9: attackSheet.animations['mknight_attack9'],
    };

    // Текущая анимация
    this.currentAnimation = 'run1';
    
    // Флаг для определения типа текущей анимации
    this.currentAnimationType = 'run';

    // Стартуем с первой анимации
    this.sprite.play();
    this.playDeath();
  }

  // Воспроизвести одну из 9 анимаций бега
  playRun(runNumber) {
    if (runNumber < 1 || runNumber > 9) {
      console.warn(`Enemy.playRun: runNumber must be 1-9, got ${runNumber}`);
      return;
    }

    this.playAnimation('run', runNumber);
  }

  // Воспроизвести одну из 5 анимаций атаки
  playAttack(attackNumber) {
    this.playAnimation('attack', attackNumber);
  }

  // Общий метод для воспроизведения анимаций
  playAnimation(type, number) {
    const animationKey = `${type}${number}`;
    const frames = this.animations[animationKey];

    if (!frames) {
      console.warn(`Enemy.playAnimation: animation ${animationKey} not found`);
      return;
    }

    // Если уже играет эта анимация - ничего не делаем
    if (this.currentAnimation === animationKey) return;

    // Устанавливаем новые кадры
    this.sprite.textures = frames;
    this.sprite.gotoAndPlay(0);
    
    // Настраиваем параметры в зависимости от типа анимации
    if (type === 'attack') {
      this.sprite.animationSpeed = 0.25; // Можно настроить скорость для атак
      this.sprite.loop = true; // Атака обычно проигрывается один раз
      
      // Добавляем обработчик завершения анимации атаки
      this.sprite.onComplete = () => {
        // Возвращаемся к анимации бега после завершения атаки
      //  this.playRun(1);
      };
    } else {
      this.sprite.animationSpeed = 0.40;
      this.sprite.loop = true;
      this.sprite.onComplete = null; // Убираем обработчик для бега
    }

    this.currentAnimation = animationKey;
    this.currentAnimationType = type;
  }

  playDeath() {
    const deathFxData = Assets.get('death_fx');
    console.log('deathFxData', deathFxData);

    // if (!deathFxData) {
    //     console.error('death_fx не загружен или spineData отсутствует!');
    //     return;
    // }

     const deathFx = new Spine({ spineData: deathFxData });
    // deathFx.x = this.sprite.x;
    // deathFx.y = this.sprite.y;

    // // Берём первую доступную анимацию
    // const animName = Object.keys(deathFxData.spineData.animations)[0];
    // console.log('Используем анимацию:', animName);

    // deathFx.state.setAnimation(0, animName, false);
    // this.addChild(deathFx);

    // deathFx.state.addListener({
    //     complete: () => deathFx.destroy()
    // });

    //this.sprite.visible = false;
  }







  update(delta) {
    // Пока пусто, можно добавить логику позже
  }
}