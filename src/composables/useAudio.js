let ctx = null

function getCtx() {
  if (!ctx || ctx.state === 'closed') {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, duration, volume = 0.4, type = 'sine', delay = 0) {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.type = type
    osc.frequency.value = freq
    const t = c.currentTime + delay
    gain.gain.setValueAtTime(volume, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
    osc.start(t)
    osc.stop(t + duration + 0.02)
  } catch (_) {}
}

export function useAudio() {
  function initAudio() {
    getCtx()
  }

  function playWorkBeep() {
    // Double high beep: start TRABAJO
    tone(880, 0.1, 0.5, 'square', 0)
    tone(880, 0.1, 0.5, 'square', 0.15)
  }

  function playRestBeep() {
    // Single lower beep: start DESCANSO
    tone(440, 0.3, 0.4, 'sine', 0)
  }

  function playPrepareTone() {
    tone(660, 0.15, 0.3, 'sine', 0)
  }

  function playCountdownTick() {
    tone(1047, 0.07, 0.25, 'square', 0)
  }

  function playDone() {
    // C5 → E5 → G5 → C6 fanfare
    tone(523, 0.15, 0.4, 'sine', 0)
    tone(659, 0.15, 0.4, 'sine', 0.18)
    tone(784, 0.15, 0.4, 'sine', 0.36)
    tone(1047, 0.45, 0.5, 'sine', 0.54)
  }

  return { initAudio, playWorkBeep, playRestBeep, playPrepareTone, playCountdownTick, playDone }
}
