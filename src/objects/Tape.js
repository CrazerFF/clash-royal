import { Container, Sprite, Assets, Mesh, RopeGeometry, Point } from "pixi.js";

export class Tape extends Container {
  constructor(x, y) {
    super();

    this.x = x;
    this.y = y;

    this.torn = false;
    this.secondWaveDone = false;

    // ===== КОЛЫШКИ =====
    this.stick1 = new Sprite(Assets.get("stick"));
    this.stick2 = new Sprite(Assets.get("stick"));

    this.stick1.anchor.set(0.5, 1);
    this.stick2.anchor.set(0.5, 1);

    this.stick1.position.set(0, 140);
    this.stick2.position.set(60, 190);

    this.stick1.scale.set(0.6);
    this.stick2.scale.set(0.6);

    this.stick1.rotation = Math.PI / 2;
    this.stick2.rotation = Math.PI / 2;
    this.stick2.zIndex = 500;

    // ===== ЦЕЛАЯ ЛЕНТА =====
    this.tape1 = new Sprite(Assets.get("tape1"));
    this.tape2 = new Sprite(Assets.get("tape2"));

    this.tape1.anchor.set(0, 0.5);
    this.tape2.anchor.set(1, 0.5);

    this.tape1.position.set(3, 106);
    this.tape2.position.set(65, 160);

    this.tape1.scale.set(1, 0.6);
    this.tape2.scale.set(1, 0.6);

    this.tape1.rotation = Math.PI / 3.3;
    this.tape2.rotation = Math.PI / 5.6;

    this.addChild(this.stick1, this.stick2, this.tape1, this.tape2);

    // ===== ДАННЫЕ ДЛЯ РАЗРЫВА =====
    this.leftPoints = [];
    this.leftVel = [];
    this.leftMesh = null;
    this.leftGeometry = null;

    this.rightPoints = [];
    this.rightVel = [];
    this.rightMesh = null;
    this.rightGeometry = null;
  }

  // ======================================================
  // РАЗРЫВ ЛЕНТЫ
  // ======================================================
  tear() {
    if (this.torn) return;
    this.torn = true;

    this.removeChild(this.tape1, this.tape2);

    const segments = 10;
    const midX = (this.stick1.x + this.stick2.x) * 0.5;
    const midY = (this.stick1.y + this.stick2.y) * 0.5 - 35;

    // ---------- ЛЕВАЯ ----------
    this.leftPoints.length = 0;
    this.leftVel.length = 0;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;

      this.leftPoints.push(
        new Point(
          this.stick1.x + (midX - this.stick1.x) * t,
          this.stick1.y - 30 + (midY - (this.stick1.y - 30)) * t,
        ),
      );

      this.leftVel.push({ x: 0, y: 0 });
    }

    this.leftVel[1].y = 8;
    this.leftVel[2].y = 4;
    this.leftVel[1].x = -3.5;
    this.leftVel[2].x = -2;

    this.leftGeometry = new RopeGeometry({
      points: this.leftPoints,
      textureScale: 0.35,
    });

    this.leftMesh = new Mesh({
      geometry: this.leftGeometry,
      texture: Assets.get("tape1"),
    });

    this.leftMesh.scale.x = 0.19;
    this.leftMesh.x += 6;

    // ---------- ПРАВАЯ ----------
    this.rightPoints.length = 0;
    this.rightVel.length = 0;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;

      this.rightPoints.push(
        new Point(
          this.stick2.x + (midX - this.stick2.x) * t,
          this.stick2.y - 30 + (midY - (this.stick2.y - 30)) * t,
        ),
      );

      this.rightVel.push({ x: 0, y: 0 });
    }

    this.rightVel[1].y = 6;
    this.rightVel[2].y = 3;
    this.rightVel[1].x = 3.5;
    this.rightVel[2].x = 2;
    this.leftMesh.zIndex = 100;

    this.rightGeometry = new RopeGeometry({
      points: this.rightPoints,
      textureScale: 0.35,
    });

    this.rightMesh = new Mesh({
      geometry: this.rightGeometry,
      texture: Assets.get("tape1"),
    });

    this.rightMesh.scale.x = 0.19;
    this.rightMesh.scale.y = 1;
    this.rightMesh.x = 55;
    this.rightMesh.y = -5;

    this.addChild(this.leftMesh, this.rightMesh);
  }

  // ======================================================
  // ФИЗИКА ЛЕНТЫ
  // ======================================================
  updateRope(points, velocities, fixedX, fixedY, delta) {
    const gravity = 0.18 * delta;
    const friction = 0.979;
    const stiffness = 0.37;
    const segmentLength = 20;

    // движение
    for (let i = 1; i < points.length; i++) {
      velocities[i].y += gravity;

      velocities[i].x *= friction;
      velocities[i].y *= friction;

      points[i].x += velocities[i].x+0.25;
      points[i].y += velocities[i].y;
    }

    // фикс
    points[0].set(fixedX, fixedY);

    // растяжение
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];

      const dx = p1.x - p0.x + 0.1;
      const dy = p1.y - p0.y + 0.1;

      const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
      const diff = (dist - segmentLength) / dist;

      const ox = dx * diff * stiffness;
      const oy = dy * diff * stiffness;

      if (i !== 1) {
        p0.x += ox;
        p0.y += oy;
      }

      p1.x -= ox;
      p1.y -= oy;
    }

    // вторая волна
    const tail = points.length - 1;

    if (!this.secondWaveDone && points[tail].y > points[tail - 1].y + 5) {
      velocities[tail].y -= 16;
      velocities[tail - 1].y -= 40;
      velocities[tail - 2].y -= 20;

      this.secondWaveDone = true;
    }

    velocities[tail].x += Math.sin(points[tail].y * 2.31) * 2.5;
  }

  // ======================================================
  update(delta) {
    if (!this.torn) return;

    this.updateRope(
      this.leftPoints,
      this.leftVel,
      this.stick1.x,
      this.stick1.y - 30,
      delta,
    );

    this.updateRope(
      this.rightPoints,
      this.rightVel,
      this.stick2.x,
      this.stick2.y - 30,
      delta,
    );

    this.leftGeometry?.update();
    this.rightGeometry?.update();
  }
}
