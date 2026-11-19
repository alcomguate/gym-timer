<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="px-5 pt-12 pb-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          @click="$router.back()"
          class="w-10 h-10 bg-[#1c1c1e] rounded-xl flex items-center justify-center active:scale-90 transition-transform"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-black">{{ t('weight.title') }}</h1>
          <p class="text-gray-600 text-xs mt-0.5">{{ t('weight.measures', entries.length) }}</p>
        </div>
      </div>
      <button
        @click="$router.push('/weight/add')"
        class="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
        style="box-shadow: 0 4px 16px rgba(59,130,246,0.4);"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </header>

    <main class="flex-1 px-4 pb-10 space-y-4">

      <!-- Summary cards -->
      <div v-if="latest" class="grid grid-cols-3 gap-2">
        <div class="bg-[#1c1c1e] rounded-2xl p-4 border border-[#2c2c2e] text-center col-span-1">
          <p class="text-blue-400 text-2xl font-black">{{ latest.weight }}</p>
          <p class="text-gray-600 text-xs mt-0.5">{{ t('weight.unit.actual', unit) }}</p>
        </div>
        <div class="bg-[#1c1c1e] rounded-2xl p-4 border border-[#2c2c2e] text-center col-span-1">
          <p class="text-2xl font-black" :class="deltaClass">
            {{ delta !== null ? (delta > 0 ? '+' : '') + delta : '—' }}
          </p>
          <p class="text-gray-600 text-xs mt-0.5">{{ t('weight.vs') }}</p>
        </div>
        <div class="bg-[#1c1c1e] rounded-2xl p-4 border border-[#2c2c2e] text-center col-span-1">
          <p class="text-white text-2xl font-black">{{ entries.length }}</p>
          <p class="text-gray-600 text-xs mt-0.5">{{ t('weight.records') }}</p>
        </div>
      </div>

      <!-- Chart -->
      <div v-if="chartEntries.length >= 2" class="bg-[#1c1c1e] rounded-2xl p-4 border border-[#2c2c2e]">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ t('weight.trend') }}</h3>
          <span class="text-xs text-gray-700">{{ t('weight.last', Math.min(chartEntries.length, 20)) }}</span>
        </div>
        <WeightChart :data="chartEntries" color="#3b82f6" />
      </div>

      <!-- Empty state -->
      <div v-if="entries.length === 0" class="flex flex-col items-center justify-center h-56 text-center">
        <div class="text-6xl mb-4">⚖️</div>
        <p class="text-gray-400 text-lg font-semibold">{{ t('weight.empty') }}</p>
        <p class="text-gray-600 text-sm mt-1">{{ t('weight.empty.sub') }}</p>
        <button
          @click="$router.push('/weight/add')"
          class="mt-5 px-8 py-3 bg-blue-500 rounded-xl font-black active:scale-95 transition-transform"
        >
          {{ t('weight.first') }}
        </button>
      </div>

      <!-- Entries list -->
      <div v-if="entries.length > 0">
        <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wider px-1 mb-2">{{ t('weight.history') }}</h3>
        <div class="space-y-2">
          <div
            v-for="(e, idx) in entries"
            :key="e.id"
            class="bg-[#1c1c1e] rounded-2xl px-4 py-3 border border-[#2c2c2e] flex items-center gap-3"
          >
            <!-- Color dot: first = blue, rest = gray -->
            <div
              class="w-2.5 h-2.5 rounded-full flex-shrink-0"
              :class="idx === 0 ? 'bg-blue-500' : 'bg-gray-700'"
            />

            <!-- Date & notes -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white">{{ relativeDate(e.date) }}</p>
              <p class="text-xs text-gray-600 mt-0.5">{{ fmtDate(e.date) }}{{ e.notes ? ' · ' + e.notes : '' }}</p>
            </div>

            <!-- Weight -->
            <div class="text-right flex-shrink-0">
              <span class="font-black text-lg" :class="idx === 0 ? 'text-blue-400' : 'text-gray-300'">
                {{ e.weight }}
              </span>
              <span class="text-gray-600 text-xs ml-1">{{ unit }}</span>
            </div>

            <!-- Change indicator -->
            <div v-if="idx < entries.length - 1" class="flex-shrink-0 w-12 text-right">
              <span class="text-xs font-semibold"
                :class="entries[idx].weight < entries[idx + 1].weight ? 'text-green-500' : entries[idx].weight > entries[idx + 1].weight ? 'text-red-400' : 'text-gray-600'">
                {{ diffStr(entries[idx].weight, entries[idx + 1].weight) }}
              </span>
            </div>

            <!-- Delete -->
            <button
              @click="confirmDelete(e)"
              class="w-8 h-8 flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
            >
              <svg class="w-4 h-4 text-gray-700 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWeightStore } from '../stores/weight.js'
import WeightChart from '../components/WeightChart.vue'
import { useI18n } from '../composables/useI18n.js'

const router = useRouter()
const store  = useWeightStore()
const { entries, unit, latest, delta, chartEntries } = storeToRefs(store)
const { t, language } = useI18n()

const deltaClass = computed(() => {
  if (delta.value === null) return 'text-gray-600'
  if (delta.value < 0) return 'text-green-400'
  if (delta.value > 0) return 'text-red-400'
  return 'text-gray-400'
})

function fmtDate(d) {
  const loc = language.value === 'en' ? 'en' : 'es'
  return new Date(d + 'T00:00:00').toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' })
}

function relativeDate(d) {
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (d === today)     return t('weight.relative.today')
  if (d === yesterday) return t('weight.relative.yesterday')
  const diff = Math.round((new Date(today) - new Date(d)) / 86400000)
  if (diff < 7) return t('weight.relative.days', diff)
  const loc = language.value === 'en' ? 'en' : 'es'
  return new Date(d + 'T00:00:00').toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' })
}

function diffStr(curr, prev) {
  const d = +(curr - prev).toFixed(1)
  if (d === 0) return '='
  return (d > 0 ? '+' : '') + d
}

function confirmDelete(e) {
  if (confirm(t('weight.delete.confirm', fmtDate(e.date)))) {
    store.remove(e.id)
  }
}
</script>
