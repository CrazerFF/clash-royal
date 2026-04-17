import { Container } from 'pixi.js'
import { AnimatedSprite, Assets } from 'pixi.js'
import { HealthBar } from './HealthBar.js'
import { Spine } from '@esotericsoftware/spine-pixi-v8'; // Новый импорт
import { Stones } from '../objects/Stones.js'


export class RedKing extends Container {
  constructor(scene) {
    super()
    this.scene = scene
    this.zIndex = 20

    // Загружаем спрайтшит
    const sheet = Assets.get('redking_json')

    // Создаем анимированный спрайт (idle по умолчанию)
    this.sprite = new AnimatedSprite(sheet.animations['redking_idle'])
    this.sprite.anchor.set(0.5, 1)
    this.sprite.animationSpeed = 0.3
    this.sprite.loop = true
    this.addChild(this.sprite)
    this.sprite.play()

    this.currentAnimation = 'idle'

    this.healthBar = new HealthBar(120, 18, 'red', scene)
    this.healthBar.x -= 150
    this.healthBar.y -= 420
    this.healthBar.scale.set(2.5)
    this.addChild(this.healthBar)
  }

  // Переключить на анимацию канона
  playCanon() {
    const sheet = Assets.get('redking_json')
    this.sprite.textures = sheet.animations['redking_canon']
    this.sprite.gotoAndPlay(0)
    this.currentAnimation = 'canon'
  }

  // Вернуться к idle
  playIdle() {
    const sheet = Assets.get('redking_json')
    this.sprite.textures = sheet.animations['redking_idle']
    this.sprite.gotoAndPlay(0)
    this.currentAnimation = 'idle'
  }

  playDeath() {

        // Создаем камни
    const stones = new Stones()
    stones.x = 350 // позиция взрыва по X
    stones.y = 350 // позиция взрыва по Y
    this.scene.objects.push(stones)
    this.scene.addChild(stones)

    this.scene.giant.stop()
    this.scene.archer.stop()
    this.scene.archer2.stop()
    
    const deathFx = Spine.from({
      skeleton: 'tower_smoke',
      atlas: 'tower_smoke_atlas',
    })
    deathFx.state.setAnimation(0, 'animation', false)
    this.addChild(deathFx);
    deathFx.scale.set(3);

    deathFx.state.addListener({
      complete: () => deathFx.destroy(),
    })

    this.scene.throne.visible = false;
    this.sprite.visible = false
    this.healthBar.visible = false
  }
}
