import { ref, computed, onUnmounted } from 'vue'
import { useAudio } from './useAudio.js'

export function useTimer() {
  const phase = ref('idle')       // idle | prepare | work | rest | done
  const timeRemaining = ref(0)
  const totalPhaseTime = ref(0)
  const currentRound = ref(0)
  const totalRounds = ref(0)
  const isPaused = ref(false)

  const { initAudio, playWorkBeep, playRestBeep, playPrepareTone, playCountdownTick, playDone } = useAudio()

  let intervalId = null
  let startTime = 0
  let pausedElapsed = 0
  let lastBeepedSecond = -1
  let routine = null

  const progress = computed(() => {
    if (totalPhaseTime.value === 0) return 1
    return Math.max(0, timeRemaining.value / totalPhaseTime.value)
  })

  const phaseLabel = computed(() => ({
    idle: 'Listo',
    prepare: 'PREPÁRATE',
    work: 'TRABAJO',
    rest: 'DESCANSO',
    done: '¡COMPLETADO!',
  }[phase.value] ?? ''))

  const nextPhaseLabel = computed(() => {
    if (!routine) return ''
    if (phase.value === 'prepare') return `TRABAJO · ${routine.workTime}s`
    if (phase.value === 'rest') return `TRABAJO · ${routine.workTime}s`
    if (phase.value === 'work') {
      if (currentRound.value >= totalRounds.value) return 'FIN'
      return routine.restTime > 0 ? `DESCANSO · ${routine.restTime}s` : `TRABAJO · ${routine.workTime}s`
    }
    return ''
  })

  function startPhase(newPhase, duration) {
    phase.value = newPhase
    timeRemaining.value = duration
    totalPhaseTime.value = duration
    startTime = Date.now()
    pausedElapsed = 0
    lastBeepedSecond = Math.ceil(duration) + 99

    if (newPhase === 'work') playWorkBeep()
    else if (newPhase === 'rest') playRestBeep()
    else if (newPhase === 'prepare') playPrepareTone()
  }

  function tick() {
    if (isPaused.value) return

    const elapsed = pausedElapsed + (Date.now() - startTime) / 1000
    const remaining = Math.max(0, totalPhaseTime.value - elapsed)
    timeRemaining.value = remaining

    // countdown beeps at 3, 2, 1
    const secondsLeft = Math.ceil(remaining)
    if (secondsLeft <= 3 && secondsLeft > 0 && secondsLeft !== lastBeepedSecond) {
      lastBeepedSecond = secondsLeft
      playCountdownTick()
    }

    if (remaining <= 0) {
      clearInterval(intervalId)
      intervalId = null
      advancePhase()
    }
  }

  function advancePhase() {
    if (phase.value === 'prepare') {
      startPhase('work', routine.workTime)
    } else if (phase.value === 'work') {
      if (currentRound.value >= totalRounds.value) {
        finish()
        return
      }
      if (routine.restTime > 0) {
        startPhase('rest', routine.restTime)
      } else {
        currentRound.value++
        startPhase('work', routine.workTime)
      }
    } else if (phase.value === 'rest') {
      currentRound.value++
      startPhase('work', routine.workTime)
    }

    if (phase.value !== 'done') {
      intervalId = setInterval(tick, 50)
    }
  }

  function finish() {
    phase.value = 'done'
    timeRemaining.value = 0
    playDone()
  }

  function start(r) {
    initAudio()
    routine = r
    totalRounds.value = r.rounds
    currentRound.value = 1
    clearInterval(intervalId)
    startPhase('prepare', 3)
    intervalId = setInterval(tick, 50)
  }

  function pause() {
    if (isPaused.value) return
    isPaused.value = true
    pausedElapsed += (Date.now() - startTime) / 1000
  }

  function resume() {
    if (!isPaused.value) return
    isPaused.value = false
    startTime = Date.now()
  }

  function stop() {
    clearInterval(intervalId)
    intervalId = null
    phase.value = 'idle'
    timeRemaining.value = 0
    totalPhaseTime.value = 0
    currentRound.value = 0
    isPaused.value = false
    routine = null
  }

  onUnmounted(() => clearInterval(intervalId))

  return {
    phase, timeRemaining, totalPhaseTime, currentRound, totalRounds,
    isPaused, progress, phaseLabel, nextPhaseLabel,
    start, pause, resume, stop,
  }
}
