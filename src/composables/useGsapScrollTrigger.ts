import { onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export const MOTION_SYSTEM = {
  ease: {
    out: 'power3.out',
    gentle: 'power2.out',
    inOut: 'power2.inOut',
    snappy: 'expo.out',
  },
  duration: {
    micro: 0.25,
    quick: 0.45,
    normal: 0.65,
    smooth: 0.75,
  },
  stagger: {
    tight: 0.05,
    normal: 0.08,
    relaxed: 0.1,
  },
  distance: {
    sm: 10,
    md: 16,
    lg: 24,
  },
} as const

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
    motion: typeof MOTION_SYSTEM
  }) => void,
  config: ScrollAnimationConfig = {}
): void {
  const { isReducedMotion } = useReducedMotion()
  let ctx: gsap.Context | null = null

  onMounted(() => {
    if (typeof window === 'undefined') return

    const container = containerRef.value
    if (!container) return

    // Accessibility guarantee: If reduced motion is preferred, reveal all elements immediately
    if (isReducedMotion.value) {
      container.style.opacity = '1'
      const animatedEls = container.querySelectorAll<HTMLElement>('*')
      animatedEls.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    // Official GSAP Vue 3 pattern: Scoped context for automatic lifecycle tracking & cleanup
    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: config.start ?? 'top 85%',
          once: config.once ?? true,
          toggleActions: config.toggleActions ?? 'play none none none',
        },
      })

      setupAnimation({ tl, container, gsap, motion: MOTION_SYSTEM })
    }, container)

    // Recalculate ScrollTrigger start/end coordinates after DOM & fonts settle
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  })

  onUnmounted(() => {
    if (ctx) {
      ctx.revert()
      ctx = null
    }
  })
}
