export class DragManager {
  constructor(game) {
    this.game = game;
    this.dragging = false;

    this.dragObject = null;
    this.dragObject2 = null;

    this.dragPreview = null;
    this.dragPreview2 = null;

    this.offset = 25;
  }

  // =========================
  // START DRAG
  // =========================
  start(sourceIcon, localPos) {
    this.dragging = true;

    const label = sourceIcon.icon.texture.label;

    // --- GIANT ---
    if (label === 'giant_icon') {
      this.dragObject = this.game.giant;
      this.dragPreview = this.game.uiLayer.giant2;

      this.game.area.setToPoint1();

      this.dragObject.visible = false;
      this.dragPreview.visible = true;

      this.updateSingle(localPos);
    }

    // --- ARCHERS ---
    else if (label === 'archer_icon') {
      this.dragObject = this.game.archer;
      this.dragObject2 = this.game.archer2;

      this.dragPreview = this.game.uiLayer.archer3;
      this.dragPreview2 = this.game.uiLayer.archer4;

      this.game.area.setToPoint2();

      this.dragObject.visible = false;
      this.dragObject2.visible = false;

      this.dragPreview.visible = true;
      this.dragPreview2.visible = true;

      this.updateDouble(localPos);
    }

    if (!this.dragObject) return;

    this.game.on('pointermove', this.onMove, this);
    this.game.on('pointerup', this.end, this);
    this.game.on('pointerupoutside', this.end, this);
  }

  // =========================
  // MOVE
  // =========================
  onMove(event) {
    if (!this.dragging || !this.dragObject) return;

    const pos = event.getLocalPosition(this.game);

    if (this.dragObject2) {
      this.updateDouble(pos);
    } else {
      this.updateSingle(pos);
    }
  }

  updateSingle(pos) {
    const uiPos = this.toUILayer(pos);

    this.dragObject.position.set(pos.x, pos.y);
    this.dragPreview.position.set(uiPos.x, uiPos.y);
  }

  updateDouble(pos) {
    const uiPos = this.toUILayer(pos);

    this.dragObject.position.set(pos.x - this.offset, pos.y-25);
    this.dragObject2.position.set(pos.x + this.offset, pos.y+25);

    this.dragPreview.position.set(uiPos.x - (this.offset-5), uiPos.y);
    this.dragPreview2.position.set(uiPos.x + (this.offset-5), uiPos.y);
  }

  toUILayer(pos) {
    return this.game.uiLayer.toLocal(pos, this.game);
  }

  // =========================
  // END DRAG
  // =========================
  end(event) {
    if (!this.dragging || !this.dragObject) return;

    this.dragging = false;

    const pos = event.getLocalPosition(this.game);

    const isInsidePoint1 = this.isInsideArea(pos, this.game.area.point1);
    const isInsidePoint2 = this.isInsideArea(pos, this.game.area.point2);

    let shouldStay = false;

    // ================= GIANT =================
    if (this.dragObject === this.game.giant) {
      shouldStay = isInsidePoint1;

      this.dragPreview.visible = false;

      if (shouldStay) {
        this.dragObject.visible = true;
        this.dragObject.alpha = 1;
        this.dragObject.position.set(pos.x, pos.y);
        this.dragObject.playDeploy();

        this.game.area.startAnimation();
      } else {
        this.dragObject.visible = false;
      }
    }

    // ================= ARCHERS =================
    else if (this.dragObject === this.game.archer) {
      shouldStay = isInsidePoint2;

      this.dragPreview.visible = false;
      this.dragPreview2.visible = false;

      if (shouldStay) {
        this.dragObject.visible = true;
        this.dragObject2.visible = true;

        this.dragObject.alpha = 1;
        this.dragObject2.alpha = 1;

        this.dragObject.position.set(pos.x - this.offset, pos.y+5);
        this.dragObject2.position.set(pos.x + this.offset, pos.y-5);

        this.dragObject.playDeploy();
        this.dragObject2.playDeploy();

        this.game.uiLayer.hand.stop();
        this.game.uiLayer.hand.visible = false;

        this.game.area.visible = false;
      } else {
        this.dragObject.visible = false;
        this.dragObject2.visible = false;
      }
    }

    this.removeListeners();
    this.reset();
  }

  // =========================
  // HELPERS
  // =========================
  isInsideArea(pos, point) {
    const size = 95;
    const half = size / 2;

    return (
      pos.x >= point.x - half &&
      pos.x <= point.x + half &&
      pos.y >= point.y - half &&
      pos.y <= point.y + half
    );
  }

  removeListeners() {
    this.game.off('pointermove', this.onMove, this);
    this.game.off('pointerup', this.end, this);
    this.game.off('pointerupoutside', this.end, this);
  }

  reset() {
    this.dragObject = null;
    this.dragObject2 = null;
    this.dragPreview = null;
    this.dragPreview2 = null;
  }
}
