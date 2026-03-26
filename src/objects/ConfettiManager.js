import confetti from 'canvas-confetti'

export class ConfettiManager {
  fire(intensity, options, origin) {
    confetti({
      origin: origin,
      ...options,
      particleCount: Math.floor(200 * intensity),
    })
  }

  mixedFireMyVer(origin, intensity = 1) {
    // Первый залп
    this.fire(
      0.5,
      {
        spread: 70,
        startVelocity: 30,
        ticks: 120,
        scalar: 1.25,
      },
      origin
    )

    // Второй залп
    setTimeout(() => {
      this.fire(
        0.2,
        {
          spread: 70,
          startVelocity: 30,
          scalar: 1,
          ticks: 120,
        },
        origin
      )
    }, 400) // через 0.4 секунды
  }
}
