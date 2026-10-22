import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import router from '@/router'
import type { SmoothScrollController } from '@/composables/useSmoothScroll'

export interface ScrollObserverState {
  isScrolled: Ref<boolean>
  activeSection: Ref<string>
  isNavigating: Ref<boolean>
  scrollToSection: (sectionId: string, updateUrl?: boolean) => void
  goToNextRoute: () => void
  goToPrevRoute: () => void
}

export function useScrollObserver(
  sectionIds: readonly string[],
  smoothScroll?: SmoothScrollController
): ScrollObserverState {
  const isScrolled = ref<boolean>(false)
  const activeSection = ref<string>(sectionIds[0] || 'home')
  const isNavigating = ref<boolean>(false)

  let scrollTicking = false
  let navLockTimeout: ReturnType<typeof setTimeout> | null = null

  const checkScrollState = (): void => {
    if (typeof window === 'undefined' || isNavigating.value) return

    const scrollY = window.scrollY || window.pageYOffset
    isScrolled.value = scrollY > 40

    // Stable activation threshold (40% down the viewport)
    const viewportThreshold = scrollY + window.innerHeight * 0.40
    let candidateId = activeSection.value

    // Hysteresis boundary: If current active section still comfortably spans the viewport threshold
    // with a 60px buffer, keep it active to avoid repeated activation near section borders
    const currentActiveEl = document.getElementById(activeSection.value)
    if (currentActiveEl) {
      const rect = currentActiveEl.getBoundingClientRect()
      const top = rect.top + window.pageYOffset
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
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset
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
        }
      }
    }

    scrollTicking = false
  }

  const handleScroll = (): void => {
    if (!scrollTicking && !isNavigating.value) {
      window.requestAnimationFrame(checkScrollState)
      scrollTicking = true
    }
  }

  const scrollToSection = (sectionId: string, updateUrl = true): void => {
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
          window.history.replaceState(null, '', targetPath)
        }
      }
      return
    }

    isNavigating.value = true

    if (updateUrl) {
      const targetPath = cleanId === 'home' ? '/' : `/${cleanId}`
      if (window.location.pathname !== targetPath) {
        window.history.replaceState(null, '', targetPath)
      }
    }

    // Ultra-smooth 1.45s continuous gliding scroll transition with refined cubic easing
    if (smoothScroll) {
      if (cleanId === 'home') {
        smoothScroll.scrollTo(0, {
          offset: 0,
          duration: 1.45,
        })
      } else {
        smoothScroll.scrollTo(targetElement, {
          offset: -navOffset,
          duration: 1.45,
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

    // Release lock once scroll animation completes (1500ms for 1.45s duration)
    navLockTimeout = setTimeout(() => {
      isNavigating.value = false
      const scrollY = window.scrollY || window.pageYOffset
      isScrolled.value = scrollY > 40
      checkScrollState()
    }, 1500)
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
    const hashTarget = window.location.hash.replace('#', '').replace('/', '')
    const pathTarget = window.location.pathname.replace('/', '')
    const matched = (sectionIds.includes(hashTarget) ? hashTarget : '') ||
                    (sectionIds.includes(pathTarget) ? pathTarget : '') ||
                    'home'
    if (sectionIds.includes(matched)) {
      scrollToSection(matched, false)
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('popstate', handlePopState)

    // Check initial route upon load (e.g. user navigated to /projects, /about, or /#contact)
    const hashTarget = window.location.hash.replace('#', '').replace('/', '')
    const pathTarget = window.location.pathname.replace('/', '')
    const initialTarget = (sectionIds.includes(hashTarget) ? hashTarget : '') ||
                          (sectionIds.includes(pathTarget) ? pathTarget : '')

    if (initialTarget && initialTarget !== 'home') {
      setTimeout(() => {
        scrollToSection(initialTarget, false)
      }, 200)
    } else {
      checkScrollState()
    }
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('popstate', handlePopState)

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
