import { ref, computed } from "vue";

type Review = { id: string; text: string };

const LS_APPROVED = "reviews.approved";
const LS_PENDING  = "reviews.pending";

const load = <T>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || "") as T; }
  catch { return fallback; }
};
const save = (key: string, val: unknown) =>
  localStorage.setItem(key, JSON.stringify(val));

const approved = ref<Review[]>(load<Review[]>(LS_APPROVED, [
  { id: "seed-1", text: "“Скористалися послугами — все офіційно та в строк.”" },
  { id: "seed-2", text: "“Доступна ціна і чудова підтримка.”" },
]));
const pending  = ref<Review[]>(load<Review[]>(LS_PENDING, []));

save(LS_APPROVED, approved.value);
save(LS_PENDING,  pending.value);

export function useReviews() {
  const pendingCount  = computed(() => pending.value.length);
  const latestApproved = computed(() => approved.value.slice(-6).reverse());

  const submitAnonymous = async (text: string) => {
    const r: Review = { id: crypto.randomUUID(), text };
    pending.value.unshift(r);
    save(LS_PENDING, pending.value);
  };

  const approve = (id: string) => {
    const i = pending.value.findIndex(r => r.id === id);
    if (i >= 0) {
      approved.value.push(pending.value[i]);
      pending.value.splice(i, 1);
      save(LS_PENDING, pending.value);
      save(LS_APPROVED, approved.value);
    }
  };

  const reject = (id: string) => {
    const i = pending.value.findIndex(r => r.id === id);
    if (i >= 0) {
      pending.value.splice(i, 1);
      save(LS_PENDING, pending.value);
    }
  };

  const isAdminOpen  = ref(false);
  const toggleAdmin  = () => (isAdminOpen.value = !isAdminOpen.value);
  const openAdmin    = () => (isAdminOpen.value = true);
  const closeAdmin   = () => (isAdminOpen.value = false);

  return {
    approved, latestApproved, pending, pendingCount, isAdminOpen,
    submitAnonymous, approve, reject,
    toggleAdmin, openAdmin, closeAdmin,
  };
}
