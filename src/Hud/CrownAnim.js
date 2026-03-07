import { Container } from 'pixi.js';
import { Spine } from '@esotericsoftware/spine-pixi-v8';

export class CrownAnim extends Container {
  constructor(w, h, scale_UI, scaleGame, scene) {
    super();

    this.scene = scene;
    this.crownAnim = Spine.from({
      skeleton: 'crown_anim_json',
      atlas: 'crown_anim_atlas',
    });
    
    this.crownAnim.state.timeScale = 0.01;
    this.baseScale = 0.7;
    this.zIndex = 9999.5;

    this.addChild(this.crownAnim);
    this.scene.objects.push(this.crownAnim);
    this.resize(w, h, scale_UI, scaleGame);
  }

  setAnimation1() {
    if (this.listener) {
      this.crownAnim.state.removeListener(this.listener);
    }

    // Очищаем трек перед установкой новой анимации
    this.crownAnim.state.clearTrack(0);
    
    // Запускаем первую анимацию
    this.crownAnim.state.setAnimation(0, 'crown', false);
    this.crownAnim.x += 10;
    this.crownAnim.y -= 170;

    this.listener = {
      complete: (entry) => {
        if (entry.animation?.name === 'crown') {
          // Небольшая задержка перед запуском второй анимации
          setTimeout(() => {
            this.setAnimation2();
          }, 10);
        }
      }
    };

    this.crownAnim.state.addListener(this.listener);
  }

  setAnimation2() {
    // Очищаем трек перед установкой новой анимации
    this.crownAnim.state.clearTrack(0);
    
    // Запускаем вторую анимацию
    this.crownAnim.state.setAnimation(0, 'animation', false);
    this.crownAnim.y += 170;
  }

  // Альтернативный метод с использованием addAnimation
  setAnimation1Smooth() {
    if (this.listener) {
      this.crownAnim.state.removeListener(this.listener);
    }

    // Очищаем трек
    this.crownAnim.state.clearTrack(0);
    
    // Запускаем первую анимацию
    this.crownAnim.state.setAnimation(0, 'crown', false);
    this.crownAnim.x += 10;
    this.crownAnim.y -= 170;

    // Добавляем вторую анимацию в очередь с нулевой задержкой
    this.crownAnim.state.addAnimation(0, 'animation', true, 0);

    // Не нужно слушателя, так как addAnimation сам запустит следующую
  }

  setTimeScale(scale) {
    this.crownAnim.state.timeScale = scale;
  }

  resize(w, h, scale_UI, scaleGame) {
    this.crownAnim.scale.set(scaleGame * this.baseScale);
    this.x = w / 2;
    this.y = h / 2;
  }
}