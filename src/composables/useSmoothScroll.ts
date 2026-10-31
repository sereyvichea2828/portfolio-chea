import { shallowRef, onMounted, onUnmounted, type ShallowRef } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

let globalLenis: Lenis | null = null
let tickerListener: ((time: number) => void) | null = null
let activeSubscribers = 0

export function getGlobalLenis(): Lenis | null {
  return globalLenis
}

export function startGlobalLenis(): void {
  if (globalLenis) {
    globalLenis.start()
  }
}

export function stopGlobalLenis(): void {
  if (globalLenis) {
    globalLenis.stop()
  }
}

export interface SmoothScrollController {
  lenis: ShallowRef<Lenis | null>
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
  const lenisRef = shallowRef<Lenis | null>(globalLenis)
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

      // If document is already locked when Lenis mounts (e.g. direct load on /resume), pause immediately
      if (typeof document !== 'undefined' && document.body.classList.contains('overflow-hidden')) {
        globalLenis.stop()
      }
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

    // Only resume Lenis if scrolling is not currently locked by an active overlay
    if (typeof document !== 'undefined' && !document.body.classList.contains('overflow-hidden')) {
      globalLenis.start()
    }

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
    stopGlobalLenis()
  }

  const start = (): void => {
    // Only restart if no overlays are currently locking the body
    if (typeof document !== 'undefined' && !document.body.classList.contains('overflow-hidden')) {
      startGlobalLenis()
    }
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
