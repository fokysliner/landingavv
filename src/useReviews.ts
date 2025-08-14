import { ref, computed } from 'vue'

type Review = { id: string; text: string; author?: string }

const LS_APPROVED = 'reviews.approved.v2'   
const LS_PENDING  = 'reviews.pending.v2'

const load = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
const save = (key: string, val: unknown) =>
  localStorage.setItem(key, JSON.stringify(val))

const uuid = () =>
  (globalThis.crypto?.randomUUID?.() ??
    `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`)

localStorage.removeItem(LS_APPROVED); 

const approved = ref<Review[]>([
  { id: uuid(), text: '“Оформили все офіційно, без зайвих нервів. Рекомендую!”', author: 'Ірина, Київ' },
  { id: uuid(), text: '“Дуже швидко оформили документи, дякую за вчасні відповіді.”', author: 'Максим, Харків' },
  { id: uuid(), text: '“Ціна/якість найкращі з усього, що дивилась.”', author: 'Олена, Львів' },
  { id: uuid(), text: '“Підтримка відповідала миттєво, усе прозоро.”', author: 'Сергій, Київ' },
  { id: uuid(), text: '“Подача онлайн дуже зручна, однозначно рекомендую.”', author: 'Юлія, Виноградар' },
  { id: uuid(), text: '“Після перерви відчув впевненість за кермом. Дякую!”', author: 'Андрій, Хмельницький' },
  { id: uuid(), text: '“Допомогли з дублікатами документів, усе в строки.”', author: 'Марина, Миколаїв' },
  { id: uuid(), text: '“Відновили після 130, дуже дякую — круті!”', author: 'Влад, Центр' },
]);

save(LS_APPROVED, approved.value); 


const pending  = ref<Review[]>(load<Review[]>(LS_PENDING, []))

save(LS_APPROVED, approved.value)
save(LS_PENDING,  pending.value)

export function useReviews() {
  const pendingCount   = computed(() => pending.value.length)
  const latestApproved = computed(() => approved.value.slice(-6).reverse())

  const submitAnonymous = (text: string) => {
    const r: Review = { id: uuid(), text }
    pending.value.unshift(r)
    save(LS_PENDING, pending.value)
  }

  const approve = (id: string) => {
    const i = pending.value.findIndex(r => r.id === id)
    if (i >= 0) {
      approved.value.push(pending.value[i])
      pending.value.splice(i, 1)
      save(LS_PENDING, pending.value)
      save(LS_APPROVED, approved.value)
    }
  }

  const reject = (id: string) => {
    const i = pending.value.findIndex(r => r.id === id)
    if (i >= 0) {
      pending.value.splice(i, 1)
      save(LS_PENDING, pending.value)
    }
  }

  const isAdminOpen  = ref(false)
  const toggleAdmin  = () => (isAdminOpen.value = !isAdminOpen.value)
  const openAdmin    = () => (isAdminOpen.value = true)
  const closeAdmin   = () => (isAdminOpen.value = false)

  return {
    approved, latestApproved, pending, pendingCount, isAdminOpen,
    submitAnonymous, approve, reject, toggleAdmin, openAdmin, closeAdmin,
  }
}
