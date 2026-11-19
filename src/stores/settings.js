import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const stored = JSON.parse(localStorage.getItem('gym-settings') || '{}')

  const theme    = ref(stored.theme    ?? 'dark')
  const language = ref(stored.language ?? 'es')

  function persist() {
    localStorage.setItem('gym-settings', JSON.stringify({ theme: theme.value, language: language.value }))
  }

  function setTheme(t)    { theme.value    = t; persist() }
  function setLanguage(l) { language.value = l; persist() }

  return { theme, language, setTheme, setLanguage }
})
