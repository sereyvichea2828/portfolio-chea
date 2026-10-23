import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

let globalLenis: Lenis | null = null
let tickerListener: ((time: number) => void) | null = null
let activeSubscribers = 0

export interface SmoothScrollController {
  lenis: Ref<Lenis | null>
  scrollTo: (
    target: string | number | HTMLElement,
    options?: {
      offset?: number
      duration?: number
      immediate?: boolean
      force?: boolean
      onComplete?: () => void
    }
  ) => void
  stop: () => void
  start: () => void
}

export function useSmoothScroll(): SmoothScrollController {
  const lenisRef = ref<Lenis | null>(globalLenis)
  const { isReducedMotion } = useReducedMotion()

  const initLenis = (): void => {
    if (typeof window === 'undefined') return

    // If reduced motion is requested, do not run smooth scroll interpolation
    if (isReducedMotion.value) {
      if (globalLenis) {
        globalLenis.destroy()
        globalLenis = null
      }
      return
    }

    if (!globalLenis) {
      globalLenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.0,
        autoRaf: false,
      })

      // Coordinate Lenis scroll updates with GSAP ScrollTrigger
      globalLenis.on('scroll', ScrollTrigger.update)

      tickerListener = (time: number) => {
        globalLenis?.raf(time * 1000)
      }

      gsap.ticker.add(tickerListener)
      gsap.ticker.lagSmoothing(0)
    }

    lenisRef.value = globalLenis
    activeSubscribers++
  }

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: {
      offset?: number
      duration?: number
      immediate?: boolean
      force?: boolean
      onComplete?: () => void
    }
  ): void => {
    const navOffset = options?.offset ?? -84

    if (isReducedMotion.value || !globalLenis) {
      // Native accessible fallback
      if (typeof window === 'undefined') return
      if (typeof target === 'string') {
        const el = document.querySelector(target)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY + navOffset
          window.scrollTo({ top, behavior: options?.immediate ? 'auto' : 'smooth' })
          options?.onComplete?.()
        }
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' })
        options?.onComplete?.()
      } else if (target instanceof HTMLElement) {
        const top = target.getBoundingClientRect().top + window.scrollY + navOffset
        window.scrollTo({ top, behavior: options?.immediate ? 'auto' : 'smooth' })
        options?.onComplete?.()
      }
      return
    }

    // Ensure Lenis instance is active
    globalLenis.start()

    globalLenis.scrollTo(target, {
      offset: navOffset,
      duration: options?.duration ?? 0.9,
      immediate: options?.immediate ?? false,
      force: options?.force ?? true,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      onComplete: options?.onComplete,
    })
  }

  const stop = (): void => {
    globalLenis?.stop()
  }

  const start = (): void => {
    globalLenis?.start()
  }

  onMounted(() => {
    initLenis()
  })

  onUnmounted(() => {
    activeSubscribers--
    if (activeSubscribers <= 0) {
      if (tickerListener) {
        gsap.ticker.remove(tickerListener)
        tickerListener = null
      }
      if (globalLenis) {
        globalLenis.destroy()
        globalLenis = null
      }
      activeSubscribers = 0
    }
  })

  return {
    lenis: lenisRef,
    scrollTo,
    stop,
    start,
  }
}
