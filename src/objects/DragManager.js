export class DragManager {
  constructor(game) {
    this.game = game;
    this.dragging = false;
    this.target = null; // объект, который тащим
  }

  // start принимает объект (giant или archer) и координаты клика внутри game
  start(target, localPos) {
    this.dragging = true;
    this.target = target;
    this.target.visible = true;
    this.target.position.set(localPos.x, localPos.y);

    // подписка на события мыши
    this.game.on('pointermove', this.onMove, this);
    this.game.on('pointerup', this.end, this);
    this.game.on('pointerupoutside', this.end, this);
  }

  onMove(event) {
    if (!this.dragging) return;
    const pos = event.data.getLocalPosition(this.game);
    this.target.position.set(pos.x, pos.y);
  }

  end(event) {
    if (!this.dragging) return;
    this.dragging = false;

    const pos = event.data.getLocalPosition(this.game);

    // проверяем, куда отпущен объект
    let isCorrect = false;

    if (this.target === this.game.giant) {
      // проверка для гиганта: внутри первой точки
      const area = this.game.area; // зона area для гиганта
      isCorrect = area.isInsidePoint1(pos); 
    } else if (this.target === this.game.archer) {
      // проверка для лучника: внутри второй точки
      const area = this.game.area; // зона area для лучника
      isCorrect = area.isInsidePoint2(pos); 
    }

    if (isCorrect) {
      // оставляем на месте
      this.target.position.set(pos.x, pos.y);
      this.game.placeTarget(this.target); // например, метод, который фиксирует
    } else {
      // скрываем, если отпущен не в нужной зоне
      this.target.visible = false;
    }

    this.target = null;

    this.game.off('pointermove', this.onMove, this);
    this.game.off('pointerup', this.end, this);
    this.game.off('pointerupoutside', this.end, this);
  }
}
