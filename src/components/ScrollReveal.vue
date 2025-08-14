<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

type Effect =
  | 'fade-up'
  | 'slide-right'
  | 'slide-left'
  | 'slide-up'
  | 'zoom'
  | 'fade'

const props = withDefaults(defineProps<{
  effect?: Effect
  delay?: number
  once?: boolean   
  threshold?: number
}>(), {
  effect: 'fade-up',
  delay: 0,
  once: false,
  threshold: 0.2
})

const el = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null

const enter = (node: HTMLElement) => {
  node.style.transition = 'transform .6s cubic-bezier(.22,.8,.26,.99), opacity .6s ease'
  node.style.transitionDelay = `${props.delay}ms`
  node.classList.add('sr-in')
  node.classList.remove('sr-out')
}
const leave = (node: HTMLElement) => {
  node.style.transition = 'transform .4s ease, opacity .4s ease'
  node.classList.add('sr-out')
  node.classList.remove('sr-in')
}

onMounted(() => {
  const node = el.value!
  node.classList.add('sr-out')
  switch (props.effect) {
    case 'slide-right': node.style.transform = 'translateX(-24px)'; break
    case 'slide-left':  node.style.transform = 'translateX(24px)'; break
    case 'slide-up':    node.style.transform = 'translateY(24px)'; break
    case 'zoom':        node.style.transform = 'scale(.96)'; break
    default:            node.style.transform = 'translateY(18px)'
  }
  node.style.opacity = '0'

  io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        enter(node)
        node.style.transform = 'translateX(0) translateY(0) scale(1)'
        node.style.opacity = '1'
        if (props.once) io?.unobserve(node)
      } else if (!props.once) {
        leave(node)
        switch (props.effect) {
          case 'slide-right': node.style.transform = 'translateX(-24px)'; break
          case 'slide-left':  node.style.transform = 'translateX(24px)'; break
          case 'slide-up':    node.style.transform = 'translateY(24px)'; break
          case 'zoom':        node.style.transform = 'scale(.96)'; break
          default:            node.style.transform = 'translateY(18px)'
        }
        node.style.opacity = '0'
      }
    })
  }, { threshold: props.threshold })

  io.observe(node)
})

onBeforeUnmount(() => {
  if (io && el.value) io.unobserve(el.value)
  io = null
})
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>

<style scoped>
.sr-in  {}
.sr-out {}
</style>
