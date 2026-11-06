<script setup lang="ts">
import { ref, computed, provide, onMounted, onUnmounted } from 'vue'
import { RouterView, useRoute, type RouteLocationNormalizedLoaded } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LiquidBackground from '@/components/LiquidBackground.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'

import { useScrollObserver } from '@/composables/useScrollObserver'
import { useSmoothScroll } from '@/composables/useSmoothScroll'
import { useReducedMotion } from '@/composables/useReducedMotion'

const route = useRoute()
const { isReducedMotion } = useReducedMotion()

const isHeaderHidden = computed<boolean>(() => {
  return Boolean(route.meta?.hideNavbar)
})

const smoothScroll = useSmoothScroll()
provide('smoothScroll', smoothScroll)

const sectionIds = ['home', 'about', 'services', 'skills', 'projects', 'experience', 'process', 'contact'] as const
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

const progressBarRef = ref<HTMLDivElement | null>(null)
let progressTween: gsap.core.Tween | null = null

onMounted(() => {
  if (typeof window === 'undefined') return

  // Ultra-Thin Editorial Scroll Progress Bar (GSAP ScrollTrigger Driven)
  if (!isReducedMotion.value && progressBarRef.value) {
    progressTween = gsap.to(progressBarRef.value, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15,
      },
    })
  }
})

onUnmounted(() => {
  if (progressTween) {
    progressTween.kill()
    progressTween = null
  }
})

provide('scrollToSection', scrollToSection)
provide('activeSection', activeSection)

const handleNavigate = (sectionId: string): void => {
  scrollToSection(sectionId)
}
</script>

<template>
  <div class="min-h-screen bg-canvas text-ink flex flex-col relative selection:bg-primary selection:text-white">
    <!-- Ultra-Thin Editorial Scroll Progress Bar (GSAP ScrollTrigger Driven) -->
    <div
      ref="progressBarRef"
      class="fixed top-0 left-0 right-0 h-0.5 bg-primary origin-left z-50 pointer-events-none scale-x-0"
      aria-hidden="true"
    />

    <!-- Luminous Pearl Glass Interactive Liquid Waves Background -->
    <LiquidBackground />

    <!-- Floating Pearl Glass Navigation Bar -->
    <AppNavbar
      :is-scrolled="isScrolled"
      :active-section="activeSection"
      :is-hidden="isHeaderHidden"
      @navigate="handleNavigate"
    />

    <!-- Main View Slot with Premium Agency-Grade Route Pan Transition -->
    <main class="flex-1 w-full relative z-10 route-transition-container">
      <RouterView v-slot="{ Component, route: currentRoute }">
        <Transition
          :name="isReducedMotion ? 'page-fade' : 'page-pan'"
          mode="out-in"
        >
          <component
            :is="Component"
            :key="getRouteKey(currentRoute)"
            class="w-full"
          />
        </Transition>
      </RouterView>
    </main>

    <!-- Application Footer (Always Full-Width Background with Centered Content) -->
    <AppFooter />
  </div>
</template>