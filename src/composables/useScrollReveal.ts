import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollReveal(threshold = 0.1): {
  targetRef: Ref<HTMLElement | null>
  isVisible: Ref<boolean>
} {
  const targetRef = ref<HTMLElement | null>(null)
  const isVisible = ref<boolean>(false)
  let observer: IntersectionObserver | null = null
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null

  onMounted(() => {
    if (typeof window === 'undefined') {
      isVisible.value = true
      return
    }

    if (!('IntersectionObserver' in window)) {
      isVisible.value = true
      return
    }

    // 1. Immediate viewport check on mount (eliminates stuck transparent state on direct navigation or reload)
    requestAnimationFrame(() => {
      if (targetRef.value) {
        const rect = targetRef.value.getBoundingClientRect()
        if (rect.top < window.innerHeight + 120 && rect.bottom > 0) {
          isVisible.value = true
          return
        }
      }
    })

    // 2. High-performance, generous intersection trigger
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
      {
        threshold: [0, threshold],
        rootMargin: '120px 0px 60px 0px',
      },
    )

    if (targetRef.value) {
      observer.observe(targetRef.value)
    }

    // 3. Fail-safe timeout: guarantees essential content is visible after 1.2s regardless of scroll behavior
    fallbackTimer = setTimeout(() => {
      if (!isVisible.value && targetRef.value) {
        const rect = targetRef.value.getBoundingClientRect()
        if (rect.top < window.innerHeight + 200) {
          isVisible.value = true
        }
      }
    }, 1200)
  })

  onUnmounted(() => {
    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return { targetRef, isVisible }
}
