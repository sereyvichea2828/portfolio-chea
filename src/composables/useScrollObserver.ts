import { ref, watch, onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import type { SmoothScrollController } from '@/composables/useSmoothScroll'
import { useModalState } from '@/composables/useModalState'

export interface ScrollObserverState {
  isScrolled: Ref<boolean>
  activeSection: Ref<string>
  isNavigating: Ref<boolean>
  scrollToSection: (sectionId: string, updateUrl?: boolean, pushHistory?: boolean, source?: string) => void
  goToNextRoute: () => void
  goToPrevRoute: () => void
}

function logDiag(action: string, details?: Record<string, unknown>): void {
  if (!import.meta.env.DEV) return
  const now = new Date()
  const time = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`
  console.log(
    `%c[${time}] [ScrollEngine] %c${action}`,
    'color: #6366F1; font-weight: bold;',
    'color: #0F172A; font-weight: 500;',
    details ?? ''
  )
}

export function useScrollObserver(
  sectionIds: readonly string[],
  smoothScroll?: SmoothScrollController,
  routerInstance?: Router
): ScrollObserverState {
  const router = routerInstance || useRouter()
  const { isAnyModalOpen, activeModalIds } = useModalState()

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
  let isPopStateNavigation = false

  const getScrollY = (): number => {
    if (typeof window === 'undefined') return 0
    const nativeY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
    const lenisY = smoothScroll?.lenis.value?.scroll
    // Guard against desynchronized 0 when window is actually scrolled
    if (lenisY !== undefined && !Number.isNaN(lenisY)) {
      return Math.max(nativeY, lenisY)
    }
    return nativeY
  }

  // Release programmatic navigation lock instantly when the user rolls mouse wheel or touches screen
  const onUserManualIntervention = (e?: Event): void => {
    if (isRestoringRoute.value) {
      logDiag('🖐️ User manual scroll intervened during initial restoration. Unfreezing.', {
        eventType: e?.type,
        scrollY: getScrollY(),
      })
      isRestoringRoute.value = false
    }
    if (isNavigating.value) {
      logDiag('🖐️ User manual scroll intervened during navigation lock. Unlocking.', {
        eventType: e?.type,
        activeSection: activeSection.value,
      })
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
      if (isNavigating.value || isRestoringRoute.value) {
        logDiag('⏸️ syncUrlToActiveSection skipped (restoring or navigating)', {
          isNavigating: isNavigating.value,
          isRestoringRoute: isRestoringRoute.value,
          attemptedSection: newSectionId,
        })
        return
      }
      if (typeof document !== 'undefined' && document.body.classList.contains('overflow-hidden')) return

      const targetPath = newSectionId === 'home' ? '/' : `/${newSectionId}`
      const currentRoute = router.currentRoute.value
      const isModalRoute = Boolean(currentRoute.meta?.isModalRoute || currentRoute.meta?.hideNavbar)

      if (!isModalRoute && currentRoute.path !== targetPath) {
        logDiag(`🔄 syncUrlToActiveSection -> replace route to "${targetPath}"`, {
          previousPath: currentRoute.path,
          newSectionId,
          scrollY: getScrollY(),
        })

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
    }, 90)
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
      logDiag(`📍 Active section changed: "${activeSection.value}" -> "${candidateId}"`, {
        scrollY,
        candidateId,
      })
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

  const scrollToSection = (
    sectionId: string,
    updateUrl = true,
    pushHistory = true,
    source = 'unknown'
  ): void => {
    if (typeof window === 'undefined') return

    const cleanId = sectionId.replace('#', '').replace('/', '') || 'home'
    const targetElement = document.getElementById(cleanId)

    if (!targetElement) {
      logDiag(`⚠️ scrollToSection target element not found: #${cleanId}`)
      return
    }

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

    logDiag(`🚀 scrollToSection -> #${cleanId}`, {
      source,
      targetY,
      currentScrollY: getScrollY(),
      updateUrl,
      pushHistory,
    })

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

    const onScrollFinished = (): void => {
      logDiag(`✅ scrollToSection finished -> #${cleanId}`, {
        finalScrollY: getScrollY(),
      })
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
        scrollToSection(nextId, true, true, 'key-pagedown')
      }
    }
  }

  const goToPrevRoute = (): void => {
    const currentIndex = sectionIds.indexOf(activeSection.value)
    if (currentIndex > 0) {
      const prevId = sectionIds[currentIndex - 1]
      if (prevId) {
        scrollToSection(prevId, true, true, 'key-pageup')
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

  const handlePopState = (): void => {
    isPopStateNavigation = true
    logDiag('⬅️➡️ Browser popstate event fired (Back/Forward navigation)')
  }

  onMounted(async () => {
    if (typeof window === 'undefined') return

    logDiag('🎬 useScrollObserver onMounted', {
      initialTarget,
      pathname: window.location.pathname,
      scrollY: window.scrollY,
      activeSection: activeSection.value,
      isRestoringRoute: isRestoringRoute.value,
    })

    // Prevent browser from restoring stale scroll coordinates before layout completes
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', onUserManualIntervention, { passive: true })
    window.addEventListener('touchmove', onUserManualIntervention, { passive: true })
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

    // Synchronize route changes from true browser history traversal (Back/Forward buttons ONLY)
    // CRITICAL: NEVER command Lenis to scroll during internal passive route synchronization!
    routerCleanup = router.afterEach((to, from) => {
      logDiag('🧭 router.afterEach fired', {
        toPath: to.path,
        fromPath: from?.path,
        isPopStateNavigation,
        isPassiveScrollSync: isPassiveScrollSync.value,
        navigatingToTargetId,
      })

      if (to.path === from.path && to.hash === from.hash) return

      // ONLY command smooth scroll if this navigation was genuinely triggered by browser Back/Forward!
      if (!isPopStateNavigation) {
        return
      }
      isPopStateNavigation = false

      const hashTarget = to.hash ? to.hash.replace('#', '').replace('/', '') : ''
      const pathTarget = (to.meta?.sectionId as string) || to.path.replace(/^\//, '').split('/')[0] || ''
      const target = (sectionIds.includes(hashTarget) ? hashTarget : '') ||
                     (sectionIds.includes(pathTarget) ? pathTarget : '') ||
                     'home'

      if (sectionIds.includes(target)) {
        scrollToSection(target, false, false, 'browser-popstate')
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

      logDiag(`🎯 Beginning initial section restoration to #${targetOnMount}`)

      const alignToTarget = (reason = 'align'): boolean => {
        const el = document.getElementById(targetOnMount)
        if (!el) {
          logDiag(`⚠️ alignToTarget: element #${targetOnMount} not found`)
          return false
        }
        const navOffset = 88
        const currentScrollY = window.scrollY || window.pageYOffset
        const targetY = Math.max(0, el.getBoundingClientRect().top + currentScrollY - navOffset)

        logDiag(`📐 alignToTarget [${reason}] -> targetY: ${targetY}, currentY: ${currentScrollY}`)

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
      alignToTarget('initial-mount')

      // Watch for layout expansion (images, fonts, dynamic DOM) during restoration
      if (typeof ResizeObserver !== 'undefined' && document.body) {
        resizeObserver = new ResizeObserver(() => {
          if (isRestoringRoute.value) {
            alignToTarget('resize-observer')
          }
        })
        resizeObserver.observe(document.body)
      }

      const finishRestoration = (trigger = 'settle'): void => {
        if (!isRestoringRoute.value) return
        alignToTarget(`finish-${trigger}`)
        isNavigating.value = false
        isRestoringRoute.value = false
        if (resizeObserver) {
          resizeObserver.disconnect()
          resizeObserver = null
        }
        logDiag(`🎉 Initial restoration complete for #${targetOnMount}. Passive scroll sync is now active.`)
        checkScrollState()
      }

      // Allow 450ms for layout settlement before unfreezing normal scroll detection
      restoreTimeout = setTimeout(() => finishRestoration('timeout-450ms'), 450)

      window.addEventListener('load', () => finishRestoration('window-load'), { once: true })
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
    window.removeEventListener('popstate', handlePopState)

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
      isModalOpen: () => isAnyModalOpen.value,
      modalLocks: () => activeModalIds.value,
      isLenisStopped: () => Boolean(smoothScroll?.lenis.value?.isStopped),
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
