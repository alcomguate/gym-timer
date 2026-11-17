import { defineStore } from 'pinia'
import { ref } from 'vue'

const DEFAULTS = [
  { id: 'default-1', name: 'HIIT 20/10',   workTime: 20, restTime: 10, rounds: 8, color: '#ef4444', emoji: '🔥', group: 'Cardio' },
  { id: 'default-2', name: 'Fuerza 45/15', workTime: 45, restTime: 15, rounds: 6, color: '#3b82f6', emoji: '💪', group: 'Fuerza' },
  { id: 'default-3', name: 'Tabata',        workTime: 20, restTime: 10, rounds: 8, color: '#8b5cf6', emoji: '⚡', group: 'Cardio' },
]

const QUICK_BASE = { id: 'quick', name: 'Inicio Rápido', emoji: '⚡', color: '#f59e0b', group: '' }

export const useRoutinesStore = defineStore('routines', () => {
  const stored = localStorage.getItem('gym-routines')
  const routines = ref(stored ? JSON.parse(stored) : DEFAULTS)

  // Quick routine: persisted separately so remembers last values used
  const storedQuick = localStorage.getItem('gym-quick')
  const quickRoutine = ref(storedQuick ? JSON.parse(storedQuick) : { ...QUICK_BASE, workTime: 20, restTime: 10, rounds: 8 })

  function persist() {
    localStorage.setItem('gym-routines', JSON.stringify(routines.value))
  }

  function add(routine) {
    routines.value.push({ ...routine, id: Date.now().toString() })
    persist()
  }

  function update(id, data) {
    const i = routines.value.findIndex(r => r.id === id)
    if (i !== -1) {
      routines.value[i] = { ...routines.value[i], ...data }
      persist()
    }
  }

  function remove(id) {
    routines.value = routines.value.filter(r => r.id !== id)
    persist()
  }

  function setQuick(data) {
    quickRoutine.value = { ...QUICK_BASE, ...data }
    localStorage.setItem('gym-quick', JSON.stringify(quickRoutine.value))
  }

  function getById(id) {
    if (id === 'quick') return quickRoutine.value
    return routines.value.find(r => r.id === id)
  }

  return { routines, quickRoutine, add, update, remove, setQuick, getById }
})
