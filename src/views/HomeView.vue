<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="px-5 pt-12 pb-5">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black tracking-tight">GYM TIMER</h1>
          <p class="text-gray-500 text-sm mt-0.5">{{ subtitle }}</p>
        </div>
        <div class="flex gap-2">
          <!-- Weight log -->
          <button
            @click="$router.push('/weight')"
            class="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
            style="box-shadow: 0 4px 16px rgba(59,130,246,0.4);"
            title="Registro de peso"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3C8.686 3 6 5.686 6 9c0 2.21 1.344 4.104 3.282 5H4v2h16v-2h-5.282C16.656 13.104 18 11.21 18 9c0-3.314-2.686-6-6-6z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 21h8M12 16v5" />
            </svg>
          </button>
          <!-- Quick start -->
          <button
            @click="$router.push('/quick')"
            class="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
            style="box-shadow: 0 4px 16px rgba(245,158,11,0.4);"
            title="Inicio rápido"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L4.09 12.37A1 1 0 005 14h6v8l8.91-10.37A1 1 0 0019 10h-6V2z" />
            </svg>
          </button>
          <!-- New routine -->
          <button
            @click="$router.push('/routine/new')"
            class="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
            style="box-shadow: 0 4px 16px rgba(239,68,68,0.4);"
            title="Nueva rutina"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 px-4 pb-10">
      <!-- Empty state -->
      <div v-if="routines.length === 0" class="flex flex-col items-center justify-center h-64 text-center">
        <div class="text-6xl mb-4">⏱️</div>
        <p class="text-gray-400 text-lg font-semibold">Sin rutinas</p>
        <p class="text-gray-600 text-sm mt-1">Crea tu primera rutina de entrenamiento</p>
      </div>

      <!-- Grouped list -->
      <div v-for="[groupKey, groupRoutines] in groupedRoutines" :key="groupKey" class="mb-2">

        <!-- Group header -->
        <button
          class="w-full flex items-center gap-2 px-1 py-3 active:opacity-70 transition-opacity"
          @click="toggleGroup(groupKey)"
        >
          <div
            class="h-px flex-1"
            :class="groupKey ? 'bg-[#2c2c2e]' : 'bg-[#1c1c1e]'"
          />
          <span class="text-xs font-bold uppercase tracking-widest flex-shrink-0"
            :class="groupKey ? 'text-gray-400' : 'text-gray-700'"
          >
            {{ groupKey || 'Sin grupo' }}
          </span>
          <span class="text-[10px] text-gray-700 flex-shrink-0">{{ groupRoutines.length }}</span>
          <div
            class="h-px flex-1"
            :class="groupKey ? 'bg-[#2c2c2e]' : 'bg-[#1c1c1e]'"
          />
          <svg
            class="w-3.5 h-3.5 text-gray-600 transition-transform duration-200 flex-shrink-0"
            :class="collapsed.has(groupKey) ? '-rotate-90' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Cards -->
        <div v-show="!collapsed.has(groupKey)" class="space-y-3 pb-1">
          <div
            v-for="r in groupRoutines"
            :key="r.id"
            class="bg-[#1c1c1e] rounded-2xl p-4 border border-[#2c2c2e]"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                :style="{ background: r.color + '22', border: `1px solid ${r.color}44` }"
              >{{ r.emoji || '🏋️' }}</div>

              <div class="flex-1 min-w-0">
                <h2 class="font-bold text-base leading-tight truncate">{{ r.name }}</h2>
                <p class="text-gray-500 text-xs mt-0.5">
                  {{ r.rounds }} rondas · {{ r.workTime }}s trabajo · {{ r.restTime }}s descanso
                </p>
                <p class="text-gray-700 text-xs">Total ≈ {{ formatTotal(r) }}</p>
              </div>

              <button
                @click="$router.push(`/routine/${r.id}/edit`)"
                class="w-9 h-9 bg-[#2c2c2e] rounded-xl flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
              >
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            <button
              @click="$router.push(`/routine/${r.id}/play`)"
              class="mt-3 w-full py-3 rounded-xl font-black text-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              :style="{ backgroundColor: r.color, boxShadow: `0 4px 14px ${r.color}44` }"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              INICIAR
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutinesStore } from '../stores/routines.js'

const { routines } = storeToRefs(useRoutinesStore())

// Days-of-week ordering for group sort
const DAY_ORDER = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const groupedRoutines = computed(() => {
  const map = new Map()
  for (const r of routines.value) {
    const key = r.group?.trim() || ''
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(r)
  }
  return [...map.entries()].sort(([a], [b]) => {
    if (a === '' && b === '') return 0
    if (a === '') return 1   // sin grupo va al final
    if (b === '') return -1
    const ai = DAY_ORDER.indexOf(a)
    const bi = DAY_ORDER.indexOf(b)
    if (ai >= 0 && bi >= 0) return ai - bi
    if (ai >= 0) return -1
    if (bi >= 0) return 1
    return a.localeCompare(b, 'es')
  })
})

const namedGroupCount = computed(
  () => groupedRoutines.value.filter(([k]) => k !== '').length
)

const subtitle = computed(() => {
  const r = routines.value.length
  const g = namedGroupCount.value
  const rStr = `${r} rutina${r !== 1 ? 's' : ''}`
  return g > 0 ? `${g} grupo${g !== 1 ? 's' : ''} · ${rStr}` : rStr
})

// Collapsible groups — stored by group key
const collapsed = ref(new Set())
function toggleGroup(key) {
  const next = new Set(collapsed.value)
  next.has(key) ? next.delete(key) : next.add(key)
  collapsed.value = next
}

function formatTotal(r) {
  const secs = r.rounds * r.workTime + Math.max(0, r.rounds - 1) * r.restTime + 3
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m > 0 ? (s > 0 ? `${m}m ${s}s` : `${m}m`) : `${s}s`
}
</script>
