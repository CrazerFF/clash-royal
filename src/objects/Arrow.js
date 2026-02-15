import { Container, AnimatedSprite, Assets } from 'pixi.js';

export class Arrow extends Container {
  constructor(scene) {
    super();

    this.scene = scene;
    this.speed = 12;
    this.active = true;

    this.direction = { x: 0, y: 0 };
    this.target = null;

    const sheet = Assets.get('arrow_json');

    this.animations = {
      air: sheet.animations['arrow_air'],
      ground: sheet.animations['arrow_ground'],
    };

    // Используем только ОДИН кадр из air (как в референсе)
    const firstFrame = this.animations.air[0];

    this.sprite = new AnimatedSprite([firstFrame]);
    this.sprite.anchor.set(0.5);
    this.sprite.gotoAndStop(0);
   // this.sprite.rotation = 1.56;
    this.sprite.rotation = 0.1;
    this.sprite.scale.set(0.8);

    this.addChild(this.sprite);
  }

  // -------------------------
  // Выстрел
  // -------------------------
shoot(x, y, target) {
  this.position.set(x, y);
  this.target = target;
  this.active = true;

  if (!target) return;

  // центр цели
  const tx = target.x;
  const ty = target.y;

  // вектор направления
  const dx = tx - x;
  const dy = ty - y;

  const length = Math.sqrt(dx * dx + dy * dy);

  // нормализуем
  this.direction.x = dx / length;
  this.direction.y = dy / length;

  // поворот стрелы
  const angle = Math.atan2(dy, dx);

  // ВАЖНО:
  // твоя стрела изначально "смотрит" влево (180°)
  // значит добавляем PI
  this.sprite.rotation = angle + 1.56;
}


  // -------------------------
  // Обновление (движение)
  // -------------------------
update(delta) {
  if (!this.active) return;

  this.x += this.direction.x * this.speed * delta;
  this.y += this.direction.y * this.speed * delta;

  this.checkCollision();
}


  // -------------------------
  // Проверка попадания
  // -------------------------
checkCollision() {
  const enemy = this.target;
  if (!enemy || !enemy.visible) return;

  // центр врага
  const ex = enemy.x;
  const ey = enemy.y;

  const dx = ex - this.x;
  const dy = ey - this.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  const hitRadius = 30; // подбери под размер врага

  if (distance < hitRadius) {
    this.destroyArrow();
  }
}

  stop() {
  this.active = false;
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
