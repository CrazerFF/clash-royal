import { Application, Assets } from 'pixi.js';
import { manifest } from './objects/Manifest.js';
import { Game } from './Scene/Game.js';
import { UiLayer } from './Hud/UiLayer.js';

(async () => {
  const DESIGN_W = 660;
  const DESIGN_H = 1220;

  const DESIGN_W_UI = 1220;
  const DESIGN_H_UI = 1220;

  const app = new Application();

  // =====  ИНИЦИАЛИЗАЦИЯ — ЧЁРНЫЙ ЭКРАН =====
  await app.init({
    backgroundColor: 0x000000,
    antialias: false,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });

  globalThis.__PIXI_APP__ = app;

  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.background = '#000';

  document.body.appendChild(app.canvas);

  app.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  app.canvas.style.touchAction = 'none';

  // =====  ЗАГРУЗКА ШРИФТА =====
  let fontLoaded = false;

  try {
    const font = new FontFace('font', 'url(assets/fonts/font4.woff2)');
    const loadedFont = await font.load();
    document.fonts.add(loadedFont);
    fontLoaded = true;
  } catch (e) {
    console.warn('Шрифт не загрузился, используем системный');
  }

  await document.fonts.ready;

  // =====  ЗАГРУЗКА РЕСУРСОВ =====
  try {
    await Assets.init({ manifest });
    await Assets.loadBundle('game');
  } catch (error) {
    console.error('Ошибка загрузки ресурсов:', error);

    const bundle = manifest.bundles.find((b) => b.name === 'game');
    if (bundle) {
      for (const asset of bundle.assets) {
        try {
          await Assets.load(asset.alias);
        } catch (e) {
          console.warn(`Не удалось загрузить ${asset.alias}`);
        }
      }
    }
  }
  const w = window.innerWidth;
  const h = window.innerHeight;

  const uiLayer = new UiLayer(w, h);
  const scene = new Game(DESIGN_W, DESIGN_H, w, h, uiLayer);

  app.renderer.background.color = 0xa4ed45;

  app.stage.addChild(scene);
  app.stage.addChild(uiLayer);

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    app.renderer.resolution = dpr;
    app.renderer.resize(window.innerWidth, window.innerHeight);

    const scale = Math.min(w / DESIGN_W, h / DESIGN_H);
    const scale_UI = Math.min(w / DESIGN_W_UI, h / DESIGN_H_UI);

    scene.scale.set(scale * 1.07);
    scene.x = (w - DESIGN_W * scale) / 2 - 23;
    scene.y = (h - DESIGN_H * scale) / 2 - 68;
    scene.resize?.(DESIGN_W, DESIGN_H, w, h);
    // scene.visible = false;

    // uiLayer.scale.set(scale*1.0);
    // uiLayer.x = (w - DESIGN_W_UI * scale_UI) / 2;
    // uiLayer.y = (h - DESIGN_H_UI * scale_UI) / 2;
    uiLayer.resize?.(w, h, scale_UI);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);

  resize();

  app.ticker.add((ticker) => {
    scene.update(ticker.deltaTime);
    uiLayer.update?.(ticker.deltaTime);
  });
})().catch((error) => {
  console.error('Фатальная ошибка при запуске:', error);
});
