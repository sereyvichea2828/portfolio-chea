<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent } from 'vue';
import { PROJECTS } from '@/data/portfolioData';
import type { Project } from '@/types/portfolio';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useSmoothScroll } from '@/composables/useSmoothScroll';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { useModalState } from '@/composables/useModalState';
import ProjectCard from '@/components/ProjectCard.vue';
import { ArrowUpRight } from 'lucide-vue-next';

const ProjectModal = defineAsyncComponent(() => import('@/components/ProjectModal.vue'));

const sectionRef = ref<HTMLElement | null>(null);
const { isReducedMotion } = useReducedMotion();
const smoothScroll = useSmoothScroll();
const { registerModal } = useModalState();

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  const header = container.querySelector('.projects-header');
  const cards = container.querySelectorAll('.project-card-wrapper');

  if (header) {
    tl.fromTo(
      header,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,willChange' },
    );
  }
  if (cards.length > 0) {
    tl.fromTo(
      cards,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,scale,willChange',
      },
      '-=0.4',
    );
  }
});

const selectedCaseStudy = ref<Project | null>(null);
const isModalOpen = ref<boolean>(false);

watch(isModalOpen, (isOpen) => {
  registerModal('project-case-study', isOpen);
});

const openCaseStudy = (project: Project): void => {
  selectedCaseStudy.value = project;
  isModalOpen.value = true;
  smoothScroll.stop();
};

const closeCaseStudy = (): void => {
  isModalOpen.value = false;
  selectedCaseStudy.value = null;
  smoothScroll.start();
};
</script>

<template>
  <section id="projects" ref="sectionRef" class="py-24 relative z-10 scroll-mt-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header with subtle right-aligned link -->
      <div
        class="projects-header flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12"
      >
        <div class="max-w-2xl">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-8 h-0.5 bg-linear-to-r from-purple-500 to-indigo-500 rounded-full" />
            <p class="text-xs font-bold uppercase tracking-widest text-purple-600">SELECTED WORK</p>
          </div>
          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            Projects I've Built
          </h2>
          <p class="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Real-world applications, thoughtful engineering, and digital experiences designed to
            solve meaningful problems.
          </p>
        </div>

        <!-- Subtle "Explore All Projects" link on desktop -->
        <a
          href="https://github.com/sereyvichea2828?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          class="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors group self-start md:self-end pb-1"
        >
          <span>Explore All Projects</span>
          <ArrowUpRight
            class="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </a>
      </div>

      <!-- 2-Column Responsive Project Cards Grid (2 cards per row on tablet and desktop) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div
          v-for="project in PROJECTS"
          :key="project.id"
          class="project-card-wrapper h-full flex flex-col"
        >
          <ProjectCard :project="project" @select-case-study="openCaseStudy" />
        </div>
      </div>

      <!-- Deep Dive Case Study Modal (Lazy-loaded upon trigger) -->
      <ProjectModal
        v-if="isModalOpen && selectedCaseStudy"
        :project="selectedCaseStudy"
        :is-open="isModalOpen"
        @close="closeCaseStudy"
      />
    </div>
  </section>
</template>
