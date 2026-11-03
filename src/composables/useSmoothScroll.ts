import { shallowRef, onMounted, onUnmounted, type ShallowRef } from 'vue';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

let globalLenis: Lenis | null = null;
let tickerListener: ((time: number) => void) | null = null;
let activeSubscribers = 0;

export function getGlobalLenis(): Lenis | null {
  return globalLenis;
}

export function startGlobalLenis(): void {
  if (globalLenis) {
    globalLenis.start();
  }
}

export function stopGlobalLenis(): void {
  if (globalLenis) {
    globalLenis.stop();
  }
}

export interface SmoothScrollController {
  lenis: ShallowRef<Lenis | null>;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
      force?: boolean;
      onComplete?: () => void;
    },
  ) => void;
  stop: () => void;
  start: () => void;
}

export function useSmoothScroll(): SmoothScrollController {
  const lenisRef = shallowRef<Lenis | null>(globalLenis);
  const { isReducedMotion } = useReducedMotion();

  // Track whether this composable instance subscribed to the global Lenis.
  let hasSubscribed = false;

  /**
   * Safely destroy the shared Lenis instance and its GSAP ticker.
   */
  const destroyGlobalLenis = (): void => {
    const hadResources = Boolean(globalLenis || tickerListener);

    if (tickerListener) {
      gsap.ticker.remove(tickerListener);
      tickerListener = null;
    }

    if (globalLenis) {
      globalLenis.destroy();
      globalLenis = null;
    }

    if (hadResources) {
      gsap.ticker.lagSmoothing(500, 33);
    }
  };

  const initLenis = (): void => {
    if (typeof window === 'undefined') return;

    // Respect reduced-motion preferences.
    if (isReducedMotion.value) {
      destroyGlobalLenis();
      lenisRef.value = null;
      return;
    }

    if (!globalLenis) {
      globalLenis = new Lenis({
        // Preserve existing scrolling configuration.
        lerp: 0.12,
        smoothWheel: true,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        wheelMultiplier: 0.9,
        touchMultiplier: 1.1,
        autoRaf: false,
      });

      // Synchronize Lenis with GSAP ScrollTrigger.
      globalLenis.on('scroll', ScrollTrigger.update);

      // Use the GSAP ticker as the Lenis animation frame loop.
      tickerListener = (time: number): void => {
        globalLenis?.raf(time * 1000);
      };

      gsap.ticker.add(tickerListener);

      // Prevent GSAP lag smoothing from interfering with Lenis timing.
      gsap.ticker.lagSmoothing(0);

      // Respect existing modal scroll locks.
      if (typeof document !== 'undefined' && document.body.classList.contains('overflow-hidden')) {
        globalLenis.stop();
      }
    }

    lenisRef.value = globalLenis;

    // Register this composable instance only once.
    if (!hasSubscribed) {
      activeSubscribers++;
      hasSubscribed = true;
    }
  };

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
      force?: boolean;
      onComplete?: () => void;
    },
  ): void => {
    const navOffset = options?.offset ?? (typeof target === 'number' ? 0 : -84);

    // Native scrolling fallback for reduced-motion or unavailable Lenis.
    if (isReducedMotion.value || !globalLenis) {
      if (typeof window === 'undefined') return;

      const behavior: ScrollBehavior =
        isReducedMotion.value || options?.immediate ? 'auto' : 'smooth';

      if (typeof target === 'string') {
        const el = document.querySelector<HTMLElement>(target);

        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY + navOffset;

          window.scrollTo({ top, behavior });
          options?.onComplete?.();
        }

        return;
      }

      if (typeof target === 'number') {
        window.scrollTo({
          top: target,
          behavior,
        });

        options?.onComplete?.();
        return;
      }

      if (target instanceof HTMLElement) {
        const top = target.getBoundingClientRect().top + window.scrollY + navOffset;

        window.scrollTo({ top, behavior });
        options?.onComplete?.();
      }

      return;
    }

    // Never resume Lenis while a modal or overlay locks scrolling.
    if (typeof document !== 'undefined' && !document.body.classList.contains('overflow-hidden')) {
      globalLenis.start();
    }

    globalLenis.scrollTo(target, {
      offset: navOffset,
      duration: options?.duration ?? 1.1,
      immediate: options?.immediate ?? false,
      force: options?.force ?? true,
      easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      onComplete: options?.onComplete,
    });
  };

  const stop = (): void => {
    stopGlobalLenis();
  };

  const start = (): void => {
    // Never restart while an overlay is locking the body.
    if (typeof document !== 'undefined' && !document.body.classList.contains('overflow-hidden')) {
      startGlobalLenis();
    }
  };

  onMounted(() => {
    initLenis();
  });

  onUnmounted(() => {
    // Do not decrement subscribers if this instance never subscribed.
    if (!hasSubscribed) return;

    hasSubscribed = false;
    activeSubscribers = Math.max(0, activeSubscribers - 1);

    // Destroy shared resources only after the last subscriber unmounts.
    if (activeSubscribers === 0) {
      destroyGlobalLenis();
      lenisRef.value = null;
    }
  });

  return {
    lenis: lenisRef,
    scrollTo,
    stop,
    start,
  };
}
