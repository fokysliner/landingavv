<template>
  <header
    :class="[
      'fixed inset-x-0 top-0 z-50 transition-all duration-300',
      hiddenOnScroll ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
    ]"
  >
    <div
      :class="[
        'mx-auto max-w-7xl',
        'px-4 py-3',
        'backdrop-blur-md',
        'border-b border-white/10',
        'transition-all duration-300',
        elevated ? 'bg-[#0b0c10]/70 shadow-[0_8px_30px_rgba(0,0,0,.25)]' : 'bg-[#0b0c10]/40'
      ]"
    >
      <nav class="flex items-center justify-between gap-4">
        <a href="#" class="flex items-center gap-3">
          <svg viewBox="0 0 48 48" class="w-9 h-9">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#ff5a59"/>
                <stop offset="1" stop-color="#b81d2b"/>
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="20" fill="url(#g)" opacity=".15"/>
            <circle cx="24" cy="24" r="12" fill="none" stroke="url(#g)" stroke-width="2"/>
            <path d="M12 24h24M24 12v8M24 28v8" stroke="url(#g)" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="font-extrabold tracking-tight">Avto-School24</span>
        </a>

        <ul class="hidden md:flex items-center gap-6 text-sm text-white/80">
          <li v-for="i in items" :key="i.href">
            <a :href="i.href" class="group relative inline-block py-1 hover:text-white transition-colors">
              {{ i.label }}
              <span class="absolute left-0 -bottom-0.5 h-px w-0 bg-gradient-to-r from-[#ff5a59] to-pink-400 transition-all duration-300 group-hover:w-full"/>
            </a>
          </li>
          <li>
            <a href="#contact"
               class="rounded-2xl bg-[#ff5a59]/90 hover:bg-[#ff5a59] text-white px-4 py-2
                      shadow-[0_0_24px_rgba(255,90,89,.35)] transition">
              Подати заявку
            </a>
          </li>
        </ul>

        <button
          class="md:hidden relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center"
          @click="toggle"
          :aria-expanded="open"
          aria-label="Меню"
        >
          <span :class="['absolute block w-5 h-0.5 bg-white transition-transform duration-300', open ? 'translate-y-0 rotate-45'   : '-translate-y-1.5']"/>
          <span :class="['absolute block w-5 h-0.5 bg-white transition-opacity  duration-300', open ? 'opacity-0'                 : 'opacity-100']"/>
          <span :class="['absolute block w-5 h-0.5 bg-white transition-transform duration-300', open ? 'translate-y-0 -rotate-45' : 'translate-y-1.5']"/>
        </button>
      </nav>
    </div>

    <transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="open" class="md:hidden bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/10">
        <div class="mx-auto max-w-7xl px-4 py-4 space-y-2">
          <a v-for="i in items" :key="i.href" :href="i.href"
             class="block rounded-xl px-4 py-3 bg-white/[0.04] border border-white/10 hover:border-[#ff5a59]/50 transition"
             @click="close">{{ i.label }}</a>

          <a href="#contact"
             class="block rounded-xl px-4 py-3 text-center bg-[#ff5a59]/90 hover:bg-[#ff5a59] text-white transition"
             @click="close">Подати заявку</a>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

type Item = { label: string; href: string }
const items: Item[] = [
  { label: 'Про нас',     href: '#about'   },
  { label: 'Етапи',       href: '#steps'   },
  { label: 'Статистика',  href: '#stats'   },
  { label: 'Відгуки',     href: '#reviews' },
]

const open = ref(false)
const hiddenOnScroll = ref(false)
const elevated = ref(false)

let lastY = 0
const THRESH = 8

function onScroll() {
  if (open.value) return

  const y = window.scrollY || 0
  elevated.value = y > 12
  const delta = y - lastY
  if (Math.abs(delta) > THRESH) {
    hiddenOnScroll.value = delta > 0 && y > 80
    lastY = y
  }
}
function toggle() { open.value = !open.value }
function close()  { open.value = false }

function onKey(e: KeyboardEvent) { if (e.key === 'Escape') close() }

onMounted(() => {
  lastY = window.scrollY || 0
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
</style>
