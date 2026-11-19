<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="px-5 pt-12 pb-5 flex items-center gap-3">
      <button
        @click="$router.back()"
        class="w-10 h-10 bg-[#1c1c1e] rounded-xl flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-2xl font-black leading-tight">{{ t('quick.title') }}</h1>
        <p class="text-gray-600 text-xs mt-0.5">{{ t('quick.subtitle') }}</p>
      </div>
    </header>

    <main class="flex-1 px-5 pb-12 flex flex-col gap-5">
      <!-- Timer controls -->
      <section class="bg-[#1c1c1e] rounded-2xl p-5 border border-[#2c2c2e] space-y-6">
        <TimeInput
          v-model="form.workTime"
          :label="t('editor.workTime')"
          color="#ef4444"
          :min="1"
          :max="300"
        />
        <TimeInput
          v-model="form.restTime"
          :label="t('editor.restTime')"
          color="#4ade80"
          :min="0"
          :max="300"
        />

        <!-- Rounds -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm text-gray-400">{{ t('editor.rounds') }}</label>
            <span class="text-2xl font-black text-amber-400">{{ form.rounds }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="form.rounds = Math.max(1, form.rounds - 1)"
              class="w-12 h-12 bg-[#2c2c2e] rounded-xl font-bold text-lg active:scale-90 transition-transform"
            >−</button>
            <div class="flex-1">
              <input type="range" v-model.number="form.rounds" min="1" max="50" class="w-full" />
            </div>
            <button
              @click="form.rounds = Math.min(50, form.rounds + 1)"
              class="w-12 h-12 bg-[#2c2c2e] rounded-xl font-bold text-lg active:scale-90 transition-transform"
            >+</button>
          </div>
        </div>
      </section>

      <!-- Summary strip -->
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="bg-[#1c1c1e] rounded-xl py-3 border border-[#2c2c2e]">
          <p class="text-red-400 text-xl font-black">{{ form.workTime }}s</p>
          <p class="text-gray-600 text-xs mt-0.5">{{ t('routine.work') }}</p>
        </div>
        <div class="bg-[#1c1c1e] rounded-xl py-3 border border-[#2c2c2e]">
          <p class="text-green-400 text-xl font-black">{{ form.restTime }}s</p>
          <p class="text-gray-600 text-xs mt-0.5">{{ t('routine.rest') }}</p>
        </div>
        <div class="bg-[#1c1c1e] rounded-xl py-3 border border-[#2c2c2e]">
          <p class="text-white text-xl font-black">{{ formatDuration(totalSecs) }}</p>
          <p class="text-gray-600 text-xs mt-0.5">total</p>
        </div>
      </div>

      <div class="flex-1" />

      <!-- Actions -->
      <div class="space-y-3">
        <button
          @click="startNow"
          class="w-full py-4 rounded-2xl font-black text-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          style="background-color:#f59e0b; box-shadow: 0 6px 20px rgba(245,158,11,0.4);"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          {{ t('quick.start') }}
        </button>

        <button
          @click="saveAsRoutine"
          class="w-full py-3 rounded-2xl font-semibold text-sm bg-[#1c1c1e] border border-[#2c2c2e] text-gray-400 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {{ t('quick.save') }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutinesStore } from '../stores/routines.js'
import TimeInput from '../components/TimeInput.vue'
import { useI18n } from '../composables/useI18n.js'

const router = useRouter()
const store  = useRoutinesStore()
const { t } = useI18n()

// Pre-fill with last used quick values
const form = ref({
  workTime: store.quickRoutine.workTime,
  restTime: store.quickRoutine.restTime,
  rounds:   store.quickRoutine.rounds,
})

const totalSecs = computed(() =>
  form.value.rounds * form.value.workTime +
  Math.max(0, form.value.rounds - 1) * form.value.restTime + 3
)

function formatDuration(s) {
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const rem = s % 60
  return rem > 0 ? `${m}m ${rem}s` : `${m}m`
}

function startNow() {
  store.setQuick({ ...form.value })
  router.push('/routine/quick/play')
}

function saveAsRoutine() {
  router.push({
    path: '/routine/new',
    query: {
      workTime: form.value.workTime,
      restTime: form.value.restTime,
      rounds:   form.value.rounds,
    },
  })
}
</script>
