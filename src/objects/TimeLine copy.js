import { gsap } from 'gsap';

export class TimeLine {
  constructor(scene) {
    this.scene = scene;

    this.steps = [
      () => this.enemyMove1(),
      () => this.waitForUserAction(1200),
      () => this.giantMove1(),
      () => this.enemyMove2(),
      () => this.enemyMove3(),

    ];
  }

  // запуск сценария
  async start() {
    for (const step of this.steps) {
      await step();
    }
  }

  // =========================
  // ШАГ 1 — первая анимация врага
  // =========================
  enemyMove1() {
    return new Promise(resolve => {
      gsap.to(this.scene.enemy, {
        y: this.scene.enemy.y + 180,
        duration: 2,
        ease: 'linear',
        onComplete: resolve
      });
    });
  }

  // =========================
  // ШАГ 2 — ждём деплой гиганта
  // =========================
waitForUserAction(delay) {
  return new Promise(resolve => {
    this._userActionResolve = () => {
      setTimeout(() => {
        resolve();
      }, delay); 
    };
  });
}


  giantMove1() {
    return new Promise(resolve => {
      gsap.to(this.scene.giant, {
        x: this.scene.giant.x - 20,
        y: this.scene.giant.y - 10,
        duration: 2,
        ease: 'linear',
       // onComplete: resolve
      });
      resolve();
    });
  }

  // =========================
  // ШАГ 3 — вторая атака врага
  // =========================

  enemyMove2() {
    return new Promise(resolve => {
      this.scene.enemy.playRun(5);

      gsap.to(this.scene.enemy, {
        y: this.scene.enemy.y + 120,
        duration: 2,
        ease: 'linear',
        onComplete: () => {
                resolve();
        }
      });

    });
  }


  enemyMove3() {
    return new Promise(resolve => {
      this.scene.enemy.playRun(4);

      gsap.to(this.scene.enemy, {
        x: this.scene.enemy.x + 20,
        y: this.scene.enemy.y + 15,
        duration: 0.6,
        ease: 'linear',
        onComplete: () => {
          this.scene.enemy.playAttack(2);
          this.scene.giant.flashPlay();
          this.scene.giant.healthBar.reduceHealth(10);
          resolve();
        }
      });
    });
  }

  // =========================
  // ШАГ 4 — движение гиганта
  // =========================
  
}
