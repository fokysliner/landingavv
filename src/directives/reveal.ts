export type Effect = 'fade' | 'fade-up' | 'slide-right' | 'slide-left' | 'zoom'

const initialTransform = (effect: Effect) => {
  switch (effect) {
    case 'slide-right': return 'translateX(-24px)'
    case 'slide-left':  return 'translateX(24px)'
    case 'fade-up':     return 'translateY(24px)'
    case 'zoom':        return 'scale(0.96)'
    default:            return 'translateY(10px)'
  }
}

const enterTransform = 'translateX(0) translateY(0) scale(1)'

const setupNode = (el: HTMLElement, effect: Effect, delayMs: number) => {
  el.style.opacity = '0'
  el.style.transform = initialTransform(effect)
  el.style.transition = `transform .6s cubic-bezier(.22,.8,.26,.99), opacity .6s ease`
  if (delayMs) el.style.transitionDelay = `${delayMs}ms`
}

const reveal = (el: HTMLElement, _effect: Effect) => {
  el.style.transform = enterTransform
  el.style.opacity = '1'
}

const hide = (el: HTMLElement, effect: Effect) => {
  el.style.transform = initialTransform(effect)
  el.style.opacity = '0'
}

export default {
  mounted(el: HTMLElement, binding: { value?: Effect }) {
    const effect: Effect = binding.value || 'fade-up'
    const delayAttr = el.getAttribute('data-delay')
    const delayMs = delayAttr ? Number(delayAttr) || 0 : 0
    const once = el.getAttribute('data-once') === 'true'

    setupNode(el, effect, delayMs)

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            reveal(el, effect)
            if (once) io.unobserve(el)
          } else {
            if (!once) hide(el, effect)
          }
        })
      },
      { threshold: 0.2 }
    )

    // @ts-ignore приватне поле для відв'язки
    el.__revealObserver = io
    io.observe(el)
  },
  unmounted(el: any) {
    if (el.__revealObserver) {
      el.__revealObserver.unobserve(el)
      delete el.__revealObserver
    }
  }
}
