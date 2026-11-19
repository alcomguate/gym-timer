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

      <!-- Image references -->
      <section class="bg-[#1c1c1e] rounded-2xl p-5 border border-[#2c2c2e] space-y-4">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fotos de referencia</h3>

        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="(img, i) in previewImages"
            :key="img.id"
            class="relative aspect-square"
          >
            <img
              :src="img.url"
              class="w-full h-full object-cover rounded-xl cursor-pointer active:opacity-80 transition-opacity"
              @click.stop="openPreview(i)"
            />
            <button
              @click="removeImage(i)"
              class="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <button
            v-if="previewImages.length < 5"
            @click="fileInput.click()"
            class="aspect-square bg-[#2c2c2e] rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform border-2 border-dashed border-[#3c3c3e]"
          >
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-gray-600 text-xs">Añadir</span>
          </button>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          class="hidden"
          @change="handleImageSelect"
        />
        <p class="text-gray-700 text-xs">Ejercicios, postura, etc. · Máx. 5 fotos</p>
        <ImageLightbox v-model="lightboxOpen" :urls="previewImages.map(p => p.url)" :startIndex="lightboxIndex" />
      </section>

      <!-- Video links -->
      <section class="bg-[#1c1c1e] rounded-2xl p-5 border border-[#2c2c2e] space-y-4">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Videos / Referencias</h3>

        <div>
          <div class="flex gap-2">
            <input
              v-model="newVideoUrl"
              type="url"
              placeholder="Pega un link de YouTube, TikTok…"
              class="flex-1 bg-[#2c2c2e] border border-[#3c3c3e] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-sm"
              @keydown.enter.prevent="addVideoLink"
            />
            <button
              @click="addVideoLink"
              class="w-12 h-12 bg-[#2c2c2e] rounded-xl flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
              :class="{ 'opacity-40 pointer-events-none': form.videoLinks.length >= 5 }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <p v-if="urlError" class="text-red-500 text-xs mt-1.5">{{ urlError }}</p>
          <p v-else class="text-gray-700 text-xs mt-1.5">YouTube · TikTok · Facebook · Instagram · Máx. 5</p>
        </div>

        <div v-if="form.videoLinks.length" class="space-y-2">
          <div
            v-for="(url, i) in form.videoLinks"
            :key="i"
            class="flex items-center gap-3 bg-[#2c2c2e] rounded-xl px-3 py-2.5"
          >
            <span
              class="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              :style="{ backgroundColor: detectPlatform(url)?.color + '33', color: detectPlatform(url)?.color }"
            >{{ detectPlatform(url)?.name }}</span>
            <span class="text-gray-400 text-xs truncate flex-1">{{ url }}</span>
            <button
              @click="removeVideoLink(i)"
              class="text-gray-600 active:text-red-500 transition-colors flex-shrink-0 p-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <p v-else class="text-gray-700 text-sm">Sin videos añadidos</p>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRoutinesStore } from '../stores/routines.js'
import TimeInput from '../components/TimeInput.vue'
import ImageLightbox from '../components/ImageLightbox.vue'
import { saveImage, getImageUrl, deleteImage } from '../composables/useImageStore.js'

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
  videoLinks: [],
  imageIds: [],
})

// { id, url } pairs — url is a temporary object URL for preview
const previewImages = ref([])
const fileInput = ref(null)

onUnmounted(() => {
  previewImages.value.forEach(p => URL.revokeObjectURL(p.url))
})

async function handleImageSelect(e) {
  const files = Array.from(e.target.files)
  for (const file of files) {
    if (previewImages.value.length >= 5) break
    const id = await saveImage(file)
    const url = await getImageUrl(id)
    previewImages.value.push({ id, url })
    form.value.imageIds.push(id)
  }
  e.target.value = ''
}

async function removeImage(i) {
  const { id, url } = previewImages.value[i]
  URL.revokeObjectURL(url)
  previewImages.value.splice(i, 1)
  form.value.imageIds.splice(i, 1)
  await deleteImage(id)
}

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

function openPreview(i) {
  lightboxIndex.value = i
  lightboxOpen.value = true
}

const newVideoUrl = ref('')
const urlError = ref('')

function detectPlatform(url) {
  if (/youtube\.com|youtu\.be/.test(url)) return { name: 'YouTube', color: '#ff0000' }
  if (/tiktok\.com/.test(url))             return { name: 'TikTok',   color: '#69c9d0' }
  if (/facebook\.com|fb\.com|fb\.watch/.test(url)) return { name: 'Facebook', color: '#1877f2' }
  if (/instagram\.com/.test(url))          return { name: 'Instagram', color: '#e1306c' }
  return null
}

function addVideoLink() {
  urlError.value = ''
  const url = newVideoUrl.value.trim()
  if (!url) return
  if (form.value.videoLinks.length >= 5) {
    urlError.value = 'Máximo 5 videos por rutina'
    return
  }
  if (!detectPlatform(url)) {
    urlError.value = 'Solo se aceptan links de YouTube, TikTok, Facebook o Instagram'
    return
  }
  form.value.videoLinks.push(url)
  newVideoUrl.value = ''
}

function removeVideoLink(i) {
  form.value.videoLinks.splice(i, 1)
}

function toggleGroup(value) {
  form.value.group = form.value.group === value ? '' : value
}

onMounted(async () => {
  if (!isNew.value) {
    const r = store.getById(route.params.id)
    if (r) {
      Object.assign(form.value, { ...r, imageIds: [...(r.imageIds ?? [])] })
      if (form.value.imageIds.length) {
        const loaded = await Promise.all(
          form.value.imageIds.map(async id => ({ id, url: await getImageUrl(id) }))
        )
        previewImages.value = loaded.filter(p => p.url)
      }
    }
  } else if (route.query.workTime) {
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

async function confirmDelete() {
  if (confirm('¿Eliminar esta rutina?')) {
    const r = store.getById(route.params.id)
    if (r?.imageIds?.length) await Promise.all(r.imageIds.map(id => deleteImage(id)))
    store.remove(route.params.id)
    router.replace('/')
  }
}
</script>
