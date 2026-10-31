import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'
import router from '@/router'
import type { SmoothScrollController } from '@/composables/useSmoothScroll'

export interface ScrollObserverState {
  isScrolled: Ref<boolean>
  activeSection: Ref<string>
  isNavigating: Ref<boolean>
  scrollToSection: (sectionId: string, updateUrl?: boolean, pushHistory?: boolean) => void
  goToNextRoute: () => void
  goToPrevRoute: () => void
}

export function useScrollObserver(
  sectionIds: readonly string[],
  smoothScroll?: SmoothScrollController
): ScrollObserverState {
  const getInitialTarget = (): string => {
    if (typeof window === 'undefined') return 'home'

    const hash = window.location.hash.replace('#', '').replace('/', '')
    if (hash && sectionIds.includes(hash)) return hash

    const path = window.location.pathname.replace(/^\//, '').split('/')[0] || ''
    if (path && sectionIds.includes(path)) return path

    const metaSection = router.currentRoute.value.meta?.sectionId as string | undefined
    if (metaSection && sectionIds.includes(metaSection)) return metaSection

    return 'home'
  }

  const isScrolled = ref<boolean>(false)
  const activeSection = ref<string>(getInitialTarget())
  const isNavigating = ref<boolean>(false)

  let scrollTicking = false
  let navLockTimeout: ReturnType<typeof setTimeout> | null = null
  let routerCleanup: (() => void) | null = null
  let stopLenisWatch: (() => void) | null = null

  const getScrollY = (): number => {
    if (typeof window === 'undefined') return 0
    if (smoothScroll?.lenis.value?.scroll !== undefined) {
      return smoothScroll.lenis.value.scroll
    }
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
  }

  const checkScrollState = (): void => {
    if (typeof window === 'undefined') {
      scrollTicking = false
      return
    }

    const scrollY = getScrollY()
    // Immediate threshold: switches navbar to full-width edge-to-edge as soon as scrolling starts
    isScrolled.value = scrollY > 15

    // Pause section ID computation only when programmatic scroll animation is active
    if (isNavigating.value) {
      scrollTicking = false
      return
    }

    // Stable activation threshold (40% down the viewport)
    const viewportThreshold = scrollY + window.innerHeight * 0.40
    let candidateId = activeSection.value

    // Hysteresis boundary: If current active section still comfortably spans the viewport threshold
    // with a 60px buffer, keep it active to avoid repeated activation near section borders
    const currentActiveEl = document.getElementById(activeSection.value)
    if (currentActiveEl) {
      const rect = currentActiveEl.getBoundingClientRect()
      const top = rect.top + (window.scrollY || window.pageYOffset)
      const bottom = top + currentActiveEl.offsetHeight
      if (viewportThreshold >= top - 60 && viewportThreshold < bottom - 60) {
        scrollTicking = false
        return
      }
    }

    // Scan sections from bottom to top to identify the centered section
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const id = sectionIds[i]
      if (!id) continue
      const element = document.getElementById(id)
      if (element) {
        const elementTop = element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset)
        if (viewportThreshold >= elementTop - 20) {
          candidateId = id
          break
        }
      }
    }

    if (candidateId !== activeSection.value) {
      activeSection.value = candidateId
      // Decouple section highlighting from route churning:
      // Silently update browser address bar without firing heavy Vue Router navigation loops
      const targetPath = candidateId === 'home' ? '/' : `/${candidateId}`
      if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
        const currentRoute = router.currentRoute.value
        const isModalRoute = Boolean(currentRoute.meta?.isModalRoute || currentRoute.meta?.hideNavbar)
        if (!isModalRoute) {
          window.history.replaceState(null, '', targetPath)
          const matchedRoute = router.getRoutes().find((r) => r.meta?.sectionId === candidateId)
          if (matchedRoute?.meta?.title && typeof matchedRoute.meta.title === 'string') {
            document.title = matchedRoute.meta.title
          }
        }
      }
    }

    scrollTicking = false
  }

  const handleScroll = (): void => {
    if (!scrollTicking) {
      window.requestAnimationFrame(checkScrollState)
      scrollTicking = true
    }
  }

  const scrollToSection = (sectionId: string, updateUrl = true, pushHistory = true): void => {
    if (typeof window === 'undefined') return

    const cleanId = sectionId.replace('#', '').replace('/', '') || 'home'
    const targetElement = document.getElementById(cleanId)

    if (!targetElement) return

    // Immediately blur clicked element to prevent stuck focus outline
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    activeSection.value = cleanId

    const navOffset = 88
    const elementTop = targetElement.getBoundingClientRect().top + (window.scrollY || window.pageYOffset)
    const targetY = Math.max(0, cleanId === 'home' ? 0 : elementTop - navOffset)
    const currentY = window.scrollY || window.pageYOffset

    // If already at target destination, return immediately without lag
    if (Math.abs(targetY - currentY) < 12) {
      if (updateUrl) {
        const targetPath = cleanId === 'home' ? '/' : `/${cleanId}`
        if (window.location.pathname !== targetPath) {
          if (pushHistory) {
            router.push(targetPath).catch(() => {})
          } else {
            window.history.replaceState(null, '', targetPath)
          }
        }
      }
      return
    }

    isNavigating.value = true

    if (updateUrl) {
      const targetPath = cleanId === 'home' ? '/' : `/${cleanId}`
      if (window.location.pathname !== targetPath) {
        if (pushHistory) {
          router.push(targetPath).catch(() => {})
        } else {
          window.history.replaceState(null, '', targetPath)
        }
      }
    }

    // Moderate, balanced 0.9s gliding scroll transition with exponential deceleration
    if (smoothScroll) {
      if (cleanId === 'home') {
        smoothScroll.scrollTo(0, {
          offset: 0,
          duration: 0.9,
        })
      } else {
        smoothScroll.scrollTo(targetElement, {
          offset: -navOffset,
          duration: 0.9,
        })
      }
    } else {
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      })
    }

    if (navLockTimeout) {
      clearTimeout(navLockTimeout)
    }

    // Release lock promptly once scroll animation completes (950ms for 0.9s duration)
    navLockTimeout = setTimeout(() => {
      isNavigating.value = false
      const scrollY = window.scrollY || window.pageYOffset
      isScrolled.value = scrollY > 40
      checkScrollState()
    }, 950)
  }

  const goToNextRoute = (): void => {
    const currentIndex = sectionIds.indexOf(activeSection.value)
    if (currentIndex >= 0 && currentIndex < sectionIds.length - 1) {
      const nextId = sectionIds[currentIndex + 1]
      if (nextId) {
        scrollToSection(nextId)
      }
    }
  }

  const goToPrevRoute = (): void => {
    const currentIndex = sectionIds.indexOf(activeSection.value)
    if (currentIndex > 0) {
      const prevId = sectionIds[currentIndex - 1]
      if (prevId) {
        scrollToSection(prevId)
      }
    }
  }

  // Handle keyboard arrows / PageDown / PageUp
  const handleKeyDown = (e: KeyboardEvent): void => {
    const activeEl = document.activeElement
    const isEditing =
      activeEl instanceof HTMLInputElement ||
      activeEl instanceof HTMLTextAreaElement ||
      activeEl?.hasAttribute('contenteditable')
    if (isEditing) return

    if (e.key === 'PageDown') {
      e.preventDefault()
      goToNextRoute()
    } else if (e.key === 'PageUp') {
      e.preventDefault()
      goToPrevRoute()
    }
  }

  // Listen to browser Back / Forward buttons natively
  const handlePopState = (): void => {
    if (typeof window === 'undefined') return
    const pathTarget = window.location.pathname.replace(/^\//, '').split('/')[0] || ''
    const hashTarget = window.location.hash.replace('#', '').replace('/', '')
    const matched = (sectionIds.includes(hashTarget) ? hashTarget : '') ||
                    (sectionIds.includes(pathTarget) ? pathTarget : '') ||
                    'home'
    if (sectionIds.includes(matched)) {
      scrollToSection(matched, false, false)
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return

    // Prevent browser from restoring stale scroll coordinates before layout completes
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('popstate', handlePopState)

    // Synchronize directly with Lenis smooth-scroll updates
    stopLenisWatch = watch(
      () => smoothScroll?.lenis.value,
      (lenisInstance, oldInstance) => {
        if (oldInstance) {
          oldInstance.off('scroll', handleScroll)
        }
        if (lenisInstance) {
          lenisInstance.on('scroll', handleScroll)
        }
      },
      { immediate: true },
    )

    // Synchronize route changes from programmatic navigation or history traversal
    routerCleanup = router.afterEach((to, from) => {
      if (to.path === from.path) return
      const target = (to.meta?.sectionId as string) || to.path.replace(/^\//, '').split('/')[0] || 'home'
      if (sectionIds.includes(target) && target !== activeSection.value) {
        scrollToSection(target, false, false)
      }
    })

    // Resolve initial target section from URL path, hash, or current route
    const initialTarget = getInitialTarget()

    if (initialTarget !== 'home') {
      activeSection.value = initialTarget
      isNavigating.value = true

      const alignToTarget = (): void => {
        const el = document.getElementById(initialTarget)
        if (!el) return
        const navOffset = 88
        const currentScrollY = window.scrollY || window.pageYOffset
        const targetY = Math.max(0, el.getBoundingClientRect().top + currentScrollY - navOffset)

        window.scrollTo({ top: targetY, behavior: 'instant' })
        if (smoothScroll?.lenis.value) {
          smoothScroll.scrollTo(el, {
            offset: -navOffset,
            immediate: true,
            force: true,
          })
        }
      }

      // 1. Align immediately on mount
      alignToTarget()

      // 2. Calibrate on the initial frame
      requestAnimationFrame(() => {
        alignToTarget()
      })

      // 3. Final calibration once fonts and dynamic mockup images settle layout heights
      setTimeout(() => {
        alignToTarget()
        isNavigating.value = false
        checkScrollState()
      }, 150)
    } else {
      activeSection.value = 'home'
      checkScrollState()
    }
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('popstate', handlePopState)

    if (stopLenisWatch) {
      stopLenisWatch()
      stopLenisWatch = null
    }

    if (smoothScroll?.lenis.value) {
      smoothScroll.lenis.value.off('scroll', handleScroll)
    }

    if (routerCleanup) {
      routerCleanup()
      routerCleanup = null
    }

    if (navLockTimeout) {
      clearTimeout(navLockTimeout)
      navLockTimeout = null
    }
  })

  return {
    isScrolled,
    activeSection,
    isNavigating,
    scrollToSection,
    goToNextRoute,
    goToPrevRoute,
  }
}
