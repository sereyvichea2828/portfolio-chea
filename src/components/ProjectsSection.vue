<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PROJECTS } from '@/data/portfolioData';
import type { Project, ProjectCategory } from '@/types/portfolio';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useSmoothScroll } from '@/composables/useSmoothScroll';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { useModalState } from '@/composables/useModalState';
import ProjectCard from '@/components/ProjectCard.vue';
import ProjectModal from '@/components/ProjectModal.vue';

const sectionRef = ref<HTMLElement | null>(null);
const { isReducedMotion } = useReducedMotion();
const smoothScroll = useSmoothScroll();
const { registerModal } = useModalState();

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  const header = container.querySelector('.projects-header');
  const filters = container.querySelector('.projects-filter');
  const cards = container.querySelectorAll('.project-card-wrapper');

  if (header) {
    tl.fromTo(header, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' });
  }
  if (filters) {
    tl.fromTo(filters, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }, '-=0.5');
  }
  if (cards.length > 0) {
    tl.fromTo(
      cards,
      { y: 32, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
      '-=0.45'
    );
  }
});

const activeCategory = ref<ProjectCategory>('All');
const selectedCaseStudy = ref<Project | null>(null);
const isModalOpen = ref<boolean>(false);

watch(isModalOpen, (isOpen) => {
  registerModal('project-case-study', isOpen);
});

const categories: readonly ProjectCategory[] = ['All', 'Full Stack', 'Frontend', 'Backend/API'];

const filteredProjects = computed<Project[]>(() => {
  if (activeCategory.value === 'All') {
    return [...PROJECTS];
  }
  return PROJECTS.filter((p) => p.category === activeCategory.value);
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
  <section
    id="projects"
    ref="sectionRef"
    class="py-24 relative z-10 scroll-mt-24"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header & Filter Tabs -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div class="projects-header max-w-2xl">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-8 h-0.5 bg-linear-to-r from-purple-400 to-indigo-400 rounded-full" />
            <p class="text-xs font-bold uppercase tracking-widest text-purple-600">
              FEATURED PROJECTS
            </p>
          </div>
          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider text-ink-primary leading-tight"
          >
            Selected Work
          </h2>
          <p class="mt-3 text-base sm:text-lg text-ink-secondary">
            Applications and digital products built with thoughtful design and solid engineering.
          </p>
        </div>

        <!-- Filter Pill Tabs -->
        <div
          class="projects-filter flex flex-wrap items-center gap-1.5 p-1.5 bg-white/80 backdrop-blur-md border border-white rounded-full shadow-xs self-start md:self-auto"
        >
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer min-h-11 flex items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
            :class="[
              activeCategory === cat
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-100/70',
            ]"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Project Showcase Grid: 3 columns on large desktop, 2 on tablet, 1 on mobile -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card-wrapper h-full flex flex-col"
        >
          <ProjectCard
            :project="project"
            @select-case-study="openCaseStudy"
          />
        </div>
      </div>

      <!-- Deep Dive Case Study Modal -->
      <ProjectModal :project="selectedCaseStudy" :is-open="isModalOpen" @close="closeCaseStudy" />
    </div>
  </section>
</template>
