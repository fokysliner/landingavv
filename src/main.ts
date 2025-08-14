import { createApp } from 'vue'
import App from './App.vue'

// твоя директива reveal та AOS (залиши як було у проєкті)
import { RevealDirective } from './directives/reveal'
import { initAOS, refreshAOS } from './plugins/aos'

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
  }
}

const app = createApp(App)

// директива
app.directive('reveal', RevealDirective)

app.mount('#app')

// ініціалізація анімацій
requestAnimationFrame(() => {
  initAOS()
})

// HMR: оновлення AOS після зміни стилів у dev
if (import.meta && import.meta.hot) {
  import.meta.hot.on('vite:afterUpdate', () => {
    setTimeout(() => {
      refreshAOS()
    }, 0)
  })
}

/* ============================
   Facebook Pixel Lead tracking
   ============================ */

/** безпечний виклик fbq */
function safeFbq(...args: any[]) {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq(...args)
    }
  } catch { /* ignore */ }
}

/** отримати зручну назву кнопки */
function getLabel(el: Element | null): string {
  if (!el) return 'telegram button'
  const t = (el.textContent || '').trim()
  return t || (el.getAttribute('aria-label') || 'telegram button')
}

/** делегований слухач кліків — ловить усі кнопки/посилання з Телеграмом */
document.addEventListener('click', (ev) => {
  const target = ev.target as HTMLElement | null
  if (!target) return

  // шукаємо найближчу кнопку/посилання
  const el = target.closest('a,button') as HTMLAnchorElement | HTMLButtonElement | null
  if (!el) return

  // 1) посилання на Телеграм (t.me / tg:)
  const href = (el as HTMLAnchorElement).href || ''
  const isTelegramHref = href.includes('t.me') || href.startsWith('tg:')

  // 2) елемент з класом .tg-btn (можеш тримати свій клас на будь-яких ТГ-кнопках)
  const isTgClass = el.classList.contains('tg-btn')

  // 3) елемент з атрибутом data-fb-lead (можеш помічати додаткові кнопки цим атрибутом)
  const hasAttr = el.hasAttribute('data-fb-lead')

  if (isTelegramHref || isTgClass || hasAttr) {
    safeFbq('track', 'Lead', {
      source: 'telegram',
      label: getLabel(el),
      href: href || undefined,
    })
  }
})
