<template>
  <div class="min-h-screen flex flex-col no-select transition-colors duration-500" :class="bgGradient">

    <!-- Header -->
    <header class="px-5 pt-12 pb-2 flex items-center justify-between">
      <button
        @click="handleStop"
        class="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center active:scale-90 transition-transform"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="text-center">
        <p class="font-black text-lg leading-tight">{{ routine?.name }}</p>
        <p v-if="phase !== 'done' && phase !== 'idle'" class="text-white/50 text-xs">
          Ronda {{ currentRound }} de {{ totalRounds }}
        </p>
      </div>
      <div class="w-10" />
    </header>

    <!-- Timer body -->
    <main class="flex-1 flex flex-col items-center justify-center px-6 pb-8 gap-5">

      <!-- Phase badge -->
      <div
        v-if="phase !== 'idle'"
        class="inline-flex px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300"
        :style="{ backgroundColor: phaseColor + '28', color: phaseColor, border: `1px solid ${phaseColor}55` }"
      >
        {{ phaseLabel }}
      </div>

      <!-- Circular timer -->
      <CircularTimer
        v-if="phase !== 'done'"
        :progress="progress"
        :color="phaseColor"
        :size="288"
        :strokeWidth="16"
      >
        <div class="text-center">
          <div
            class="tabular-nums font-black leading-none transition-all duration-300"
            :class="displayTime >= 100 ? 'text-6xl' : 'text-7xl'"
          >
            {{ displayTime }}
          </div>
          <div class="text-white/40 text-sm mt-1">segundos</div>
        </div>
      </CircularTimer>

      <!-- Done screen -->
      <div v-if="phase === 'done'" class="flex flex-col items-center gap-4 text-center py-6">
        <div class="text-8xl animate-bounce">🏆</div>
        <h2 class="text-4xl font-black">¡Listo!</h2>
        <p class="text-white/60">
          Completaste <span class="text-white font-bold">{{ totalRounds }}</span>
          ronda{{ totalRounds !== 1 ? 's' : '' }}
        </p>
        <button
          @click="$router.back()"
          class="mt-2 px-10 py-4 bg-white text-black rounded-2xl font-black text-lg active:scale-95 transition-transform"
        >
          FINALIZAR
        </button>
      </div>

      <!-- Next phase hint -->
      <div v-if="phase !== 'done' && nextPhaseLabel" class="text-center -mt-2">
        <p class="text-white/35 text-xs uppercase tracking-wider">Siguiente</p>
        <p class="text-white/60 text-sm font-semibold mt-0.5">{{ nextPhaseLabel }}</p>
      </div>

      <!-- Round dots (≤ 20 rounds) -->
      <div
        v-if="phase !== 'done' && phase !== 'idle' && totalRounds <= 20"
        class="flex gap-1.5 flex-wrap justify-center max-w-xs"
      >
        <div
          v-for="i in totalRounds" :key="i"
          class="rounded-full transition-all duration-300"
          :class="[
            i < currentRound  ? 'w-2.5 h-2.5 bg-white/50' :
            i === currentRound ? 'w-3 h-3' : 'w-2.5 h-2.5 bg-white/15'
          ]"
          :style="i === currentRound ? { backgroundColor: phaseColor } : {}"
        />
      </div>

      <!-- Round counter for > 20 rounds -->
      <div
        v-if="phase !== 'done' && phase !== 'idle' && totalRounds > 20"
        class="text-center"
      >
        <p class="text-white/50 text-sm">
          Ronda <span class="font-bold text-white">{{ currentRound }}</span> / {{ totalRounds }}
        </p>
      </div>

      <!-- Controls -->
      <div v-if="phase !== 'done' && phase !== 'idle'" class="w-full flex gap-3 mt-1">
        <button
          @click="togglePause"
          class="flex-1 py-4 rounded-2xl font-black text-base active:scale-[0.97] transition-all flex items-center justify-center gap-2"
          :style="{ backgroundColor: phaseColor, boxShadow: `0 6px 24px ${phaseColor}44` }"
        >
          <svg v-if="!isPaused" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          {{ isPaused ? 'REANUDAR' : 'PAUSAR' }}
        </button>
      </div>

      <!-- Paused overlay hint -->
      <div v-if="isPaused" class="text-white/40 text-sm text-center -mt-1">
        ⏸ Entrenamiento en pausa
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoutinesStore } from '../stores/routines.js'
import { useTimer } from '../composables/useTimer.js'
import CircularTimer from '../components/CircularTimer.vue'

const route   = useRoute()
const router  = useRouter()
const store   = useRoutinesStore()
const routine = computed(() => store.getById(route.params.id))

const {
  phase, timeRemaining, currentRound, totalRounds,
  isPaused, progress, phaseLabel, nextPhaseLabel,
  start, pause, resume, stop,
} = useTimer()

const PHASE_COLORS = {
  idle:    '#6b7280',
  prepare: '#fbbf24',
  work:    '#ef4444',
  rest:    '#4ade80',
  done:    '#3b82f6',
}

const phaseColor = computed(() => PHASE_COLORS[phase.value] ?? '#6b7280')

const bgGradient = computed(() => ({
  idle:    'bg-[#0a0a0a]',
  prepare: 'bg-[#0a0a0a]',
  work:    'bg-[#0f0505]',
  rest:    'bg-[#030f07]',
  done:    'bg-[#030510]',
}[phase.value] ?? 'bg-[#0a0a0a]'))

const displayTime = computed(() => Math.ceil(timeRemaining.value))

function togglePause() {
  isPaused.value ? resume() : pause()
}

function handleStop() {
  if (phase.value === 'idle' || phase.value === 'done') {
    router.back()
  } else if (confirm('¿Detener el entrenamiento?')) {
    stop()
    router.back()
  }
}

onMounted(() => {
  if (routine.value) start(routine.value)
})

onUnmounted(() => stop())
</script>
