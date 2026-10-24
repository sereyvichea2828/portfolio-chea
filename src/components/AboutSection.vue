<script setup lang="ts">
import { ref } from 'vue';
import { ABOUT_CONTENT } from '@/data/portfolioData';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { Layers, Cpu, ShieldCheck, ArrowRight } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'navigate', sectionId: string): void;
}>();

const sectionRef = ref<HTMLElement | null>(null);
const { isReducedMotion } = useReducedMotion();

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  const header = container.querySelector('.about-header');
  const narrative = container.querySelector('.narrative-card');
  const principles = container.querySelectorAll('.principle-card');
  const stats = container.querySelectorAll('.stat-card');

  if (header) {
    tl.fromTo(header, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,willChange' });
  }
  if (narrative) {
    tl.fromTo(narrative, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', clearProps: 'transform,willChange' }, '-=0.45');
  }
  if (principles.length > 0) {
    tl.fromTo(principles, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.09, ease: 'power3.out', clearProps: 'transform,willChange' }, '-=0.4');
  }
  if (stats.length > 0) {
    tl.fromTo(stats, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,scale,willChange' }, '-=0.4');
  }
});

const getPrincipleIcon = (name: string) => {
  switch (name) {
    case 'Layers':
      return Layers;
    case 'Cpu':
      return Cpu;
    default:
      return ShieldCheck;
  }
};

const handleExploreClick = (): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  emit('navigate', '#services');
};
</script>

<template>
  <section
    id="about"
    ref="sectionRef"
    class="py-24 relative z-10 scroll-mt-24"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="about-header max-w-3xl mb-14 sm:mb-16 space-y-2">
        <p class="text-xs font-bold uppercase tracking-widest text-slate-500">
          {{ ABOUT_CONTENT.sectionTag }}
        </p>
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
        >
          {{ ABOUT_CONTENT.headline }}
        </h2>
      </div>

      <!-- Main Narrative & Principles Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 sm:mb-16 items-stretch">
        <!-- Left: Narrative & Primary Statement -->
        <div class="narrative-card lg:col-span-6 flex flex-col">
          <div
            class="h-full flex flex-col justify-between bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div class="space-y-4 sm:space-y-5">
              <p class="text-base sm:text-lg text-slate-900 leading-relaxed font-normal">
                {{ ABOUT_CONTENT.leadBio }}
              </p>
              <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
                {{ ABOUT_CONTENT.detailedBio }}
              </p>
            </div>
            <div class="pt-2">
              <button
                type="button"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs tracking-wide transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer min-h-11 shadow-xs"
                @click="handleExploreClick"
              >
                <span>EXPLORE SERVICES</span>
                <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Core Principles in Refined Cards -->
        <div class="lg:col-span-6 flex flex-col gap-4 h-full">
          <div
            v-for="principle in ABOUT_CONTENT.principles"
            :key="principle.id"
            class="principle-card flex-1 flex flex-col justify-center bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300"
          >
            <div class="flex items-start gap-4">
              <!-- Domain Icon Container -->
              <div
                class="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200/70 flex items-center justify-center shrink-0 shadow-xs"
              >
                <component :is="getPrincipleIcon(principle.iconName)" class="w-5 h-5" />
              </div>
              <div class="space-y-1">
                <h3 class="text-base font-bold text-slate-900 tracking-tight">
                  {{ principle.title }}
                </h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  {{ principle.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Key Performance Statistics Row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          v-for="stat in ABOUT_CONTENT.stats"
          :key="stat.label"
          class="stat-card bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs text-center flex flex-col justify-center hover:shadow-md transition-shadow"
        >
          <span
            class="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-1 font-heading"
          >
            {{ stat.value }}
          </span>
          <span class="text-sm sm:text-base font-bold text-slate-900 mb-1">
            {{ stat.label }}
          </span>
          <span class="text-xs text-slate-500">
            {{ stat.detail }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
