export class DragManager {
  constructor(game) {
    this.game = game;
    this.dragging = false;
  }

start(sourceIcon, localPos) {
  this.dragging = true;

  if (sourceIcon.icon.texture.label === 'giant_icon') {
    this.dragObject = this.game.giant;
    this.dragPreview = this.game.uiLayer.giant2;
    this.game.area.setToPoint1();
  } 
  else if (sourceIcon.icon.texture.label === 'archer_icon') {
    this.dragObject = this.game.archer;
    this.dragPreview = this.game.uiLayer.archer3;
    this.game.area.setToPoint2();
  }

  if (!this.dragObject) return;

  this.dragPreview.visible = true;

  this.dragObject.position.set(localPos.x, localPos.y);
  this.dragPreview.position.set(localPos.x, localPos.y);

  this.game.on('pointermove', this.onMove, this);
  this.game.on('pointerup', this.end, this);
  this.game.on('pointerupoutside', this.end, this);
}


onMove(event) {
  if (!this.dragging || !this.dragObject) return;

  const pos = event.getLocalPosition(this.game);
  const pos2 = event.getLocalPosition(this.game.uiLayer);

  this.dragObject.position.set(pos.x, pos.y);
  this.dragPreview.position.set(pos2.x, pos2.y);
}


end(event) {
  this.game.area.startAnimation();
  if (!this.dragging || !this.dragObject) return;

  this.dragObject.visible = true;
this.dragPreview.visible = false;

  this.dragObject.visible = true;
  this.game.uiLayer.giant2.visible = false;
  this.game.uiLayer.hand.visible = true; // Оставляем руку видимой

  this.dragging = false;

  const pos = event.getLocalPosition(this.game);

  // Создаем области для проверки попадания
  const areaSize = 95;
  const areaHalf = areaSize / 2;

  // Проверяем попадание в квадрат point1
  const isInsidePoint1 =
    pos.x >= this.game.area.point1.x - areaHalf &&
    pos.x <= this.game.area.point1.x + areaHalf &&
    pos.y >= this.game.area.point1.y - areaHalf &&
    pos.y <= this.game.area.point1.y + areaHalf;

  // Проверяем попадание в квадрат point2
  const isInsidePoint2 =
    pos.x >= this.game.area.point2.x - areaHalf &&
    pos.x <= this.game.area.point2.x + areaHalf &&
    pos.y >= this.game.area.point2.y - areaHalf &&
    pos.y <= this.game.area.point2.y + areaHalf;

  let shouldStayVisible = false;

  if (this.dragObject === this.game.giant) {
    shouldStayVisible = isInsidePoint1;

    if (shouldStayVisible) {
      this.game.giant.alpha = 1;
      this.game.giant.playDeploy();

      this.game.area.point1 = this.game.area.point2;
      this.game.area.object1 = this.game.area.object2;
      this.game.area.startAnimation();
    }
  } else if (this.dragObject === this.game.archer) {
    shouldStayVisible = isInsidePoint2;

    if (shouldStayVisible) {
      this.game.archer.alpha = 1;
      this.game.archer.playDeploy();
      this.game.area.visible = false;
      this.game.area.setToPoint2();

      // ОСТАНАВЛИВАЕМ РУКУ И ДЕЛАЕМ ЕЕ НЕВИДИМОЙ
      this.game.uiLayer.hand.stop();
      this.game.uiLayer.hand.visible = false;
    }
  }

  if (shouldStayVisible) {
    this.dragObject.position.set(pos.x, pos.y);
  } else {
    this.dragObject.visible = false;
  }

  this.game.off('pointermove', this.onMove, this);
  this.game.off('pointerup', this.end, this);
  this.game.off('pointerupoutside', this.end, this);

  this.dragObject = null;
  this.dragPreview = null;
  this.dragObject = null;
}
}
