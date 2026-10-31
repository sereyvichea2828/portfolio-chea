import { ref, watch, onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
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
  smoothScroll?: SmoothScrollController,
  routerInstance?: Router
): ScrollObserverState {
  const router = routerInstance || useRouter()

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

  const initialTarget = getInitialTarget()
  const isScrolled = ref<boolean>(false)
  const activeSection = ref<string>(initialTarget)
  const isNavigating = ref<boolean>(false)
  // Protected from frame 0: if loading directly on a section route, freeze URL overriding until restoration settles
  const isRestoringRoute = ref<boolean>(initialTarget !== 'home')
  const isPassiveScrollSync = ref<boolean>(false)

  let scrollTicking = false
  let urlSyncTimeout: ReturnType<typeof setTimeout> | null = null
  let navLockTimeout: ReturnType<typeof setTimeout> | null = null
  let restoreTimeout: ReturnType<typeof setTimeout> | null = null
  let routerCleanup: (() => void) | null = null
  let stopLenisWatch: (() => void) | null = null
  let navigatingToTargetId: string | null = null
  let resizeObserver: ResizeObserver | null = null

  const getScrollY = (): number => {
    if (typeof window === 'undefined') return 0
    if (smoothScroll?.lenis.value?.scroll !== undefined) {
      return smoothScroll.lenis.value.scroll
    }
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
  }

  // Release programmatic navigation lock instantly when the user rolls mouse wheel or touches screen
  const onUserManualIntervention = (): void => {
    if (isRestoringRoute.value) {
      isRestoringRoute.value = false
    }
    if (isNavigating.value) {
      isNavigating.value = false
      navigatingToTargetId = null
      if (navLockTimeout) {
        clearTimeout(navLockTimeout)
        navLockTimeout = null
      }
    }
  }

  const syncUrlToActiveSection = (newSectionId: string): void => {
    if (urlSyncTimeout) {
      clearTimeout(urlSyncTimeout)
      urlSyncTimeout = null
    }

    urlSyncTimeout = setTimeout(() => {
      if (isNavigating.value || isRestoringRoute.value) return
      if (typeof document !== 'undefined' && document.body.classList.contains('overflow-hidden')) return

      const targetPath = newSectionId === 'home' ? '/' : `/${newSectionId}`
      const currentRoute = router.currentRoute.value
      const isModalRoute = Boolean(currentRoute.meta?.isModalRoute || currentRoute.meta?.hideNavbar)

      if (!isModalRoute && currentRoute.path !== targetPath) {
        isPassiveScrollSync.value = true
        router
          .replace({
            path: targetPath,
            query: currentRoute.query,
            hash: currentRoute.hash,
            state: { ...window.history.state, scrollSync: true },
          })
          .catch(() => {})
          .finally(() => {
            if (typeof window !== 'undefined') {
              window.requestAnimationFrame(() => {
                isPassiveScrollSync.value = false
              })
            } else {
              isPassiveScrollSync.value = false
            }
          })
      }
    }, 80)
  }

  const checkScrollState = (): void => {
    if (typeof window === 'undefined') {
      scrollTicking = false
      return
    }

    const scrollY = getScrollY()
    isScrolled.value = scrollY > 15

    // Never override active section or URL during initial restoration or modal display
    if (isRestoringRoute.value) {
      scrollTicking = false
      return
    }

    if (document.body.classList.contains('overflow-hidden')) {
      scrollTicking = false
      return
    }

    // If programmatic smooth scroll is active, allow position sync but do not trigger passive URL replace
    if (isNavigating.value) {
      scrollTicking = false
      return
    }

    const innerHeight = window.innerHeight
    const scrollHeight = document.documentElement.scrollHeight
    let candidateId = activeSection.value

    // 1. Extreme boundary: Top of page
    if (scrollY <= 50) {
      candidateId = 'home'
    }
    // 2. Extreme boundary: Bottom of page
    else if (scrollY + innerHeight >= scrollHeight - 50) {
      candidateId = sectionIds[sectionIds.length - 1] || 'contact'
    }
    // 3. In-between sections: Stable 35% viewport threshold
    else {
      const viewportThreshold = innerHeight * 0.35 + 20
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i]
        if (!id) continue
        const element = document.getElementById(id)
        if (element) {
          const rectTop = element.getBoundingClientRect().top
          if (rectTop <= viewportThreshold) {
            candidateId = id
            break
          }
        }
      }
    }

    if (candidateId && candidateId !== activeSection.value) {
      activeSection.value = candidateId
      syncUrlToActiveSection(candidateId)
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
    navigatingToTargetId = cleanId
    isNavigating.value = true

    const navOffset = 88
    const elementTop = targetElement.getBoundingClientRect().top + (window.scrollY || window.pageYOffset)
    const targetY = Math.max(0, cleanId === 'home' ? 0 : elementTop - navOffset)

    if (updateUrl) {
      const targetPath = cleanId === 'home' ? '/' : `/${cleanId}`
      if (router.currentRoute.value.path !== targetPath) {
        if (pushHistory) {
          router.push({ path: targetPath, query: router.currentRoute.value.query }).catch(() => {})
        } else {
          isPassiveScrollSync.value = true
          router
            .replace({ path: targetPath, query: router.currentRoute.value.query, state: { ...window.history.state, scrollSync: true } })
            .catch(() => {})
            .finally(() => {
              if (typeof window !== 'undefined') {
                window.requestAnimationFrame(() => {
                  isPassiveScrollSync.value = false
                })
              } else {
                isPassiveScrollSync.value = false
              }
            })
        }
      }
    }

    const onScrollFinished = (): void => {
      isNavigating.value = false
      navigatingToTargetId = null
      if (navLockTimeout) {
        clearTimeout(navLockTimeout)
        navLockTimeout = null
      }
      const scrollY = window.scrollY || window.pageYOffset
      isScrolled.value = scrollY > 40
      checkScrollState()
    }

    // Perform smooth gliding scroll with explicit onComplete release
    if (smoothScroll) {
      smoothScroll.scrollTo(targetY, {
        offset: 0,
        duration: 0.85,
        onComplete: onScrollFinished,
      })
    } else {
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      })
    }

    if (navLockTimeout) {
      clearTimeout(navLockTimeout)
    }

    // Safety fallback release if onComplete is not triggered (e.g. reduced motion or interrupted)
    navLockTimeout = setTimeout(onScrollFinished, 950)
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

  onMounted(async () => {
    if (typeof window === 'undefined') return

    // Prevent browser from restoring stale scroll coordinates before layout completes
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', onUserManualIntervention, { passive: true })
    window.addEventListener('touchmove', onUserManualIntervention, { passive: true })

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

    // Synchronize route changes from programmatic navigation or history traversal (Back/Forward)
    routerCleanup = router.afterEach((to, from) => {
      if (to.path === from.path && to.hash === from.hash) return

      // Skip scroll if route update was passively triggered by user scrolling
      if (isPassiveScrollSync.value || (window.history.state as { scrollSync?: boolean })?.scrollSync) {
        return
      }

      const hashTarget = to.hash ? to.hash.replace('#', '').replace('/', '') : ''
      const pathTarget = (to.meta?.sectionId as string) || to.path.replace(/^\//, '').split('/')[0] || ''
      const target = (sectionIds.includes(hashTarget) ? hashTarget : '') ||
                     (sectionIds.includes(pathTarget) ? pathTarget : '') ||
                     'home'

      // Skip re-triggering if scrollToSection is already actively navigating to this exact target
      if (navigatingToTargetId === target) {
        return
      }

      if (sectionIds.includes(target)) {
        scrollToSection(target, false, false)
      }
    })

    // Wait for router readiness to ensure initial route resolution is 100% complete
    await router.isReady()
    await nextTick()

    // Resolve initial target section from URL path, hash, or current route
    const targetOnMount = getInitialTarget()

    if (targetOnMount !== 'home') {
      activeSection.value = targetOnMount
      isNavigating.value = true
      isRestoringRoute.value = true

      const alignToTarget = (): boolean => {
        const el = document.getElementById(targetOnMount)
        if (!el) return false
        const navOffset = 88
        const currentScrollY = window.scrollY || window.pageYOffset
        const targetY = Math.max(0, el.getBoundingClientRect().top + currentScrollY - navOffset)

        window.scrollTo(0, targetY)
        if (smoothScroll?.lenis.value) {
          smoothScroll.lenis.value.scrollTo(targetY, {
            offset: 0,
            immediate: true,
            force: true,
          })
        }
        return true
      }

      // Initial alignment attempt
      alignToTarget()

      // Watch for layout expansion (images, fonts, dynamic DOM) during restoration
      if (typeof ResizeObserver !== 'undefined' && document.body) {
        resizeObserver = new ResizeObserver(() => {
          if (isRestoringRoute.value) {
            alignToTarget()
          }
        })
        resizeObserver.observe(document.body)
      }

      const finishRestoration = (): void => {
        if (!isRestoringRoute.value) return
        alignToTarget()
        isNavigating.value = false
        isRestoringRoute.value = false
        if (resizeObserver) {
          resizeObserver.disconnect()
          resizeObserver = null
        }
        checkScrollState()
      }

      // Allow 450ms for layout settlement before unfreezing normal scroll detection
      restoreTimeout = setTimeout(finishRestoration, 450)

      window.addEventListener('load', finishRestoration, { once: true })
    } else {
      activeSection.value = 'home'
      isRestoringRoute.value = false
      checkScrollState()
    }
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('wheel', onUserManualIntervention)
    window.removeEventListener('touchmove', onUserManualIntervention)

    if (urlSyncTimeout) {
      clearTimeout(urlSyncTimeout)
      urlSyncTimeout = null
    }

    if (restoreTimeout) {
      clearTimeout(restoreTimeout)
      restoreTimeout = null
    }

    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

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

  // Development Diagnostic Support (window.__PORTFOLIO_DIAGNOSTICS__)
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    (window as unknown as { __PORTFOLIO_DIAGNOSTICS__: unknown }).__PORTFOLIO_DIAGNOSTICS__ = {
      getRoute: () => router.currentRoute.value.path,
      getSection: () => router.currentRoute.value.meta?.sectionId,
      getActiveSection: () => activeSection.value,
      isNavigating: () => isNavigating.value,
      isRestoringRoute: () => isRestoringRoute.value,
      isPassiveScrollSync: () => isPassiveScrollSync.value,
      getScrollY: () => getScrollY(),
    }
  }

  return {
    isScrolled,
    activeSection,
    isNavigating,
    scrollToSection,
    goToNextRoute,
    goToPrevRoute,
  }
}
