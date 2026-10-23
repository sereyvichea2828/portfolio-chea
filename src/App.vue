<script setup lang="ts">
import { ref, computed, watch, provide, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { RouterView, useRoute, type RouteLocationNormalizedLoaded } from 'vue-router'
import LiquidBackground from '@/components/LiquidBackground.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'

const MouseFollowGlass = defineAsyncComponent(() => import('@/components/MouseFollowGlass.vue'))
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

const checkFooterVisibility = (): void => {
  if (typeof window === 'undefined') return
  const footerEl = document.querySelector('footer')
  if (!footerEl) return
  const rect = footerEl.getBoundingClientRect()
  // Hide navbar smoothly when the footer enters the viewport (top of footer <= window.innerHeight - 60)
  isFooterVisible.value = rect.top <= window.innerHeight - 60
}

onMounted(() => {
  if (typeof window === 'undefined') return

  checkFooterVisibility()

  window.addEventListener('scroll', checkFooterVisibility, { passive: true })
  window.addEventListener('resize', checkFooterVisibility, { passive: true })

  watch(
    () => smoothScroll.lenis.value,
    (lenisInstance) => {
      if (lenisInstance) {
        lenisInstance.on('scroll', checkFooterVisibility)
        lenisScrollCleanup = () => {
          lenisInstance.off('scroll', checkFooterVisibility)
        }
      }
    },
    { immediate: true },
  )

  const footerEl = document.querySelector('footer')
  if (footerEl && 'IntersectionObserver' in window) {
    footerObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          isFooterVisible.value =
            entry.isIntersecting && entry.boundingClientRect.top <= window.innerHeight - 60
        }
      },
      {
        threshold: [0, 0.05, 0.1, 0.2],
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
    window.removeEventListener('scroll', checkFooterVisibility)
    window.removeEventListener('resize', checkFooterVisibility)
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

    <!-- Section Divider: Content to Footer -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10" aria-hidden="true">
      <div class="w-full h-px bg-linear-to-r from-transparent via-purple-200/60 to-transparent" />
    </div>

    <!-- Application Footer -->
    <AppFooter />
  </div>
</template>