import { onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export interface ScrollAnimationConfig {
  start?: string
  once?: boolean
  toggleActions?: string
}

export function useGsapScrollTrigger(
  containerRef: Ref<HTMLElement | null>,
  setupAnimation: (ctx: {
    tl: gsap.core.Timeline
    container: HTMLElement
    gsap: typeof gsap
  }) => void,
  config: ScrollAnimationConfig = {}
): void {
  const { isReducedMotion } = useReducedMotion()
  let triggerInstance: ScrollTrigger | null = null

  onMounted(() => {
    if (typeof window === 'undefined') return

    const container = containerRef.value
    if (!container) return

    // Accessibility guarantee: If reduced motion is preferred, reveal all elements immediately
    if (isReducedMotion.value) {
      container.style.opacity = '1'
      const animatedEls = container.querySelectorAll<HTMLElement>(
        '[data-reveal], .reveal-item, .tech-card, .service-card, .project-card, .process-card'
      )
      animatedEls.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: config.start ?? 'top 80%',
        once: config.once ?? true,
        toggleActions: config.toggleActions ?? 'play none none none',
      },
    })

    triggerInstance = tl.scrollTrigger ?? null

    try {
      setupAnimation({ tl, container, gsap })

      // If section is already scrolled past above viewport on mount, set to completed state.
      // Otherwise allow ScrollTrigger to animate smoothly.
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        const rect = container.getBoundingClientRect()
        if (rect.bottom < 0) {
          tl.progress(1)
        }
      })
    } catch {
      // Fallback: If animation setup fails, ensure content remains visible
      container.style.opacity = '1'
      const fallbackEls = container.querySelectorAll<HTMLElement>(
        '[data-reveal], .reveal-item, .tech-card, .service-card, .project-card, .process-card'
      )
      fallbackEls.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
    }
  })

  onUnmounted(() => {
    if (triggerInstance) {
      triggerInstance.kill()
      triggerInstance = null
    }
  })
}
