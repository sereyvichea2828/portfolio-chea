import { ref, watch, onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import type { SmoothScrollController } from '@/composables/useSmoothScroll'
import { useModalState } from '@/composables/useModalState'

export interface NavigationTraceEvent {
  id: string
  timestamp: string
  source: string
  action: string
  previousRoute: string
  newRoute?: string
  previousActiveSection: string
  newActiveSection?: string
  currentScrollY: number
  targetY?: number
  reason?: string
  isRestoringRoute: boolean
  isNavigating: boolean
  details?: Record<string, unknown>
}

export interface ScrollObserverState {
  isScrolled: Ref<boolean>
  activeSection: Ref<string>
  isNavigating: Ref<boolean>
  scrollToSection: (sectionId: string, updateUrl?: boolean, pushHistory?: boolean, source?: string) => void
  goToNextRoute: () => void
  goToPrevRoute: () => void
}

let traceEventCounter = 0
const navTraceHistory: NavigationTraceEvent[] = []

function logNavigationTrace(params: {
  source: string
  action: string
  previousRoute: string
  newRoute?: string
  previousActiveSection: string
  newActiveSection?: string
  currentScrollY: number
  targetY?: number
  reason?: string
  isRestoringRoute: boolean
  isNavigating: boolean
  details?: Record<string, unknown>
}): void {
  traceEventCounter++
  const now = new Date()
  const time = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`
  const eventId = `NAV-${String(traceEventCounter).padStart(4, '0')}`

  const eventRecord: NavigationTraceEvent = {
    id: eventId,
    timestamp: time,
    ...params,
  }

  navTraceHistory.push(eventRecord)
  if (navTraceHistory.length > 200) {
    navTraceHistory.shift()
  }

  if (import.meta.env.DEV) {
    console.log(
      `%c[${time}] %c[${eventId}] %c[${params.source}] %c${params.action}`,
      'color: #64748B; font-size: 11px;',
      'color: #6366F1; font-weight: bold; font-size: 11px;',
      'color: #0F172A; font-weight: 600; font-size: 11px;',
      'color: #2563EB; font-weight: bold; font-size: 11px;',
      {
        prevRoute: params.previousRoute,
        newRoute: params.newRoute ?? params.previousRoute,
        prevSection: params.previousActiveSection,
        newSection: params.newActiveSection ?? params.previousActiveSection,
        scrollY: params.currentScrollY,
        targetY: params.targetY,
        reason: params.reason ?? '',
        isRestoring: params.isRestoringRoute,
        isNavigating: params.isNavigating,
        details: params.details,
      }
    )
  }
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
      logNavigationTrace({
        source: 'useScrollObserver:manualIntervention',
        action: 'RESTORE_UNFROZEN_BY_USER',
        previousRoute: router.currentRoute.value.path,
        previousActiveSection: activeSection.value,
        currentScrollY: getScrollY(),
        reason: `User manual scroll intervention (${e?.type || 'input'}) during restoration`,
        isRestoringRoute: false,
        isNavigating: isNavigating.value,
      })
      isRestoringRoute.value = false
    }
    if (isNavigating.value) {
      logNavigationTrace({
        source: 'useScrollObserver:manualIntervention',
        action: 'NAV_LOCK_RELEASED_BY_USER',
        previousRoute: router.currentRoute.value.path,
        previousActiveSection: activeSection.value,
        currentScrollY: getScrollY(),
        reason: `User manual scroll intervention (${e?.type || 'input'}) during navigation lock`,
        isRestoringRoute: isRestoringRoute.value,
        isNavigating: false,
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
        return
      }
      if (typeof document !== 'undefined' && document.body.classList.contains('overflow-hidden')) return

      const currentScrollY = getScrollY()

      // CRITICAL SAFETY GUARD:
      // A missing or miscalculated section measurement must NEVER sync URL to '/' when
      // the user is scrolled down into the page (> 150px)!
      if (newSectionId === 'home' && currentScrollY > 150) {
        logNavigationTrace({
          source: 'useScrollObserver:syncUrl',
          action: 'BLOCKED_INVALID_HOME_SYNC',
          previousRoute: router.currentRoute.value.path,
          previousActiveSection: activeSection.value,
          newActiveSection: newSectionId,
          currentScrollY,
          reason: 'Attempted to sync URL to "/" while scrollY is > 150. Operation aborted.',
          isRestoringRoute: isRestoringRoute.value,
          isNavigating: isNavigating.value,
        })
        return
      }

      const targetPath = newSectionId === 'home' ? '/' : `/${newSectionId}`
      const currentRoute = router.currentRoute.value
      const isModalRoute = Boolean(currentRoute.meta?.isModalRoute || currentRoute.meta?.hideNavbar)

      if (!isModalRoute && currentRoute.path !== targetPath) {
        logNavigationTrace({
          source: 'useScrollObserver:syncUrl',
          action: 'PASSIVE_URL_REPLACE',
          previousRoute: currentRoute.path,
          newRoute: targetPath,
          previousActiveSection: activeSection.value,
          newActiveSection: newSectionId,
          currentScrollY,
          reason: `Active section changed to "${newSectionId}". Updating URL via router.replace.`,
          isRestoringRoute: isRestoringRoute.value,
          isNavigating: isNavigating.value,
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

    // 1. Extreme boundary: Top of page (user is actually at the very top)
    if (scrollY <= 50) {
      candidateId = 'home'
    }
    // 2. Extreme boundary: Bottom of page (user is at the very bottom)
    else if (scrollY + innerHeight >= scrollHeight - 50) {
      candidateId = sectionIds[sectionIds.length - 1] || 'contact'
    }
    // 3. In-between sections: Precise viewport intersection check
    else {
      const navOffset = 88
      const viewportThreshold = innerHeight * 0.35 + 20
      let foundMatchingSection = false

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i]
        if (!id) continue
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          // Section must have entered viewport threshold AND its bottom must still be below the nav offset.
          // This prevents sections scrolled completely past (such as #home with negative rect.bottom) from matching!
          if (rect.top <= viewportThreshold && rect.bottom > navOffset) {
            candidateId = id
            foundMatchingSection = true
            break
          }
        }
      }

      // CRITICAL RULE: If no section cleanly meets the boundary threshold (e.g. during rapid scroll or layout reflow),
      // NEVER default or fall back to 'home'! Retain the existing activeSection.
      if (!foundMatchingSection) {
        candidateId = activeSection.value
      }
    }

    if (candidateId && candidateId !== activeSection.value) {
      logNavigationTrace({
        source: 'useScrollObserver:checkScrollState',
        action: 'SECTION_CHANGED',
        previousRoute: router.currentRoute.value.path,
        previousActiveSection: activeSection.value,
        newActiveSection: candidateId,
        currentScrollY: scrollY,
        reason: `Viewport intersection moved active section from "${activeSection.value}" to "${candidateId}"`,
        isRestoringRoute: isRestoringRoute.value,
        isNavigating: isNavigating.value,
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
    if (navigatingToTargetId === cleanId) return
    const targetElement = document.getElementById(cleanId)

    if (!targetElement) {
      logNavigationTrace({
        source: `useScrollObserver:scrollToSection:${source}`,
        action: 'TARGET_NOT_FOUND',
        previousRoute: router.currentRoute.value.path,
        previousActiveSection: activeSection.value,
        newActiveSection: cleanId,
        currentScrollY: getScrollY(),
        reason: `scrollToSection target element not found: #${cleanId}`,
        isRestoringRoute: isRestoringRoute.value,
        isNavigating: isNavigating.value,
      })
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

    logNavigationTrace({
      source: `useScrollObserver:scrollToSection:${source}`,
      action: 'SCROLL_INITIATED',
      previousRoute: router.currentRoute.value.path,
      previousActiveSection: activeSection.value,
      newActiveSection: cleanId,
      currentScrollY: getScrollY(),
      targetY,
      reason: `Programmatic scroll initiated to #${cleanId} from ${source}`,
      isRestoringRoute: isRestoringRoute.value,
      isNavigating: true,
      details: { updateUrl, pushHistory },
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
      logNavigationTrace({
        source: `useScrollObserver:scrollToSection:${source}`,
        action: 'SCROLL_COMPLETED',
        previousRoute: router.currentRoute.value.path,
        previousActiveSection: activeSection.value,
        newActiveSection: cleanId,
        currentScrollY: getScrollY(),
        targetY,
        reason: `Programmatic scroll to #${cleanId} finished`,
        isRestoringRoute: isRestoringRoute.value,
        isNavigating: false,
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
    if (isRestoringRoute.value) {
      logNavigationTrace({
        source: 'useScrollObserver:popstate',
        action: 'IGNORED_POPSTATE_DURING_RESTORATION',
        previousRoute: router.currentRoute.value.path,
        previousActiveSection: activeSection.value,
        currentScrollY: getScrollY(),
        reason: 'Browser popstate ignored while initial route restoration is active',
        isRestoringRoute: true,
        isNavigating: isNavigating.value,
      })
      return
    }
    isPopStateNavigation = true
    logNavigationTrace({
      source: 'useScrollObserver:popstate',
      action: 'POPSTATE_TRIGGERED',
      previousRoute: router.currentRoute.value.path,
      previousActiveSection: activeSection.value,
      currentScrollY: getScrollY(),
      reason: 'Browser Back/Forward navigation event fired',
      isRestoringRoute: false,
      isNavigating: isNavigating.value,
    })
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

      logNavigationTrace({
        source: 'useScrollObserver:onMounted',
        action: 'BEGIN_INITIAL_RESTORATION',
        previousRoute: router.currentRoute.value.path,
        previousActiveSection: 'none',
        newActiveSection: targetOnMount,
        currentScrollY: getScrollY(),
        reason: `Restoring page to direct section route #${targetOnMount}`,
        isRestoringRoute: true,
        isNavigating: true,
      })

      const alignToTarget = (reason = 'align'): boolean => {
        const el = document.getElementById(targetOnMount)
        if (!el) {
          logNavigationTrace({
            source: 'useScrollObserver:alignToTarget',
            action: 'ELEMENT_NOT_YET_MOUNTED',
            previousRoute: router.currentRoute.value.path,
            previousActiveSection: activeSection.value,
            currentScrollY: getScrollY(),
            reason: `Target #${targetOnMount} not found during [${reason}]. Retaining section state.`,
            isRestoringRoute: isRestoringRoute.value,
            isNavigating: isNavigating.value,
          })
          return false
        }
        const navOffset = 88
        const currentScrollY = window.scrollY || window.pageYOffset
        const targetY = Math.max(0, el.getBoundingClientRect().top + currentScrollY - navOffset)

        logNavigationTrace({
          source: 'useScrollObserver:alignToTarget',
          action: `ALIGN_${reason.toUpperCase()}`,
          previousRoute: router.currentRoute.value.path,
          previousActiveSection: activeSection.value,
          currentScrollY,
          targetY,
          reason: `Aligning scroll to #${targetOnMount} at targetY: ${targetY}`,
          isRestoringRoute: isRestoringRoute.value,
          isNavigating: isNavigating.value,
        })

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
        logNavigationTrace({
          source: 'useScrollObserver:finishRestoration',
          action: 'RESTORATION_COMPLETE',
          previousRoute: router.currentRoute.value.path,
          previousActiveSection: activeSection.value,
          currentScrollY: getScrollY(),
          reason: `Initial restoration completed via trigger [${trigger}]. Passive scroll sync is now active.`,
          isRestoringRoute: false,
          isNavigating: false,
        })
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

  // Development Diagnostic Support (window.__PORTFOLIO_DIAGNOSTICS__ & window.__PORTFOLIO_NAV_TRACE__)
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    (window as unknown as { __PORTFOLIO_NAV_TRACE__: unknown }).__PORTFOLIO_NAV_TRACE__ = navTraceHistory
    ;(window as unknown as { __PORTFOLIO_DIAGNOSTICS__: unknown }).__PORTFOLIO_DIAGNOSTICS__ = {
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
      getTraceLog: () => navTraceHistory,
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
