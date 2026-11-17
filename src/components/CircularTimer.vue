<template>
  <div class="relative flex items-center justify-center no-select" :style="{ width: size + 'px', height: size + 'px' }">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      style="transform: rotate(-90deg);"
    >
      <!-- Track -->
      <circle
        :cx="center" :cy="center" :r="radius"
        fill="none"
        stroke="#2c2c2e"
        :stroke-width="strokeWidth"
      />
      <!-- Progress arc -->
      <circle
        :cx="center" :cy="center" :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        style="transition: stroke-dashoffset 0.08s linear, stroke 0.4s ease;"
      />
    </svg>
    <!-- Centered content slot -->
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress:    { type: Number, default: 1 },
  color:       { type: String, default: '#ef4444' },
  size:        { type: Number, default: 280 },
  strokeWidth: { type: Number, default: 14 },
})

const center      = computed(() => props.size / 2)
const radius      = computed(() => center.value - props.strokeWidth - 6)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset  = computed(() => circumference.value * (1 - Math.max(0, Math.min(1, props.progress))))
</script>
