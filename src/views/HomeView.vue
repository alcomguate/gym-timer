<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-30 px-5 pt-12 pb-5 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Hamburger -->
          <button
            @click="drawerOpen = true"
            class="w-10 h-10 bg-[#2c2c2e] rounded-xl flex flex-col items-center justify-center gap-[5px] active:scale-90 transition-transform"
          >
            <span class="hamburger-line w-5 h-0.5 bg-white rounded-full block" />
            <span class="hamburger-line w-5 h-0.5 bg-white rounded-full block" />
            <span class="hamburger-line w-3 h-0.5 bg-white/50 rounded-full block" />
          </button>
          <div>
            <h1 class="text-3xl font-black tracking-tight">GYM TIMER</h1>
            <p class="text-gray-500 text-sm mt-0.5">{{ subtitle }}</p>
          </div>
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
        <p class="text-gray-400 text-lg font-semibold">{{ t('home.empty') }}</p>
        <p class="text-gray-600 text-sm mt-1">{{ t('home.empty.sub') }}</p>
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
            {{ groupKey || t('home.group.none') }}
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
                  {{ r.rounds }} · {{ r.workTime }}s {{ t('routine.work') }} · {{ r.restTime }}s {{ t('routine.rest') }}
                </p>
                <p class="text-gray-700 text-xs">{{ t('routine.total') }} {{ formatTotal(r) }}</p>
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
              {{ t('routine.start') }}
            </button>

            <!-- Image thumbnails -->
            <ImageStrip :imageIds="r.imageIds" />

            <!-- Video links -->
            <div v-if="r.videoLinks?.length" class="mt-2 flex flex-wrap gap-1.5">
              <button
                v-for="(url, i) in r.videoLinks"
                :key="i"
                @click.stop="openLink(url)"
                class="text-xs font-bold px-2.5 py-1 rounded-full active:scale-95 transition-transform"
                :style="{ backgroundColor: detectPlatform(url)?.color + '22', color: detectPlatform(url)?.color, border: `1px solid ${detectPlatform(url)?.color}44` }"
              >▶ {{ detectPlatform(url)?.name }}</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Exit confirmation toast -->
    <Teleport to="body">
      <Transition name="exit-toast">
        <div
          v-if="exitToast"
          class="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[#2c2c2e]/95 backdrop-blur rounded-2xl border border-white/10 flex items-center gap-2.5 shadow-xl"
        >
          <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span class="text-sm font-semibold text-white whitespace-nowrap">{{ t('exit.confirm') }}</span>
        </div>
      </Transition>
    </Teleport>

    <!-- Side drawer -->
    <Teleport to="body">
      <Transition name="drawer-overlay">
        <div
          v-if="drawerOpen"
          class="fixed inset-0 z-50 bg-black/60"
          @click.self="drawerOpen = false"
        >
          <Transition name="drawer-panel" appear>
            <aside
              v-if="drawerOpen"
              class="absolute left-0 top-0 h-full w-72 bg-[#0f0f0f] flex flex-col"
              @click.stop
            >
              <!-- Brand header -->
              <div class="relative px-5 pt-14 pb-7" :style="drawerGradient">
                <button
                  @click="drawerOpen = false"
                  class="absolute top-5 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                >
                  <svg class="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
                <div class="text-5xl mb-4 leading-none">⏱️</div>
                <h2 class="text-xl font-black tracking-tight text-white">GYM TIMER</h2>
                <p class="text-red-400/70 text-xs font-medium mt-0.5">Cronómetro de entrenamiento</p>
              </div>

              <!-- Nav -->
              <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                <p class="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 pb-2 pt-1">{{ t('nav.navigation') }}</p>

                <button
                  @click="drawerOpen = false; $router.push('/')"
                  class="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-left"
                >
                  <span class="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H7m0 0l5-5m-5 5l5 5"/>
                    </svg>
                  </span>
                  <span class="text-sm font-bold text-red-300">{{ t('nav.routines') }}</span>
                </button>

                <button
                  @click="drawerOpen = false; $router.push('/quick')"
                  class="w-full flex items-center gap-3 px-3 py-3 rounded-xl active:bg-[#2c2c2e] transition-colors text-left group"
                >
                  <span class="w-8 h-8 bg-[#2c2c2e] rounded-lg flex items-center justify-center flex-shrink-0 group-active:bg-amber-500/20 transition-colors">
                    <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2L4.09 12.37A1 1 0 005 14h6v8l8.91-10.37A1 1 0 0019 10h-6V2z"/>
                    </svg>
                  </span>
                  <span class="text-sm font-semibold text-gray-200">{{ t('nav.quick') }}</span>
                </button>

                <button
                  @click="drawerOpen = false; $router.push('/weight')"
                  class="w-full flex items-center gap-3 px-3 py-3 rounded-xl active:bg-[#2c2c2e] transition-colors text-left group"
                >
                  <span class="w-8 h-8 bg-[#2c2c2e] rounded-lg flex items-center justify-center flex-shrink-0 group-active:bg-blue-500/20 transition-colors">
                    <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3C8.686 3 6 5.686 6 9c0 2.21 1.344 4.104 3.282 5H4v2h16v-2h-5.282C16.656 13.104 18 11.21 18 9c0-3.314-2.686-6-6-6z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21h8M12 16v5"/>
                    </svg>
                  </span>
                  <span class="text-sm font-semibold text-gray-200">{{ t('nav.weight') }}</span>
                </button>

                <button
                  @click="drawerOpen = false; $router.push('/routine/new')"
                  class="w-full flex items-center gap-3 px-3 py-3 rounded-xl active:bg-[#2c2c2e] transition-colors text-left group"
                >
                  <span class="w-8 h-8 bg-[#2c2c2e] rounded-lg flex items-center justify-center flex-shrink-0 group-active:bg-red-500/20 transition-colors">
                    <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                    </svg>
                  </span>
                  <span class="text-sm font-semibold text-gray-200">{{ t('nav.new') }}</span>
                </button>
              </nav>

              <!-- Settings -->
              <div class="px-3 py-3 border-t border-white/5 space-y-1">
                <p class="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 pb-1">{{ t('nav.settings') }}</p>

                <div class="flex items-center justify-between px-3 py-2">
                  <span class="text-sm text-gray-200">{{ t('nav.language') }}</span>
                  <div class="flex gap-0.5 bg-[#2c2c2e] p-0.5 rounded-lg">
                    <button
                      v-for="lang in ['es','en']" :key="lang"
                      @click="settings.setLanguage(lang)"
                      class="px-3 py-1 rounded-md text-xs font-black transition-all"
                      :class="language === lang ? 'bg-red-500 text-white' : 'text-gray-500'"
                    >{{ lang.toUpperCase() }}</button>
                  </div>
                </div>

                <div class="flex items-center justify-between px-3 py-2">
                  <span class="text-sm text-gray-200">{{ t('nav.theme') }}</span>
                  <div class="flex gap-0.5 bg-[#2c2c2e] p-0.5 rounded-lg">
                    <button
                      @click="settings.setTheme('dark')"
                      class="px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1"
                      :class="theme === 'dark' ? 'bg-red-500 text-white' : 'text-gray-500'"
                    >🌙 {{ t('nav.theme.dark') }}</button>
                    <button
                      @click="settings.setTheme('light')"
                      class="px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1"
                      :class="theme === 'light' ? 'bg-red-500 text-white' : 'text-gray-500'"
                    >☀️ {{ t('nav.theme.light') }}</button>
                  </div>
                </div>
              </div>

              <!-- About -->
              <div class="px-3 pb-10 pt-3 border-t border-white/5 space-y-2">
                <p class="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 pb-1">{{ t('nav.about') }}</p>

                <div class="bg-[#1c1c1e] rounded-xl px-3.5 py-3 flex items-center gap-3 border border-white/5">
                  <span class="w-8 h-8 bg-[#2c2c2e] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </span>
                  <div class="min-w-0">
                    <p class="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{{ t('nav.author') }}</p>
                    <p class="text-sm font-bold text-white truncate">Alan Vidaurre</p>
                  </div>
                </div>

                <div class="bg-[#1c1c1e] rounded-xl px-3.5 py-3 flex items-center gap-3 border border-white/5">
                  <span class="w-8 h-8 bg-[#2c2c2e] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </span>
                  <div class="min-w-0">
                    <p class="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{{ t('nav.contact') }}</p>
                    <p class="text-xs font-semibold text-white truncate">alan.vidaurre@gmail.com</p>
                  </div>
                </div>

                <div class="bg-[#1c1c1e] rounded-xl px-3.5 py-3 flex items-center gap-3 border border-white/5">
                  <span class="w-8 h-8 bg-[#2c2c2e] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>
                    </svg>
                  </span>
                  <div class="min-w-0">
                    <p class="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{{ t('nav.version') }}</p>
                    <p class="text-sm font-bold text-white">v{{ version }}</p>
                  </div>
                </div>
              </div>
            </aside>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutinesStore } from '../stores/routines.js'
import { useSettingsStore } from '../stores/settings.js'
import { useI18n } from '../composables/useI18n.js'
import ImageStrip from '../components/ImageStrip.vue'
import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'
import { version } from '../../package.json'

const { routines } = storeToRefs(useRoutinesStore())
const settings = useSettingsStore()
const { theme, language } = storeToRefs(settings)
const { t } = useI18n()

const drawerOpen = ref(false)

const drawerGradient = computed(() =>
  theme.value === 'light'
    ? 'background: linear-gradient(160deg, #fee2e2 0%, #fff1f2 60%, #f5f5f5 100%)'
    : 'background: linear-gradient(160deg, #3b0a0a 0%, #1a0505 50%, #0f0f0f 100%)'
)

// Back-button exit confirmation (Android APK only)
const exitToast = ref(false)
let exitToastTimer = null
let backListener = null

onMounted(async () => {
  if (!Capacitor.isNativePlatform()) return
  backListener = await CapApp.addListener('backButton', () => {
    if (drawerOpen.value) { drawerOpen.value = false; return }
    if (exitToast.value) {
      CapApp.exitApp()
      return
    }
    exitToast.value = true
    exitToastTimer = setTimeout(() => { exitToast.value = false }, 2000)
  })
})

onUnmounted(() => {
  backListener?.remove()
  clearTimeout(exitToastTimer)
})

const DAY_ORDER_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const DAY_ORDER_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const groupedRoutines = computed(() => {
  const map = new Map()
  for (const r of routines.value) {
    const key = r.group?.trim() || ''
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(r)
  }
  const DAY_ORDER = language.value === 'en' ? DAY_ORDER_EN : DAY_ORDER_ES
  return [...map.entries()].sort(([a], [b]) => {
    if (a === '' && b === '') return 0
    if (a === '') return 1
    if (b === '') return -1
    const ai = DAY_ORDER.indexOf(a)
    const bi = DAY_ORDER.indexOf(b)
    if (ai >= 0 && bi >= 0) return ai - bi
    if (ai >= 0) return -1
    if (bi >= 0) return 1
    return a.localeCompare(b, language.value)
  })
})

const namedGroupCount = computed(
  () => groupedRoutines.value.filter(([k]) => k !== '').length
)

const subtitle = computed(() =>
  t('home.subtitle', namedGroupCount.value, routines.value.length)
)

// Collapsible groups — stored by group key
const collapsed = ref(new Set())
function toggleGroup(key) {
  const next = new Set(collapsed.value)
  next.has(key) ? next.delete(key) : next.add(key)
  collapsed.value = next
}

function detectPlatform(url) {
  if (/youtube\.com|youtu\.be/.test(url)) return { name: 'YouTube',   color: '#ff0000' }
  if (/tiktok\.com/.test(url))             return { name: 'TikTok',    color: '#69c9d0' }
  if (/facebook\.com|fb\.com|fb\.watch/.test(url)) return { name: 'Facebook', color: '#1877f2' }
  if (/instagram\.com/.test(url))          return { name: 'Instagram', color: '#e1306c' }
  return { name: 'Video', color: '#6b7280' }
}

function openLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function formatTotal(r) {
  const secs = r.rounds * r.workTime + Math.max(0, r.rounds - 1) * r.restTime + 3
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m > 0 ? (s > 0 ? `${m}m ${s}s` : `${m}m`) : `${s}s`
}
</script>

<style scoped>
.drawer-overlay-enter-active, .drawer-overlay-leave-active { transition: opacity 0.22s ease; }
.drawer-overlay-enter-from, .drawer-overlay-leave-to { opacity: 0; }

.drawer-panel-enter-active, .drawer-panel-leave-active { transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); }
.drawer-panel-enter-from, .drawer-panel-leave-to { transform: translateX(-100%); }

.exit-toast-enter-active, .exit-toast-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.exit-toast-enter-from, .exit-toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }
</style>
