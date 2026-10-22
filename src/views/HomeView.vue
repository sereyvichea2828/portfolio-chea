<script setup lang="ts">
import { ref, watch, inject, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import ProcessSection from '@/components/ProcessSection.vue'
import TestimonialsSection from '@/components/TestimonialsSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import ResumeModal from '@/components/ResumeModal.vue'
import type { SmoothScrollController } from '@/composables/useSmoothScroll'
import { useModalState } from '@/composables/useModalState'

const router = useRouter()
const route = useRoute()
const { registerModal } = useModalState()

const isResumeModalOpen = ref<boolean>(false)
const previousPath = ref<string>('/')

const scrollToSection = inject<(sectionId: string, updateUrl?: boolean) => void>('scrollToSection')
const activeSection = inject<Ref<string>>('activeSection')
const smoothScroll = inject<SmoothScrollController>('smoothScroll')

// Synchronize /resume route with modal visibility
watch(
  () => route.path,
  (path) => {
    if (path === '/resume') {
      isResumeModalOpen.value = true
    } else if (isResumeModalOpen.value) {
      isResumeModalOpen.value = false
    }
  },
  { immediate: true }
)

watch(isResumeModalOpen, (isOpen) => {
  registerModal('resume', isOpen)
  if (isOpen) {
    smoothScroll?.stop()
  } else {
    smoothScroll?.start()
  }
})

const handleNavigate = (sectionId: string): void => {
  const cleanId = sectionId.replace('#', '').replace('/', '') || 'home'
  if (scrollToSection) {
    scrollToSection(cleanId, true)
  } else {
    const targetPath = cleanId === 'home' ? '/' : `/${cleanId}`
    router.push(targetPath).catch(() => {})
  }
}

const openResumeModal = (): void => {
  previousPath.value = route.path !== '/resume' ? route.fullPath : '/'
  isResumeModalOpen.value = true
  if (route.path !== '/resume') {
    router.push('/resume').catch(() => {})
  }
}

const closeResumeModal = (): void => {
  isResumeModalOpen.value = false
  if (route.path === '/resume') {
    router.push(previousPath.value || '/').catch(() => {})
  }
}
</script>

<template>
  <main class="relative z-10 w-full overflow-hidden">
    <!-- Hero Section -->
    <HeroSection
      @navigate="handleNavigate"
      @open-resume="openResumeModal"
    />

    <!-- About Section -->
    <AboutSection
      @navigate="handleNavigate"
    />

    <!-- Services Section -->
    <ServicesSection />

    <!-- Skills & Technology Wall -->
    <SkillsSection />

    <!-- Selected Projects Showcase -->
    <ProjectsSection />

    <!-- My Development Process -->
    <ProcessSection />

    <!-- Testimonials Section -->
    <TestimonialsSection />

    <!-- Contact Section -->
    <ContactSection />

    <!-- Resume / CV Viewer Modal -->
    <ResumeModal
      :is-open="isResumeModalOpen"
      @close="closeResumeModal"
    />
  </main>
</template>
