import { Container, Graphics, Text } from 'pixi.js';
import { Label } from './Label.js';
import { BlueTree } from './BlueTree.js';
import { PlayNow } from './PlayNow.js';
import { RoyalTrainer } from './RoyalTrainer.js';
import { Hand } from './Hand.js';


export class UiLayer extends Container {
  constructor(designWidth, designHeight, w, h) {
    super();
    this.uiScale = new Container();
    this.addChild(this.uiScale);

    //  this.roundPixels = true;
    this.objects = [];
    // Сначала делаем ресайз, потом запускаем руку

    this.create();
  }

  create() {
    this.sortableChildren = true;

    this.label = new Label();
    this.addChild(this.label);

    this.blueTree = new BlueTree(this);
    this.addChild(this.blueTree);
    PlayNow;

    this.playNow = new PlayNow();
    this.addChild(this.playNow);

    this.royalTrainer = new RoyalTrainer();
    this.addChild(this.royalTrainer);

    this.hand = new Hand();
    this.addChild(this.hand);

  }

  update(delta) {
    this.children.forEach((child) => {
      if (child?.update) {
        child.update(delta);
      }
    });
  }
  resize(w, h, scale_UI, scaleGame) {
    this.x = 0;
    this.y = 0;

    const startGlobal = this.blueTree.giantIcon.getGlobalPosition();

    this.uiScale.scale.set(scale_UI);
    // центрируем дизайн-UI
    this.uiScale.x = (w - 660 * scale_UI) / 2;
    this.uiScale.y = (h - 1220 * scale_UI) / 2;

    this.uiScale.children.forEach((c) => c.resize?.(w, h, scale_UI, scaleGame));

    this.children.forEach((c) => {
      c.resize?.(w, h, scale_UI, scaleGame);
    });
  }
}
