import { Howl, Howler } from 'howler'

class SoundManager {
  constructor() {
    Howler.autoSuspend = false

    // пользовательский мут (кнопка)
    this.enabled = true

    // мут из-за потери фокуса
    this.mutedByFocus = false

    this.sounds = {
      music: new Howl({
        src: ['assets/audio/music.m4a'],
        loop: true,
        volume: 0.5,
      }),

      // ===== АУДИО СПРАЙТ =====
      sfx: new Howl({
        src: ['assets/audio/sfx.m4a'],
        sprite: {
          1: [0, 1694], // звук 1 (корона/эффект)
          2: [6000, 1706], // звук 2 (корона/эффект)
          3: [12000, 1706], // звук 3 (корона/эффект)

          '1st_crown_01': [3000, 1757], // первая корона появляется
          '2nd_crown_01': [9000, 1462], // вторая корона появляется
          '3rd_crown_01': [15000, 1542], // третья корона появляется

          archer_attack: [18000, 347], // лучник выпускает стрелу
          arrow_hit: [20000, 239], // стрела попадает в цель

          building_explode: [22000, 1985], // разрушение здания / взрыв башни

          crown_appear_03: [25000, 1381], // появление короны

          deploy_timer_ding: [28000, 704], // сигнал таймера перед спавном
          deploy_timer_tick: [30000, 479], // тик таймера

          enemy_deploy_timer_ding: [32000, 603], // сигнал таймера у противника
          enemy_deploy_timer_tick: [34000, 224], // тик таймера у противника

          get_crown: [36000, 2032], // получение короны (награда)
          get_xp: [40000, 1529], // получение опыта

          giant_attack_swing_02: [43000, 903], // удар гиганта (вариант 2)
          giant_attack_swing: [45000, 889], // удар гиганта

          giant_deploy: [47000, 1758], // появление (спавн) гиганта
          giant_hit: [50000, 827], // гигант получает удар

          king_congrats: [52000, 668], // король поздравляет
          king_happy: [54000, 760], // радость короля
          king_tower_gone: [56000, 843], // уничтожена башня короля

          knight_death: [58000, 1520], // смерть рыцаря
          knight_deploy_end: [61000, 794], // завершение появления рыцаря
          knight_deploy: [63000, 1241], // появление рыцаря

          knight_footstep: [66000, 276], // шаг рыцаря

          win: [68000, 2809], // победа
        },
        volume: 0.3,
      }),
    }

    this.initFocusHandlers()
  }

  // ===============================
  // ФОКУС / ПОТЕРЯ ФОКУСА
  // ===============================

  initFocusHandlers() {
    window.addEventListener('blur', () => {
      this.muteByFocus()
    })

    window.addEventListener('focus', () => {
      this.restoreAfterFocus()
    })

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.muteByFocus()
      } else {
        this.restoreAfterFocus()
      }
    })
  }

  muteByFocus() {
    if (!this.enabled) return

    this.mutedByFocus = true
    Howler.volume(0)
  }

  restoreAfterFocus() {
    if (!this.enabled) return

    if (this.mutedByFocus) {
      this.mutedByFocus = false
      Howler.volume(1)
    }
  }

  // ===============================
  // PUBLIC API
  // ===============================

  play(name) {
    if (!this.enabled) return

    // если есть отдельный звук
    if (this.sounds[name]) {
      this.sounds[name].play()
      return
    }

    // иначе пробуем из аудиоспрайта
    this.sounds.sfx?.play(name)
  }

  playMusic() {
    if (!this.enabled) return

    const music = this.sounds.music
    if (!music.playing()) {
      music.play()
    }
  }

  stopMusic() {
    this.sounds.music.stop()
  }

  // пользовательский mute (кнопка)
  mute(value) {
    this.enabled = !value

    if (value) {
      Howler.volume(0)
    } else {
      if (!this.mutedByFocus) {
        Howler.volume(1)
      }
    }
  }
}

export const sound = new SoundManager()
