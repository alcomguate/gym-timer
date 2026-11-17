<template>
  <div v-if="pts.length >= 2">
    <svg :viewBox="`0 0 ${W} ${H}`" class="w-full" :style="{ height: H + 'px' }">
      <defs>
        <linearGradient :id="gid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   :stop-color="color" stop-opacity="0.25" />
          <stop offset="100%" :stop-color="color" stop-opacity="0"    />
        </linearGradient>
      </defs>

      <!-- Grid lines -->
      <line v-for="(gy, i) in gridYs" :key="i"
        :x1="PL" :y1="gy" :x2="W - PR" :y2="gy"
        stroke="#2c2c2e" stroke-width="1"
      />

      <!-- Y labels -->
      <text v-for="(gl, i) in gridLabels" :key="'yl' + i"
        :x="PL - 5" :y="gl.y + 4"
        fill="#6b7280" font-size="10" text-anchor="end" font-family="monospace"
      >{{ gl.text }}</text>

      <!-- Area fill -->
      <path :d="area" :fill="`url(#${gid})`" />

      <!-- Line -->
      <path :d="line" fill="none" :stroke="color" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round" />

      <!-- Dots -->
      <circle v-for="(p, i) in pts" :key="'d' + i"
        :cx="p.x" :cy="p.y"
        :r="i === pts.length - 1 ? 5 : 3"
        :fill="i === pts.length - 1 ? color : '#0a0a0a'"
        :stroke="color" stroke-width="2"
      />

      <!-- X labels: first / last -->
      <text :x="pts[0].x" :y="H - 3"
        fill="#6b7280" font-size="9" text-anchor="middle">{{ fmtDate(data[0].date) }}</text>
      <text :x="pts[pts.length - 1].x" :y="H - 3"
        fill="#6b7280" font-size="9" text-anchor="middle">{{ fmtDate(data[data.length - 1].date) }}</text>
    </svg>
  </div>
  <div v-else class="flex items-center justify-center h-28 text-gray-700 text-sm">
    Registra al menos 2 mediciones para ver la gráfica
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data:  { type: Array,  default: () => [] }, // [{ date, weight }] ascending
  color: { type: String, default: '#3b82f6' },
})

// Canvas dimensions
const W = 320, H = 130
const PL = 42, PR = 10, PT = 10, PB = 22
const CW = W - PL - PR   // chart width
const CH = H - PT - PB   // chart height

const gid = 'wc-' + Math.random().toString(36).slice(2, 6)

// Last 20 points
const data = computed(() => props.data.slice(-20))

const vals = computed(() => data.value.map(e => e.weight))
const rawMin = computed(() => Math.min(...vals.value))
const rawMax = computed(() => Math.max(...vals.value))
const pad    = computed(() => Math.max((rawMax.value - rawMin.value) * 0.15, 0.5))
const cMin   = computed(() => rawMin.value - pad.value)
const cMax   = computed(() => rawMax.value + pad.value)
const cRange = computed(() => cMax.value - cMin.value)

function xFor(i) {
  const n = data.value.length
  return PL + (n <= 1 ? CW / 2 : (i / (n - 1)) * CW)
}
function yFor(w) {
  return PT + (1 - (w - cMin.value) / cRange.value) * CH
}

const pts = computed(() =>
  data.value.map((e, i) => ({ x: xFor(i), y: yFor(e.weight) }))
)

const line = computed(() =>
  pts.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
)

const area = computed(() => {
  if (pts.value.length < 2) return ''
  const bot = PT + CH
  const first = pts.value[0], last = pts.value[pts.value.length - 1]
  return `${line.value} L${last.x.toFixed(1)},${bot} L${first.x.toFixed(1)},${bot} Z`
})

// 3 horizontal grid lines
const gridYs = computed(() =>
  [0, 0.5, 1].map(f => PT + f * CH)
)
const gridLabels = computed(() =>
  [0, 0.5, 1].map((f, i) => ({
    y: gridYs.value[i],
    text: (cMax.value - f * cRange.value).toFixed(1),
  }))
)

function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00')
  return dt.toLocaleDateString('es', { day: 'numeric', month: 'short' })
}
</script>
