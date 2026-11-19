<template>
  <div v-if="urls.length" class="flex gap-1.5 mt-2 overflow-x-auto pb-0.5">
    <img
      v-for="(url, i) in urls"
      :key="i"
      :src="url"
      class="w-14 h-14 rounded-xl object-cover flex-shrink-0 active:scale-95 transition-transform cursor-pointer"
      @click.stop="openAt(i)"
    />
  </div>
  <ImageLightbox v-model="open" :urls="urls" :startIndex="startIndex" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { getImageUrl } from '../composables/useImageStore.js'
import ImageLightbox from './ImageLightbox.vue'

const props = defineProps({ imageIds: Array })

const urls = ref([])
const open = ref(false)
const startIndex = ref(0)

function openAt(i) {
  startIndex.value = i
  open.value = true
}

function revoke() {
  urls.value.forEach(u => URL.revokeObjectURL(u))
  urls.value = []
}

async function load() {
  revoke()
  if (!props.imageIds?.length) return
  const loaded = await Promise.all(props.imageIds.map(id => getImageUrl(id)))
  urls.value = loaded.filter(Boolean)
}

onMounted(load)
watch(() => props.imageIds, load, { deep: true })
onUnmounted(revoke)
</script>
