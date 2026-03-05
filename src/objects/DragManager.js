export class DragManager {
  constructor(scene) {
    this.scene = scene
    this.dragging = false

    this.dragObject = null
    this.dragObject2 = null

    this.dragPreview = null
    this.dragPreview2 = null

    this.blockArcherKey = false;

    this.offset = 25
  }

  // =========================
  // START DRAG
  // =========================
  start(sourceIcon, localPos) {
    if(this.blockArcherKey) return
    if (this.scene?.uiLayer?.blueTree?.overlay?.dragFlag) {
          return
    }
    this.dragging = true

    const label = sourceIcon.icon.texture.label

    // --- GIANT ---
    if (label === 'giant_icon') {
      this.dragObject = this.scene.giant
      this.dragPreview = this.scene.uiLayer.giant2

      this.scene.area.setToPoint1()

      this.dragObject.visible = false
      this.dragPreview.visible = true

      this.updateSingle(localPos)
    }

    // --- ARCHERS ---
    else if (label === 'archer_icon') {
      this.dragObject = this.scene.archer
      this.dragObject2 = this.scene.archer2

      this.dragPreview = this.scene.uiLayer.archer3
      this.dragPreview2 = this.scene.uiLayer.archer4

      this.scene.area.setToPoint2()

      this.dragObject.visible = false
      this.dragObject2.visible = false

      this.dragPreview.visible = true
      this.dragPreview2.visible = true

      this.updateDouble(localPos)
    }

    if (!this.dragObject) return

    this.scene.on('pointermove', this.onMove, this)
    this.scene.on('pointerup', this.end, this)
    this.scene.on('pointerupoutside', this.end, this)
  }

  // =========================
  // MOVE
  // =========================
  onMove(event) {
    if (!this.dragging || !this.dragObject) return
  //  if (!this.scene.uiLayer.blueTree.overlay.dragFlag) return

    const pos = event.getLocalPosition(this.scene)

    if (this.dragObject2) {
      this.updateDouble(pos)
    } else {
      this.updateSingle(pos)
    }
  }

  updateSingle(pos) {
    const uiPos = this.toUILayer(pos)

    this.dragObject.position.set(pos.x, pos.y)
    this.dragPreview.position.set(uiPos.x, uiPos.y)
  }

  updateDouble(pos) {
    const uiPos = this.toUILayer(pos)

    this.dragObject.position.set(pos.x - this.offset, pos.y - 25)
    this.dragObject2.position.set(pos.x + this.offset, pos.y + 25)

    this.dragPreview.position.set(uiPos.x - (this.offset - 5), uiPos.y)
    this.dragPreview2.position.set(uiPos.x + (this.offset - 5), uiPos.y)
  }

  toUILayer(pos) {
    return this.scene.uiLayer.toLocal(pos, this.scene)
  }

  // =========================
  // END DRAG
  // =========================
  end(event) {
    if (!this.dragging || !this.dragObject) return
  //  if (!this.scene.uiLayer.blueTree.overlay.dragFlag) return

    this.dragging = false

    const pos = event.getLocalPosition(this.scene)

    const isInsidePoint1 = this.isInsideArea(pos, this.scene.area.point1)
    const isInsidePoint2 = this.isInsideArea(pos, this.scene.area.point2)

    let shouldStay = false

    // ================= GIANT =================
    if (this.dragObject === this.scene.giant) {
      shouldStay = isInsidePoint1

      this.dragPreview.visible = false

      if (shouldStay) {
        this.scene.uiLayer.blueTree.selectUnit('giant')
        this.dragObject.visible = true
        this.dragObject.alpha = 1
        this.dragObject.position.set(pos.x, pos.y)
        this.dragObject.playDeploy()
        this.scene.uiLayer.hand.renderable = false;
        this.scene.redArea.visible = false
        this.scene.area.point1 = this.scene.area.point2
        this.scene.area.object1 = this.scene.area.object2

        this.scene.area.startAnimation()
      } else {
        this.dragObject.visible = false
      }
    }

    // ================= ARCHERS =================
    else if (this.dragObject === this.scene.archer) {
      shouldStay = isInsidePoint2

      this.dragPreview.visible = false
      this.dragPreview2.visible = false


      if (shouldStay) {
        this.scene.uiLayer.blueTree.selectUnit('archer')
        this.blockArcherKey = true;

        this.dragObject.visible = true
        this.dragObject2.visible = true

        this.dragObject.alpha = 1
        this.dragObject2.alpha = 1

        this.dragObject.position.set(pos.x - this.offset, pos.y + 5)
        this.dragObject2.position.set(pos.x + this.offset, pos.y - 5)

        this.dragObject.playDeploy()
        this.dragObject2.playDeploy()

        this.scene.area.point2 = this.scene.area.point1
        this.scene.area.object2 = this.scene.area.object1
        //  this.scene.area.startAnimation();
        // this.scene.uiLayer.hand.stop();
        this.scene.uiLayer.hand.visible = true

        this.scene.area.visible = false
        this.dragObject2.clock()
      } else {
        this.dragObject.visible = false
        this.dragObject2.visible = false
      }
    }

    this.removeListeners()
    this.reset()
  }

  // =========================
  // HELPERS
  // =========================
  isInsideArea(pos, point) {
    const size = 95
    const half = size / 2

    return (
      pos.x >= point.x - half &&
      pos.x <= point.x + half &&
      pos.y >= point.y - half &&
      pos.y <= point.y + half
    )
  }

  removeListeners() {
    this.scene.off('pointermove', this.onMove, this)
    this.scene.off('pointerup', this.end, this)
    this.scene.off('pointerupoutside', this.end, this)
  }

  reset() {
    this.dragObject = null
    this.dragObject2 = null
    this.dragPreview = null
    this.dragPreview2 = null
  }
}
