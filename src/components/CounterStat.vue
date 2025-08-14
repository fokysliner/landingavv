<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

type Props = {
  value: string        // напр.: "80+", "85%", "2500+", "Топ"
  label: string        // підпис під числом
  delay?: number       // затримка старту (мс)
}
const props = defineProps<Props>()

const display = ref(props.value)
const elRef = ref<HTMLElement | null>(null)

let io: IntersectionObserver | null = null
let raf = 0

function parseValue(v: string) {
  const m = v.match(/^(\d+(?:[.,]\d+)?)(.*)$/)
  if (!m) return { num: NaN, suffix: '' }
  return { num: Number(m[1].replace(',', '.')), suffix: m[2] ?? '' }
}

function animateCount(target: number, suffix: string, duration = 1200, delay = 0) {
  cancelAnimationFrame(raf)
  const startTs = performance.now() + delay
  const start = 0

  const tick = (t: number) => {
    if (t < startTs) {
      raf = requestAnimationFrame(tick)
      return
    }
    const p = Math.min(1, (t - startTs) / duration)
    // easeOutCubic
    const eased = 1 - Math.pow(1 - p, 3)
    const val = Math.round((start + (target - start) * eased))
    display.value = `${val}${suffix}`
    if (p < 1) raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  const { num, suffix } = parseValue(props.value)
  if (Number.isNaN(num)) return

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(num, suffix, 1200, props.delay ?? 0)
          // одноразово
          io?.unobserve(e.target)
        }
      })
    },
    { threshold: 0.4 }
  )
  if (elRef.value) io.observe(elRef.value)
})

onBeforeUnmount(() => {
  if (io && elRef.value) io.unobserve(elRef.value)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div
    ref="elRef"
    class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-12 p-6 text-center 
           transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_18px_50px_-25px_rgba(255,90,89,.25)]"
  >
    <span class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/60 to-transparent opacity-70"></span>

    <div class="text-4xl font-extrabold text-brand-400 select-none">{{ display }}</div>
    <p class="text-white/70 mt-1">{{ label }}</p>

    <div class="pointer-events-none absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-brand-500/10 blur-2xl opacity-0 
                group-hover:opacity-100 transition-opacity"></div>
  </div>
</template>
