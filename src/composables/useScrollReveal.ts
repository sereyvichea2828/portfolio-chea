import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollReveal(threshold = 0.15): {
  targetRef: Ref<HTMLElement | null>
  isVisible: Ref<boolean>
} {
  const targetRef = ref<HTMLElement | null>(null)
  const isVisible = ref<boolean>(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      isVisible.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (observer && entry.target) {
              observer.unobserve(entry.target)
            }
          }
        })
      },
      { threshold },
    )

    if (targetRef.value) {
      observer.observe(targetRef.value)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return { targetRef, isVisible }
}
