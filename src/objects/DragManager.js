export class DragManager {
  constructor(game) {
    this.game = game;
    this.dragging = false;
  }

  start(sourceIcon, localPos) {
    this.game.uiLayer.hand.stop();
    this.dragging = true;

    // определяем кого таскаем
    if (sourceIcon.icon.texture.label === 'giant_icon') {
      this.dragObject = this.game.giant;
      this.game.area.setToPoint1();
    } 
    else if (sourceIcon.icon.texture.label === 'archer_icon') {
      this.dragObject = this.game.archer;
      this.game.area.setToPoint2();
    }

    if (!this.dragObject) return;

    this.dragObject.visible = true;
    this.dragObject.position.set(localPos.x, localPos.y);

    this.game.eventMode = 'static';

    this.game.on('pointermove', this.onMove, this);
    this.game.on('pointerup', this.end, this);
    this.game.on('pointerupoutside', this.end, this);
  }

  onMove(event) {
    if (!this.dragging || !this.dragObject) return;

    const pos = event.getLocalPosition(this.game);
    this.dragObject.position.set(pos.x, pos.y);
  }

  end(event) {
    if (!this.dragging || !this.dragObject) return;
     this.game.uiLayer.hand.handVisible();

    this.dragging = false;

    const pos = event.getLocalPosition(this.game);

    // Создаем области для проверки попадания
    const areaSize = 95; // должен совпадать с размером Area
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

    // Правила размещения:
    // 1. Гигант должен попасть в квадрат point1
    // 2. Лучник должен попасть в квадрат point2
    
    let shouldStayVisible = false;

  if (this.dragObject === this.game.giant) {
    shouldStayVisible = isInsidePoint1;

    if (shouldStayVisible) {
      this.game.giant.alpha = 1;
      this.game.giant.playDeploy();
    }
  } 
  else if (this.dragObject === this.game.archer) {
    shouldStayVisible = isInsidePoint2;

    if (shouldStayVisible) {
      this.game.archer.alpha = 1;
    }
  }

  if (shouldStayVisible) {
    this.dragObject.position.set(pos.x, pos.y);
  } else {
    this.dragObject.visible = false;
    this.game.area.startAnimation();
  }

    this.game.off('pointermove', this.onMove, this);
    this.game.off('pointerup', this.end, this);
    this.game.off('pointerupoutside', this.end, this);

    this.dragObject = null;
  }
}