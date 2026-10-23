<script setup lang="ts">
import { ref, watch, inject, type Ref, onMounted, nextTick, defineAsyncComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import HeroSection from '@/components/HeroSection.vue';
import AboutSection from '@/components/AboutSection.vue';
import type { SmoothScrollController } from '@/composables/useSmoothScroll';
import { useModalState } from '@/composables/useModalState';

// Critical below-the-fold async components
const ServicesSection = defineAsyncComponent(() => import('@/components/ServicesSection.vue'));
const SkillsSection = defineAsyncComponent(() => import('@/components/SkillsSection.vue'));
const ProjectsSection = defineAsyncComponent(() => import('@/components/ProjectsSection.vue'));
const ProcessSection = defineAsyncComponent(() => import('@/components/ProcessSection.vue'));
const TestimonialsSection = defineAsyncComponent(() => import('@/components/TestimonialsSection.vue'));
const ContactSection = defineAsyncComponent(() => import('@/components/ContactSection.vue'));
const ResumeModal = defineAsyncComponent(() => import('@/components/ResumeModal.vue'));

const router = useRouter();
const route = useRoute();
const { registerModal } = useModalState();

const isResumeModalOpen = ref<boolean>(false);
const previousPath = ref<string>('/');

const scrollToSection =
  inject<(sectionId: string, updateUrl?: boolean, pushHistory?: boolean) => void>(
    'scrollToSection',
  );

const activeSection = inject<Ref<string>>('activeSection');

const smoothScroll = inject<SmoothScrollController>('smoothScroll');

// Add this BELOW the injections
onMounted(async () => {
  if (route.path === '/resume') return;

  const sectionId = typeof route.meta.sectionId === 'string' ? route.meta.sectionId : 'home';

  await nextTick();

  requestAnimationFrame(() => {
    if (scrollToSection) {
      scrollToSection(sectionId, false, false);
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'auto',
      block: 'start',
    });
  });
});

// Synchronize /resume route with modal visibility
watch(
  () => route.path,
  (path) => {
    if (path === '/resume') {
      isResumeModalOpen.value = true;
    } else if (isResumeModalOpen.value) {
      isResumeModalOpen.value = false;
    }
  },
  { immediate: true },
);

watch(isResumeModalOpen, (isOpen) => {
  registerModal('resume', isOpen);
  if (isOpen) {
    smoothScroll?.stop();
  } else {
    smoothScroll?.start();
  }
});

const handleNavigate = (sectionId: string): void => {
  const cleanId = sectionId.replace('#', '').replace('/', '') || 'home';
  if (scrollToSection) {
    scrollToSection(cleanId, true);
  } else {
    const targetPath = cleanId === 'home' ? '/' : `/${cleanId}`;
    router.push(targetPath).catch(() => {});
  }
};

const openResumeModal = (): void => {
  previousPath.value = route.path !== '/resume' ? route.fullPath : '/';
  isResumeModalOpen.value = true;
  if (route.path !== '/resume') {
    router.push('/resume').catch(() => {});
  }
};

const closeResumeModal = (): void => {
  isResumeModalOpen.value = false;
  if (route.path === '/resume') {
    router.push(previousPath.value || '/').catch(() => {});
  }
};
</script>

<template>
  <main class="relative z-10 w-full overflow-hidden">
    <!-- Hero Section -->
    <HeroSection @navigate="handleNavigate" @open-resume="openResumeModal" />

    <!-- Section Divider: Hero to About -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" aria-hidden="true">
      <div class="w-full h-px bg-linear-to-r from-transparent via-purple-200/60 to-transparent" />
    </div>

    <!-- About Section -->
    <AboutSection @navigate="handleNavigate" />

    <!-- Section Divider: About to Services -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" aria-hidden="true">
      <div class="w-full h-px bg-linear-to-r from-transparent via-purple-200/60 to-transparent" />
    </div>

    <!-- Services Section -->
    <ServicesSection />

    <!-- Section Divider: Services to Skills -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" aria-hidden="true">
      <div class="w-full h-px bg-linear-to-r from-transparent via-purple-200/60 to-transparent" />
    </div>

    <!-- Skills & Technology Wall -->
    <SkillsSection />

    <!-- Section Divider: Skills to Projects -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" aria-hidden="true">
      <div class="w-full h-px bg-linear-to-r from-transparent via-purple-200/60 to-transparent" />
    </div>

    <!-- Selected Projects Showcase -->
    <ProjectsSection />

    <!-- Section Divider: Projects to Process -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" aria-hidden="true">
      <div class="w-full h-px bg-linear-to-r from-transparent via-purple-200/60 to-transparent" />
    </div>

    <!-- My Development Process -->
    <ProcessSection />

    <!-- Section Divider: Process to Testimonials -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" aria-hidden="true">
      <div class="w-full h-px bg-linear-to-r from-transparent via-purple-200/60 to-transparent" />
    </div>

    <!-- Testimonials Section -->
    <TestimonialsSection />

    <!-- Section Divider: Testimonials to Contact -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" aria-hidden="true">
      <div class="w-full h-px bg-linear-to-r from-transparent via-purple-200/60 to-transparent" />
    </div>

    <!-- Contact Section -->
    <ContactSection />

    <!-- Resume / CV Viewer Modal (Lazy-loaded upon trigger) -->
    <ResumeModal v-if="isResumeModalOpen" :is-open="isResumeModalOpen" @close="closeResumeModal" />
  </main>
</template>
