<template>
  <div class="min-h-screen flex flex-col">
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
        <h1 class="text-2xl font-black">Registrar Peso</h1>
        <p class="text-gray-600 text-xs mt-0.5">{{ isEdit ? 'Editar medición existente' : 'Nueva medición' }}</p>
      </div>
    </header>

    <main class="flex-1 px-5 pb-12 flex flex-col gap-5">

      <!-- Big weight input -->
      <section class="bg-[#1c1c1e] rounded-2xl p-6 border border-[#2c2c2e] flex flex-col items-center gap-5">
        <!-- Unit toggle -->
        <div class="flex gap-1 bg-[#2c2c2e] p-1 rounded-xl self-end">
          <button
            v-for="u in ['kg', 'lbs']" :key="u"
            @click="store.setUnit(u)"
            class="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
            :class="store.unit === u ? 'bg-blue-500 text-white' : 'text-gray-500'"
          >{{ u }}</button>
        </div>

        <!-- Stepper display -->
        <div class="text-center">
          <div class="flex items-center gap-4">
            <button @click="change(-1)"
              class="w-14 h-14 bg-[#2c2c2e] rounded-2xl text-2xl font-black active:scale-90 transition-transform">−</button>

            <div class="min-w-[120px] text-center">
              <input
                v-model="weightStr"
                type="number"
                step="0.1"
                min="10"
                max="500"
                class="w-full text-center bg-transparent text-5xl font-black text-white focus:outline-none no-select"
                style="appearance: textfield; -moz-appearance: textfield;"
              />
              <p class="text-gray-500 text-sm mt-1">{{ store.unit }}</p>
            </div>

            <button @click="change(+1)"
              class="w-14 h-14 bg-[#2c2c2e] rounded-2xl text-2xl font-black active:scale-90 transition-transform">+</button>
          </div>

          <!-- Fine adjustment -->
          <div class="flex gap-3 justify-center mt-3">
            <button @click="change(-0.1)"
              class="px-5 py-2 bg-[#2c2c2e] rounded-xl text-sm font-semibold text-gray-400 active:scale-90 transition-transform">-0.1</button>
            <button @click="change(+0.1)"
              class="px-5 py-2 bg-[#2c2c2e] rounded-xl text-sm font-semibold text-gray-400 active:scale-90 transition-transform">+0.1</button>
          </div>
        </div>
      </section>

      <!-- Date -->
      <section class="bg-[#1c1c1e] rounded-2xl p-5 border border-[#2c2c2e] space-y-3">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</h3>

        <!-- Quick date chips -->
        <div class="flex gap-2">
          <button
            v-for="chip in dateChips" :key="chip.value"
            @click="form.date = chip.value"
            class="flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            :class="form.date === chip.value ? 'bg-blue-500 text-white' : 'bg-[#2c2c2e] text-gray-400'"
          >{{ chip.label }}</button>
        </div>

        <!-- Date picker -->
        <input
          v-model="form.date"
          type="date"
          :max="today"
          class="w-full bg-[#2c2c2e] border border-[#3c3c3e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
        />
      </section>

      <!-- Notes -->
      <section class="bg-[#1c1c1e] rounded-2xl p-5 border border-[#2c2c2e]">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Notas <span class="text-gray-700 normal-case font-normal">(opcional)</span></h3>
        <input
          v-model="form.notes"
          type="text"
          placeholder="Ej. En ayunas, después de entrenar…"
          maxlength="80"
          class="w-full bg-[#2c2c2e] border border-[#3c3c3e] rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 text-sm"
        />
      </section>

      <div class="flex-1" />

      <button
        @click="save"
        class="w-full py-4 rounded-2xl font-black text-lg active:scale-[0.98] transition-transform"
        style="background-color:#3b82f6; box-shadow: 0 6px 20px rgba(59,130,246,0.4);"
      >
        GUARDAR MEDICIÓN
      </button>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWeightStore } from '../stores/weight.js'

const router = useRouter()
const route  = useRoute()
const store  = useWeightStore()

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}
function offsetDay(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

const today = todayStr()
const isEdit = !!route.query.date

// Pre-fill if editing
const initEntry = isEdit ? store.entries.find(e => e.date === route.query.date) : null

const form = ref({
  date:  isEdit ? route.query.date : today,
  notes: initEntry?.notes ?? '',
})

const weightStr = ref(
  String((initEntry?.weight ?? store.latest?.weight ?? 70).toFixed(1))
)

const weight = computed(() => parseFloat(weightStr.value) || 0)

function change(delta) {
  const next = Math.max(10, Math.min(500, +(weight.value + delta).toFixed(1)))
  weightStr.value = next.toFixed(1)
}

const dateChips = computed(() => [
  { label: 'Hoy',    value: today },
  { label: 'Ayer',   value: offsetDay(-1) },
  { label: 'Antes',  value: offsetDay(-2) },
])

function save() {
  if (!weight.value || weight.value < 10) {
    alert('Ingresa un peso válido')
    return
  }
  store.add({ date: form.value.date, weight: weight.value, notes: form.value.notes })
  router.back()
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1) opacity(0.4);
}
</style>
