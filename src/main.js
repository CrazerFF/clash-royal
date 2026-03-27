import { Application, Assets, Sprite } from 'pixi.js'
import { manifest } from './objects/Manifest.js'
import { Game } from './Scene/Game.js'
import { UiLayer } from './Hud/UiLayer.js'
import { gsap } from 'gsap'

// ===== ЧЕРНЫЙ ЭКРАН =====

const loadingScreen = document.createElement('div')

loadingScreen.style.position = 'fixed'
loadingScreen.style.left = '0'
loadingScreen.style.top = '0'
loadingScreen.style.width = '100%'
loadingScreen.style.height = '100%'
loadingScreen.style.background = '#000'
loadingScreen.style.zIndex = '9999'

document.body.appendChild(loadingScreen);

(async () => {
  const DESIGN_W = 660
  const DESIGN_H = 1220

  const DESIGN_W_UI = 1044
  const DESIGN_H_UI = 1220

  const app = new Application()

  await app.init({
    backgroundColor: 0x1d9612,
    antialias: false,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  })

  globalThis.__PIXI_APP__ = app

  document.body.appendChild(app.canvas)
  
  app.canvas.addEventListener('contextmenu', (e) => e.preventDefault())
  app.canvas.style.touchAction = 'none'

  // ===== ШРИФТ =====

  try {
    const font = new FontFace('font', 'url(assets/fonts/font4.woff2)')
    const loadedFont = await font.load()
    document.fonts.add(loadedFont)
  } catch (e) {
    //  console.warn('Шрифт не загрузился')
  }

  await document.fonts.ready

  // ===== РЕСУРСЫ =====

  try {
    await Assets.init({ 
      manifest,
      texturePreference: {
        resolution: 1,
        format: 'webp',
      }
     })
    await Assets.loadBundle('gameStart')
  } catch (error) {
    // console.error('Ошибка загрузки ресурсов:', error)

    const bundle = manifest.bundles.find((b) => b.name === 'game')

    if (bundle) {
      for (const asset of bundle.assets) {
        try {
          await Assets.load(asset.alias)
        } catch {
          //   console.warn(`Не удалось загрузить ${asset.alias}`)
        }
      }
    }
  }

  let game
  let uiLayer

  //  const bg = new Sprite(Assets.get('bg'))
  //     app.stage.addChild(bg)
  //     bg.scale.set(1.6)
  //     bg.anchor.set(0.5)


  function startGame() {
    const w = window.innerWidth
    const h = window.innerHeight

    uiLayer = new UiLayer(w, h)
    game = new Game(DESIGN_W, DESIGN_H, w, h, uiLayer)

    uiLayer.game = game

    app.stage.addChild(game)
    app.stage.addChild(uiLayer)

    app.stage.sortableChildren = true

    window.resizeGame()
  }

  window.restartGame = function () {
    gsap.killTweensOf('*')

    if (game) {
      app.stage.removeChild(game)
      game.destroy({ children: true })
    }

    if (uiLayer) {
      app.stage.removeChild(uiLayer)
      uiLayer.destroy({ children: true })
    }

    startGame()
  }

  // ===== RESIZE =====

  window.resizeGame = function () {
    const w = window.innerWidth
    const h = window.innerHeight

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    app.renderer.resolution = dpr
    app.renderer.resize(w, h)

    if (!game || !uiLayer) return

    const scaleGame = Math.min(w / DESIGN_W, h / DESIGN_H)
    const scale_UI = Math.min(w / DESIGN_W_UI, h / DESIGN_H_UI)

    game.scale.set(scaleGame * 1.07)

    game.x = (w - DESIGN_W * scaleGame) / 2 - 23 * scaleGame
    game.y = (h - DESIGN_H * scaleGame) / 2 - 68 * scaleGame

    game.resize?.(DESIGN_W, DESIGN_H, w, h)

    uiLayer.resize?.(w, h, scale_UI, scaleGame)
  }

  window.addEventListener('resize', window.resizeGame)
  window.addEventListener('orientationchange', window.resizeGame)

  // ===== СТАРТ ИГРЫ =====

  startGame()
  loadingScreen.remove()

  // ===== TICKER =====

  app.ticker.add((ticker) => {
    game?.update(ticker.deltaTime)
    uiLayer?.update?.(ticker.deltaTime)
  })
})().catch((error) => {
  console.error('Фатальная ошибка при запуске:',  error)
})
