<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Effect = 'fade' | 'slide-up' | 'slide-right' | 'zoom' | 'skew'

const props = defineProps<{
  as?: keyof HTMLElementTagNameMap
  effect?: Effect
  delay?: number
}>()

const root = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!root.value) return
  const el = root.value
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add('reveal-active'), props.delay ?? 0)
          io.unobserve(el)
        }
      })
    },
    { threshold: 0.15 }
  )
  io.observe(el)
})
</script>

<template>
  <component
    :is="as || 'div'"
    ref="root"
    class="reveal"
    :class="{
      'reveal-fade': (effect ?? 'fade') === 'fade',
      'reveal-slide-up': effect === 'slide-up',
      'reveal-slide-right': effect === 'slide-right',
      'reveal-zoom': effect === 'zoom',
      'reveal-skew': effect === 'skew',
    }"
  >
    <slot />
  </component>
</template>

<style scoped>
</style>
