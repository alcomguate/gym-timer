<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <label class="text-sm text-gray-400">{{ label }}</label>
      <span class="text-2xl font-black" :style="{ color }">{{ modelValue }}s</span>
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="change(-5)"
        class="w-12 h-12 bg-[#2c2c2e] rounded-xl font-bold active:scale-90 transition-transform flex items-center justify-center text-sm"
      >-5</button>
      <button
        @click="change(-1)"
        class="w-10 h-10 bg-[#2c2c2e] rounded-xl font-bold active:scale-90 transition-transform flex items-center justify-center text-xs text-gray-400"
      >-1</button>
      <div class="flex-1">
        <input
          type="range"
          :value="modelValue"
          :min="min"
          :max="max"
          step="1"
          @input="e => emit('update:modelValue', +e.target.value)"
          class="w-full"
        />
      </div>
      <button
        @click="change(1)"
        class="w-10 h-10 bg-[#2c2c2e] rounded-xl font-bold active:scale-90 transition-transform flex items-center justify-center text-xs text-gray-400"
      >+1</button>
      <button
        @click="change(5)"
        class="w-12 h-12 bg-[#2c2c2e] rounded-xl font-bold active:scale-90 transition-transform flex items-center justify-center text-sm"
      >+5</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 30 },
  label:      { type: String, default: '' },
  color:      { type: String, default: '#ef4444' },
  min:        { type: Number, default: 0 },
  max:        { type: Number, default: 300 },
})

const emit = defineEmits(['update:modelValue'])

function change(delta) {
  emit('update:modelValue', Math.max(props.min, Math.min(props.max, props.modelValue + delta)))
}
</script>
