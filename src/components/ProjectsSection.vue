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
        <div class="max-w-2xl space-y-2">
          <p class="text-xs font-bold uppercase tracking-widest text-slate-500">SELECTED WORK</p>
          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            Projects I've Built
          </h2>
          <p class="text-base sm:text-lg text-slate-600 leading-relaxed">
            Real-world applications, thoughtful engineering, and digital experiences designed to
            solve meaningful problems.
          </p>
        </div>

        <!-- Subtle "Explore All Projects" link on desktop -->
        <a
          href="https://github.com/sereyvichea2828?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          class="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-700 transition-colors group self-start md:self-end pb-1"
        >
          <span>Explore All 28+ Projects</span>
          <ArrowUpRight
            class="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </a>
      </div>

      <!-- 2-Column Responsive Project Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <!-- Flagship Project Card: ITE A3 Academic Ecosystem -->
        <div
          v-for="project in PROJECTS"
          :key="project.id"
          class="project-card-wrapper h-full flex flex-col"
        >
          <ProjectCard :project="project" @select-case-study="openCaseStudy" />
        </div>

        <!-- Companion Card: Open Source Systems & Architecture Repository -->
        <div class="project-card-wrapper h-full flex flex-col">
          <div
            class="h-full flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl border border-slate-200/85 p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-md bg-slate-100 text-slate-800 border border-slate-200/80 uppercase tracking-wider"
                >
                  OPEN SOURCE & SYSTEMS
                </span>
                <span class="text-xs font-mono font-bold text-slate-500">28+ Repos</span>
              </div>

              <h3 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                Open-Source Systems & Architecture Laboratory
              </h3>

              <p class="text-sm text-slate-600 leading-relaxed">
                Collection of public codebases, reusable Vue 3 composition modules, embedded serial communication protocols, and high-performance frontend engineering foundations.
              </p>

              <!-- Technical Domain Highlights -->
              <div class="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Strict TypeScript contracts & zero-loose-type component systems</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Hardware-accelerated 60/120fps GSAP and Three.js visualizers</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>High-concurrency Node.js APIs, database migrations & Docker flows</span>
                </div>
              </div>
            </div>

            <!-- Bottom Action Row -->
            <div class="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
              <a
                href="https://github.com/sereyvichea2828?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View All Repositories</span>
                <ArrowUpRight class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
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
