<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  author?: string
}>(), {
  author: 'Анонімно'
})
</script>

<template>
  <article
    class="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur
           shadow-[0_10px_30px_rgba(0,0,0,.35)] hover:shadow-[0_16px_40px_rgba(0,0,0,.45)]
           transition-all duration-300"
  >
    <div class="flex items-start gap-4">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full
                  bg-white/10 border border-white/10 text-white/80">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a7.5 7.5 0 0 1 15 0v.75H4.5v-.75Z" />
        </svg>
      </div>

      <div class="min-w-0">
        <p class="text-white/90 leading-relaxed">{{ props.text }}</p>
        <p class="mt-3 text-sm text-white/60">— {{ props.author }}</p>
      </div>
    </div>
  </article>
</template>
