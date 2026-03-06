import { Container, AnimatedSprite, Assets, Sprite } from 'pixi.js'

export class Stones extends Container {
  constructor() {
    super()

    const sheet = Assets.get('stones_json')
    const textureKeys = Object.keys(sheet.textures)
    
    // Массив для хранения всех камешков
    this.stones = []
    
    // Создаем яму (добавляем в самом начале, чтобы была на заднем плане)
    this.pit = new Sprite(Assets.get('pit'))
    this.pit.anchor.set(0.5)
    this.pit.scale.set(0.6)
    this.pit.x = 0
    this.pit.y = 15 // яма на том же уровне, куда падают камни
    
    // Добавляем яму в контейнер
    this.addChild(this.pit)
    
    // Создаем камешки - КАЖДУЮ ТЕКСТУРУ ИСПОЛЬЗУЕМ ПО 2 РАЗА
    textureKeys.forEach((key) => {
      // Первый камень из этой текстуры
      this.createStone(sheet.textures[key])
      
      // Второй камень из этой текстуры
      this.createStone(sheet.textures[key])
    })
    
    // Флаг, что анимация активна
    this.animationActive = true
  }
  
  // Вспомогательный метод для создания одного камня
  createStone(texture) {
    const stone = new AnimatedSprite([texture])
    stone.anchor.set(0.5)
    
    // Начальная позиция - все в одной точке (центр контейнера)
    stone.x = 0
    stone.y = 0
    
    // Случайные параметры для каждого камня
    stone.vx = (Math.random() - 0.5) * 400 // скорость по X (пикселей в секунду)
    stone.vy = Math.random() * -200 - 150 // начальная скорость вверх (пикселей в секунду)
    stone.gravity = 600 // пикселей в секунду²
    
    stone.rotationSpeed = (Math.random() - 0.5) * 5 // радиан в секунду
    
    // Время жизни анимации
    stone.lifeTime = 0
    stone.maxLifeTime = 1.5 // 1.5 секунды анимации
    
    // Добавляем в контейнер и массив
    this.addChild(stone)
    this.stones.push(stone)
    
    // Запускаем анимацию (просто чтобы был виден первый кадр)
    stone.play()
    stone.animationSpeed = 0
    
    return stone
  }
  
  // Метод для обновления анимации с дельтой времени
  update(deltaTime) {
    if (!this.animationActive) return
    
    // Преобразуем дельту Pixi в секунды (обычно deltaTime = 1 при 60 FPS)
    const deltaSec = deltaTime / 60 
    
    let allFinished = true
    
    this.stones.forEach(stone => {
      if (stone.lifeTime < stone.maxLifeTime) {
        allFinished = false
        
        // Обновляем время жизни
        stone.lifeTime += deltaSec
        
        // Физика с дельтой времени
        stone.vy += stone.gravity * deltaSec
        
        // Обновляем позицию с учетом дельты
        stone.x += stone.vx * deltaSec
        stone.y += stone.vy * deltaSec
        
        // Вращение с учетом дельты
        stone.rotation += stone.rotationSpeed * deltaSec
        
        // Замедление горизонтальной скорости (трение)
        stone.vx *= Math.pow(0.9, deltaSec * 60)
        
        // Если камень упал ниже 60 пикселей, фиксируем его
        if (stone.y >= 60) {
          stone.y = 60
          stone.vy = 0
          stone.vx = 0
          stone.lifeTime = stone.maxLifeTime // сразу завершаем анимацию движения
        }
      }
    })
    
    // Если все камни завершили анимацию движения
    if (allFinished) {
      this.animationActive = false
    }
  }
  
  // Метод для запуска анимации
  explode() {
    this.stones.forEach(stone => {
      stone.x = 0
      stone.y = 0
      stone.vx = (Math.random() - 0.5) * 600
      stone.vy = Math.random() * -200 - 150
      stone.rotation = 0
      stone.rotationSpeed = (Math.random() - 0.5) * 5
      stone.lifeTime = 0
      stone.alpha = 1
    })
    this.animationActive = true
  }
  
  // Метод для проверки, активна ли анимация
  isActive() {
    return this.animationActive
  }
  
  // Метод для установки прозрачности ямы (может пригодиться)
  setPitAlpha(alpha) {
    this.pit.alpha = alpha
  }
}