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
} as const;

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
  let triggerInstance: ScrollTrigger | null = null
  let timelineInstance: gsap.core.Timeline | null = null
  let fallbackObserver: IntersectionObserver | null = null
  let safetyTimeoutId: ReturnType<typeof setTimeout> | null = null

  const forceCompleteAndClean = (container: HTMLElement, tl: gsap.core.Timeline): void => {
    // 1. Instantly advance timeline to final state
    if (tl.progress() < 1) {
      tl.progress(1)
    }

    // 2. Remove all temporary inline styles applied by GSAP (transform, opacity, willChange, filter, scale)
    // so elements return to pure native CSS rendering with no lingering blur or opacity reduction
    const allAnimated = container.querySelectorAll<HTMLElement>('*')
    gsap.set(allAnimated, { clearProps: 'transform,opacity,visibility,willChange,filter' })
    container.style.removeProperty('transform')
    container.style.removeProperty('will-change')
    container.style.removeProperty('filter')
    container.style.removeProperty('opacity')
  }

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: config.start ?? 'top 85%',
        once: config.once ?? true,
        toggleActions: config.toggleActions ?? 'play none none none',
      },
      onComplete: () => {
        forceCompleteAndClean(container, tl)
      },
      onInterrupt: () => {
        // Interrupted timeline recovery: immediately snap to 100% completed state
        forceCompleteAndClean(container, tl)
      },
    })

    timelineInstance = tl
    triggerInstance = tl.scrollTrigger ?? null

    try {
      setupAnimation({ tl, container, gsap, motion: MOTION_SYSTEM })

      // Immediate viewport assessment on mount (e.g. direct route entry or page refresh)
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        const rect = container.getBoundingClientRect()
        // If already scrolled past or currently visible in viewport on mount, trigger promptly
        if (rect.bottom < 0) {
          forceCompleteAndClean(container, tl)
        } else if (rect.top < window.innerHeight * 0.90 && rect.bottom > 0) {
          if (tl.progress() === 0) {
            tl.play()
          }
        }
      })
    } catch {
      // Robust Fallback: If animation setup fails, ensure content remains fully visible and sharp
      forceCompleteAndClean(container, tl)
    }

    // Independent Secondary Fallback: Native IntersectionObserver ensures that if Lenis virtual scroll
    // or fast scrolling desynchronizes ScrollTrigger, elements will NEVER stay invisible or at opacity 0
    if ('IntersectionObserver' in window) {
      fallbackObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry?.isIntersecting) {
            if (tl.progress() < 1) {
              tl.play()
            }
          }
        },
        { rootMargin: '100px 0px 50px 0px', threshold: 0.05 }
      )
      fallbackObserver.observe(container)
    }

    // Hard Safety Timer: Guarantees that after 1.8s, no element within an entered container remains transparent
    safetyTimeoutId = setTimeout(() => {
      const rect = container.getBoundingClientRect()
      if (rect.top < window.innerHeight + 150) {
        if (tl.progress() < 1) {
          forceCompleteAndClean(container, tl)
        }
      }
    }, 1800)
  })

  onUnmounted(() => {
    if (safetyTimeoutId) {
      clearTimeout(safetyTimeoutId)
      safetyTimeoutId = null
    }
    if (fallbackObserver) {
      fallbackObserver.disconnect()
      fallbackObserver = null
    }
    if (timelineInstance) {
      timelineInstance.kill()
      timelineInstance = null
    }
    if (triggerInstance) {
      triggerInstance.kill()
      triggerInstance = null
    }
  })
}
