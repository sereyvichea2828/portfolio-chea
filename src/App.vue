<script setup lang="ts">
import { ref, computed, watch, provide, onMounted, onUnmounted } from 'vue'
import { RouterView, useRoute, type RouteLocationNormalizedLoaded } from 'vue-router'
import LiquidBackground from '@/components/LiquidBackground.vue'
import MouseFollowGlass from '@/components/MouseFollowGlass.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useScrollObserver } from '@/composables/useScrollObserver'
import { useSmoothScroll } from '@/composables/useSmoothScroll'
import { useModalState } from '@/composables/useModalState'
import { useReducedMotion } from '@/composables/useReducedMotion'

const route = useRoute()
const { isAnyModalOpen } = useModalState()
const { isReducedMotion } = useReducedMotion()

const isHeaderHidden = computed<boolean>(() => {
  return isAnyModalOpen.value || Boolean(route.meta?.hideNavbar) || route.name === 'resume'
})

const smoothScroll = useSmoothScroll()
provide('smoothScroll', smoothScroll)

const sectionIds = ['home', 'about', 'services', 'skills', 'projects', 'process', 'contact'] as const
const { isScrolled, activeSection, scrollToSection } = useScrollObserver(sectionIds, smoothScroll)

/**
 * Derives a stable route key for Vue Router transitions.
 * Section routes on the single-page view share 'home-view' to preserve
 * smooth Lenis anchor scrolling, while distinct views trigger the horizontal pan.
 */
const getRouteKey = (currentRoute: RouteLocationNormalizedLoaded): string => {
  if (currentRoute.meta?.viewKey) {
    return String(currentRoute.meta.viewKey)
  }
  if (currentRoute.meta?.sectionId) {
    return 'home-view'
  }
  return (currentRoute.name as string) || currentRoute.path
}

const handleBeforeLeave = (_el: Element): void => {
  // Outgoing view interaction lock handled via CSS pointer-events: none
}

const handleAfterEnter = (_el: Element): void => {
  if (!route.meta?.sectionId && typeof window !== 'undefined') {
    window.scrollTo({ top: 0, left: 0 })
    smoothScroll?.scrollTo(0, { immediate: true })
  }
}

const isFooterVisible = ref<boolean>(false)
let footerObserver: IntersectionObserver | null = null
let lenisScrollCleanup: (() => void) | null = null

const checkFooterProximity = (): void => {
  if (typeof window === 'undefined') return
  const footerEl = document.querySelector('footer')
  if (!footerEl) return
  const rect = footerEl.getBoundingClientRect()
  // Only hide navbar when footer has scrolled into upper viewport (within 140px of top)
  isFooterVisible.value = rect.top <= 140
}

onMounted(() => {
  if (typeof window === 'undefined') return

  // 1. Initial proximity check
  checkFooterProximity()

  // 2. Continuous real-time scroll & resize listeners
  window.addEventListener('scroll', checkFooterProximity, { passive: true })
  window.addEventListener('resize', checkFooterProximity, { passive: true })

  // 3. Connect to Lenis smooth scroll updates
  watch(
    () => smoothScroll.lenis.value,
    (lenisInstance) => {
      if (lenisInstance) {
        lenisInstance.on('scroll', checkFooterProximity)
        lenisScrollCleanup = () => {
          lenisInstance.off('scroll', checkFooterProximity)
        }
      }
    },
    { immediate: true },
  )

  // 4. Fallback IntersectionObserver when footer reaches top zone
  const footerEl = document.querySelector('footer')
  if (footerEl && 'IntersectionObserver' in window) {
    footerObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          isFooterVisible.value =
            entry.isIntersecting && entry.boundingClientRect.top <= 140
        }
      },
      {
        rootMargin: '-100px 0px 0px 0px',
        threshold: [0, 0.1, 0.2],
      },
    )
    footerObserver.observe(footerEl)
  }
})

onUnmounted(() => {
  if (footerObserver) {
    footerObserver.disconnect()
    footerObserver = null
  }
  if (lenisScrollCleanup) {
    lenisScrollCleanup()
    lenisScrollCleanup = null
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', checkFooterProximity)
    window.removeEventListener('resize', checkFooterProximity)
  }
})

provide('scrollToSection', scrollToSection)
provide('activeSection', activeSection)

const handleNavigate = (sectionId: string): void => {
  scrollToSection(sectionId)
}
</script>

<template>
  <div class="min-h-screen bg-pearl-bg text-ink-primary flex flex-col relative selection:bg-purple-200 selection:text-purple-900">
    <!-- Luminous Pearl Glass Interactive Liquid Waves Background -->
    <LiquidBackground />

    <!-- Real-Time Mouse-Following 3D Liquid Glass Sculpture -->
    <MouseFollowGlass />


    <!-- Floating Pearl Glass Navigation Bar -->
    <AppNavbar
      :is-scrolled="isScrolled"
      :active-section="activeSection"
      :is-footer-visible="isFooterVisible"
      :is-hidden="isHeaderHidden"
      @navigate="handleNavigate"
    />

    <!-- Main View Slot with Premium Agency-Grade Route Pan Transition -->
    <main class="flex-1 w-full relative z-10 route-transition-container">
      <RouterView v-slot="{ Component, route: currentRoute }">
        <Transition
          :name="isReducedMotion ? 'page-fade' : 'page-pan'"
          mode="out-in"
          @before-leave="handleBeforeLeave"
          @after-enter="handleAfterEnter"
        >
          <component
            :is="Component"
            :key="getRouteKey(currentRoute)"
            class="w-full"
          />
        </Transition>
      </RouterView>
    </main>

    <!-- Application Footer -->
    <AppFooter />
  </div>
</template>