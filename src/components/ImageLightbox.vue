<template>
  <Teleport to="body">
    <Transition name="lb-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 bg-black flex items-center justify-center"
        @click.self="close"
      >
        <!-- Close -->
        <button
          class="absolute top-5 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center active:scale-90 transition-transform z-10"
          @click="close"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Counter -->
        <div v-if="urls.length > 1" class="absolute top-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-semibold tracking-wider">
          {{ current + 1 }} / {{ urls.length }}
        </div>

        <!-- Image -->
        <img
          :src="urls[current]"
          class="max-w-full max-h-full object-contain select-none px-14"
          @click.stop
        />

        <!-- Prev -->
        <button
          v-if="urls.length > 1 && current > 0"
          class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          @click.stop="current--"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Next -->
        <button
          v-if="urls.length > 1 && current < urls.length - 1"
          class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          @click.stop="current++"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Dot indicators -->
        <div v-if="urls.length > 1" class="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2">
          <button
            v-for="(_, i) in urls"
            :key="i"
            class="w-1.5 h-1.5 rounded-full transition-colors"
            :class="i === current ? 'bg-white' : 'bg-white/25'"
            @click.stop="current = i"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  urls: { type: Array, default: () => [] },
  startIndex: { type: Number, default: 0 },
})
const emit = defineEmits(['update:modelValue'])

const current = ref(props.startIndex)

watch(() => props.modelValue, open => { if (open) current.value = props.startIndex })

function close() { emit('update:modelValue', false) }
</script>

<style scoped>
.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.18s ease; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }
</style>
