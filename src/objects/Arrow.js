import { Container, AnimatedSprite, Assets } from 'pixi.js';

export class Arrow extends Container {
  constructor(scene) {
    super();

    this.scene = scene;
    this.speed = 7;
    this.active = true;

    const sheet = Assets.get('arrow_json');

    this.animations = {
      air: sheet.animations['arrow_air'],
      ground: sheet.animations['arrow_ground']
    };

    // Используем только ОДИН кадр из air (как в референсе)
    const firstFrame = this.animations.air[1];

    this.sprite = new AnimatedSprite([firstFrame]);
    this.sprite.anchor.set(0.5);
    this.sprite.gotoAndStop(0);

    this.addChild(this.sprite);
  }

  // -------------------------
  // Выстрел
  // -------------------------
  shoot(x, y, direction = 1) {
    this.position.set(x, y);
    this.scale.x = direction; // направление
    this.active = true;
  }

  // -------------------------
  // Обновление (движение)
  // -------------------------
  update(delta) {
    if (!this.active) return;

    this.x += this.speed * delta * this.scale.x;

    this.checkCollision();
  }

  // -------------------------
  // Проверка попадания
  // -------------------------
  checkCollision() {
    const enemy = this.scene.enemy;

    if (!enemy || !enemy.visible) return;

    const arrowBounds = this.getBounds();
    const enemyBounds = enemy.getBounds();

    const hit =
      arrowBounds.x < enemyBounds.x + enemyBounds.width &&
      arrowBounds.x + arrowBounds.width > enemyBounds.x &&
      arrowBounds.y < enemyBounds.y + enemyBounds.height &&
      arrowBounds.y + arrowBounds.height > enemyBounds.y;

    if (hit) {
      this.destroyArrow();
      enemy.takeDamage?.(10); // если есть метод у врага
    }
  }

  // -------------------------
  // Стрела в землю (если нужно)
  // -------------------------
  stickToGround() {
    this.sprite.textures = this.animations.ground;
    this.sprite.loop = false;
    this.sprite.gotoAndPlay(0);
    this.active = false;
  }

  // -------------------------
  // Удаление
  // -------------------------
  destroyArrow() {
    this.active = false;
    this.parent?.removeChild(this);
    this.destroy({ children: true });
  }
}
