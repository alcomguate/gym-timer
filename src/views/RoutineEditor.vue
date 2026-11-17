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
      <h1 class="text-2xl font-black">{{ isNew ? 'Nueva Rutina' : 'Editar Rutina' }}</h1>
    </header>

    <main class="flex-1 px-5 pb-12 space-y-5">
      <!-- General section -->
      <section class="bg-[#1c1c1e] rounded-2xl p-5 border border-[#2c2c2e] space-y-5">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">General</h3>

        <!-- Emoji picker -->
        <div>
          <p class="text-sm text-gray-400 mb-2">Ícono</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="e in EMOJIS" :key="e"
              @click="form.emoji = e"
              class="w-11 h-11 text-xl rounded-xl flex items-center justify-center transition-all active:scale-90"
              :class="form.emoji === e ? 'bg-[#3c3c3e] ring-2 ring-white/30' : 'bg-[#2c2c2e]'"
            >{{ e }}</button>
          </div>
        </div>

        <!-- Name -->
        <div>
          <label class="text-sm text-gray-400 mb-1.5 block">Nombre</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="HIIT 20/10"
            maxlength="30"
            class="w-full bg-[#2c2c2e] border border-[#3c3c3e] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-base font-semibold"
          />
        </div>

        <!-- Color -->
        <div>
          <p class="text-sm text-gray-400 mb-2">Color</p>
          <div class="flex gap-3 flex-wrap">
            <button
              v-for="c in COLORS" :key="c"
              @click="form.color = c"
              class="w-10 h-10 rounded-full transition-all active:scale-90"
              :style="{ backgroundColor: c }"
              :class="form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1c1c1e] scale-110' : ''"
            />
          </div>
        </div>
      </section>

      <!-- Group section -->
      <section class="bg-[#1c1c1e] rounded-2xl p-5 border border-[#2c2c2e] space-y-4">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grupo / Día</h3>

        <!-- Day chips -->
        <div>
          <p class="text-xs text-gray-600 mb-2">Días de la semana</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="day in DAYS" :key="day"
              @click="toggleGroup(day)"
              class="px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
              :class="form.group === day ? 'text-black' : 'bg-[#2c2c2e] text-gray-400'"
              :style="form.group === day ? { backgroundColor: form.color } : {}"
            >{{ day }}</button>
          </div>
        </div>

        <!-- Muscle group chips -->
        <div>
          <p class="text-xs text-gray-600 mb-2">Grupos de entrenamiento</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="g in MUSCLE_GROUPS" :key="g"
              @click="toggleGroup(g)"
              class="px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
              :class="form.group === g ? 'text-black' : 'bg-[#2c2c2e] text-gray-400'"
              :style="form.group === g ? { backgroundColor: form.color } : {}"
            >{{ g }}</button>
          </div>
        </div>

        <!-- Custom input -->
        <div>
          <label class="text-xs text-gray-600 mb-1.5 block">Nombre personalizado</label>
          <input
            v-model="form.group"
            type="text"
            placeholder="Ej. Upper Body, Día A, Semana 1…"
            maxlength="30"
            class="w-full bg-[#2c2c2e] border border-[#3c3c3e] rounded-xl px-4 py-2.5 text-white placeholder-gray-700 focus:outline-none focus:border-red-500 text-sm"
          />
        </div>
      </section>

      <!-- Timer settings -->
      <section class="bg-[#1c1c1e] rounded-2xl p-5 border border-[#2c2c2e] space-y-6">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tiempos</h3>

        <TimeInput
          v-model="form.workTime"
          label="Tiempo de Trabajo"
          color="#ef4444"
          :min="1"
          :max="300"
        />

        <TimeInput
          v-model="form.restTime"
          label="Tiempo de Descanso"
          color="#4ade80"
          :min="0"
          :max="300"
        />

        <!-- Rounds -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm text-gray-400">Rondas</label>
            <span class="text-2xl font-black" :style="{ color: form.color }">{{ form.rounds }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="form.rounds = Math.max(1, form.rounds - 1)"
              class="w-12 h-12 bg-[#2c2c2e] rounded-xl font-bold text-lg active:scale-90 transition-transform"
            >−</button>
            <div class="flex-1">
              <input
                type="range"
                v-model.number="form.rounds"
                min="1" max="50"
                class="w-full"
              />
            </div>
            <button
              @click="form.rounds = Math.min(50, form.rounds + 1)"
              class="w-12 h-12 bg-[#2c2c2e] rounded-xl font-bold text-lg active:scale-90 transition-transform"
            >+</button>
          </div>
        </div>
      </section>

      <!-- Summary card -->
      <section class="bg-[#1c1c1e] rounded-2xl p-5 border border-[#2c2c2e]">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Resumen</h3>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-[#2c2c2e] rounded-xl py-3">
            <p class="text-red-400 text-xl font-black">{{ form.workTime }}s</p>
            <p class="text-gray-600 text-xs mt-0.5">trabajo</p>
          </div>
          <div class="bg-[#2c2c2e] rounded-xl py-3">
            <p class="text-green-400 text-xl font-black">{{ form.restTime }}s</p>
            <p class="text-gray-600 text-xs mt-0.5">descanso</p>
          </div>
          <div class="bg-[#2c2c2e] rounded-xl py-3">
            <p class="text-white text-xl font-black">{{ formatDuration(totalSecs) }}</p>
            <p class="text-gray-600 text-xs mt-0.5">total</p>
          </div>
        </div>
      </section>

      <!-- Actions -->
      <div class="space-y-3 pt-1">
        <button
          @click="save"
          class="w-full py-4 rounded-2xl font-black text-base active:scale-[0.98] transition-transform"
          :style="{ backgroundColor: form.color, boxShadow: `0 6px 20px ${form.color}44` }"
        >
          GUARDAR RUTINA
        </button>
        <button
          v-if="!isNew"
          @click="confirmDelete"
          class="w-full py-4 rounded-2xl font-semibold text-sm bg-transparent border border-red-900/60 text-red-500 active:scale-[0.98] transition-transform"
        >
          Eliminar rutina
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRoutinesStore } from '../stores/routines.js'
import TimeInput from '../components/TimeInput.vue'

const router = useRouter()
const route  = useRoute()
const store  = useRoutinesStore()

const isNew = computed(() => !route.params.id)

const EMOJIS = ['🔥', '💪', '⚡', '🏋️', '🏃', '🥊', '🎯', '💥', '🦾', '🚀']
const COLORS  = ['#ef4444', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#f97316']
const DAYS    = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MUSCLE_GROUPS = ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core', 'Cardio', 'Fuerza', 'Full Body']

const form = ref({
  name: '',
  workTime: 20,
  restTime: 10,
  rounds: 8,
  color: '#ef4444',
  emoji: '🔥',
  group: '',
})

function toggleGroup(value) {
  form.value.group = form.value.group === value ? '' : value
}

onMounted(() => {
  if (!isNew.value) {
    const r = store.getById(route.params.id)
    if (r) Object.assign(form.value, { ...r })
  } else if (route.query.workTime) {
    // Pre-fill from Quick Timer "Guardar como rutina"
    form.value.workTime = +route.query.workTime
    form.value.restTime = +route.query.restTime
    form.value.rounds   = +route.query.rounds
  }
})

const totalSecs = computed(() =>
  form.value.rounds * form.value.workTime +
  Math.max(0, form.value.rounds - 1) * form.value.restTime + 3
)

function formatDuration(s) {
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const rem = s % 60
  return rem > 0 ? `${m}m${rem}s` : `${m}m`
}

function save() {
  if (!form.value.name.trim()) {
    alert('Escribe un nombre para la rutina')
    return
  }
  if (isNew.value) store.add({ ...form.value })
  else store.update(route.params.id, { ...form.value })
  router.back()
}

function confirmDelete() {
  if (confirm('¿Eliminar esta rutina?')) {
    store.remove(route.params.id)
    router.replace('/')
  }
}
</script>
