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
  const isRestoringRoute = ref<boolean>(false)
  const isPassiveScrollSync = ref<boolean>(false)

  let scrollTicking = false
  let urlSyncTimeout: ReturnType<typeof setTimeout> | null = null
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
    }, 100)
  }

  const checkScrollState = (): void => {
    if (typeof window === 'undefined') {
      scrollTicking = false
      return
    }

    const scrollY = getScrollY()
    isScrolled.value = scrollY > 15

    // Pause section ID computation during programmatic scroll or route restoration
    if (isNavigating.value || isRestoringRoute.value) {
      scrollTicking = false
      return
    }

    // Pause section ID computation if an overlay modal is open
    if (document.body.classList.contains('overflow-hidden')) {
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
      const viewportThreshold = scrollY + innerHeight * 0.35
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i]
        if (!id) continue
        const element = document.getElementById(id)
        if (element) {
          const top = element.getBoundingClientRect().top + scrollY
          if (viewportThreshold >= top - 20) {
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

    const navOffset = 88
    const elementTop = targetElement.getBoundingClientRect().top + (window.scrollY || window.pageYOffset)
    const targetY = Math.max(0, cleanId === 'home' ? 0 : elementTop - navOffset)
    const currentY = window.scrollY || window.pageYOffset

    // If already at target destination, return immediately without lag
    if (Math.abs(targetY - currentY) < 12) {
      if (updateUrl) {
        const targetPath = cleanId === 'home' ? '/' : `/${cleanId}`
        if (router.currentRoute.value.path !== targetPath) {
          if (pushHistory) {
            router.push({ path: targetPath, query: router.currentRoute.value.query }).catch(() => {})
          } else {
            isPassiveScrollSync.value = true
            router
              .replace({ path: targetPath, query: router.currentRoute.value.query })
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
      return
    }

    isNavigating.value = true

    if (updateUrl) {
      const targetPath = cleanId === 'home' ? '/' : `/${cleanId}`
      if (router.currentRoute.value.path !== targetPath) {
        if (pushHistory) {
          router.push({ path: targetPath, query: router.currentRoute.value.query }).catch(() => {})
        } else {
          isPassiveScrollSync.value = true
          router
            .replace({ path: targetPath, query: router.currentRoute.value.query })
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

    // Moderate, balanced 0.9s gliding scroll transition with exponential deceleration
    if (smoothScroll) {
      if (cleanId === 'home') {
        smoothScroll.scrollTo(0, {
          offset: 0,
          duration: 0.9,
        })
      } else {
        smoothScroll.scrollTo(targetY, {
          offset: 0,
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

  onMounted(async () => {
    if (typeof window === 'undefined') return

    // Prevent browser from restoring stale scroll coordinates before layout completes
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

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

      // If route change was triggered passively by user scrolling, do not command Lenis to scroll!
      if (isPassiveScrollSync.value) {
        return
      }

      const hashTarget = to.hash ? to.hash.replace('#', '').replace('/', '') : ''
      const pathTarget = (to.meta?.sectionId as string) || to.path.replace(/^\//, '').split('/')[0] || ''
      const target = (sectionIds.includes(hashTarget) ? hashTarget : '') ||
                     (sectionIds.includes(pathTarget) ? pathTarget : '') ||
                     'home'

      if (sectionIds.includes(target)) {
        scrollToSection(target, false, false)
      }
    })

    // Wait for router readiness to ensure initial route resolution is 100% complete
    await router.isReady()

    // Resolve initial target section from URL path, hash, or current route
    const initialTarget = getInitialTarget()

    if (initialTarget !== 'home') {
      activeSection.value = initialTarget
      isNavigating.value = true
      isRestoringRoute.value = true

      const alignToTarget = (): boolean => {
        const el = document.getElementById(initialTarget)
        if (!el) return false
        const navOffset = 88
        const currentScrollY = window.scrollY || window.pageYOffset
        const targetY = Math.max(0, el.getBoundingClientRect().top + currentScrollY - navOffset)

        window.scrollTo({ top: targetY, behavior: 'instant' })
        if (smoothScroll?.lenis.value) {
          smoothScroll.scrollTo(targetY, {
            offset: 0,
            immediate: true,
            force: true,
          })
        }
        return true
      }

      // Initial alignment attempt
      alignToTarget()

      // Multi-frame calibration to account for fonts, layout, and images
      let attempts = 0
      const maxAttempts = 15
      const pollTarget = (): void => {
        attempts++
        alignToTarget()
        if (attempts >= maxAttempts) {
          isNavigating.value = false
          isRestoringRoute.value = false
          checkScrollState()
        } else {
          setTimeout(pollTarget, 40)
        }
      }

      requestAnimationFrame(() => {
        pollTarget()
      })

      window.addEventListener(
        'load',
        () => {
          alignToTarget()
          isNavigating.value = false
          isRestoringRoute.value = false
          checkScrollState()
        },
        { once: true },
      )
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

    if (urlSyncTimeout) {
      clearTimeout(urlSyncTimeout)
      urlSyncTimeout = null
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

  return {
    isScrolled,
    activeSection,
    isNavigating,
    scrollToSection,
    goToNextRoute,
    goToPrevRoute,
  }
}

// Development Diagnostic Support (window.__PORTFOLIO_DEBUG__)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as unknown as { __PORTFOLIO_DEBUG__: unknown }).__PORTFOLIO_DEBUG__ = {
    getRoute: () => router.currentRoute.value.path,
    getSection: () => router.currentRoute.value.meta?.sectionId,
  }
}
