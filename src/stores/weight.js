import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWeightStore = defineStore('weight', () => {
  const stored = localStorage.getItem('gym-weight-entries')
  const entries = ref(stored ? JSON.parse(stored) : [])

  const unit = ref(localStorage.getItem('gym-weight-unit') || 'kg')

  function persist() {
    localStorage.setItem('gym-weight-entries', JSON.stringify(entries.value))
  }

  function add({ date, weight, notes = '' }) {
    // Replace same-day entry if exists
    const idx = entries.value.findIndex(e => e.date === date)
    if (idx !== -1) {
      entries.value[idx] = { ...entries.value[idx], weight, notes }
    } else {
      entries.value.push({ id: Date.now().toString(), date, weight: +weight, notes })
    }
    // Keep sorted: newest first
    entries.value.sort((a, b) => b.date.localeCompare(a.date))
    persist()
  }

  function remove(id) {
    entries.value = entries.value.filter(e => e.id !== id)
    persist()
  }

  function setUnit(u) {
    unit.value = u
    localStorage.setItem('gym-weight-unit', u)
  }

  // Newest entry
  const latest = computed(() => entries.value[0] ?? null)

  // Change vs previous entry
  const delta = computed(() => {
    if (entries.value.length < 2) return null
    return +(entries.value[0].weight - entries.value[1].weight).toFixed(1)
  })

  // Entries in ascending order for the chart (oldest first)
  const chartEntries = computed(() => [...entries.value].reverse())

  return { entries, unit, add, remove, setUnit, latest, delta, chartEntries }
})
