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
      <div class="about-header max-w-3xl mb-16">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-8 h-0.5 bg-linear-to-r from-purple-400 to-indigo-400 rounded-full" />
          <p class="text-xs font-bold uppercase tracking-widest text-purple-600">
            {{ ABOUT_CONTENT.sectionTag }}
          </p>
        </div>
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider text-ink-primary leading-tight"
        >
          {{ ABOUT_CONTENT.headline }}
        </h2>
      </div>

      <!-- Main Narrative & Principles Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
        <!-- Left: Narrative & Primary Statement -->
        <div class="narrative-card lg:col-span-6 flex flex-col">
          <div
            class="h-full flex flex-col justify-between bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-md shadow-purple-950/5 space-y-6"
          >
            <div class="space-y-4 sm:space-y-5">
              <p class="text-base sm:text-lg text-ink-primary leading-relaxed font-normal">
                {{ ABOUT_CONTENT.leadBio }}
              </p>
              <p class="text-sm sm:text-base text-ink-secondary leading-relaxed">
                {{ ABOUT_CONTENT.detailedBio }}
              </p>
            </div>
            <div class="pt-2">
              <button
                type="button"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100/80 font-semibold text-xs tracking-wide transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer min-h-11"
                @click="handleExploreClick"
              >
                <span>EXPLORE MY SERVICES</span>
                <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Core Principles in Pearl Glass Cards -->
        <div class="lg:col-span-6 flex flex-col gap-4 h-full">
          <div
            v-for="principle in ABOUT_CONTENT.principles"
            :key="principle.id"
            class="principle-card flex-1 flex flex-col justify-center bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-5 sm:p-6 shadow-md shadow-purple-950/5 hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-start gap-4">
              <!-- Pastel Domain Icon Container -->
              <div
                class="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0 shadow-xs"
              >
                <component :is="getPrincipleIcon(principle.iconName)" class="w-5 h-5" />
              </div>
              <div class="space-y-1">
                <h3 class="text-base font-bold text-ink-primary tracking-tight">
                  {{ principle.title }}
                </h3>
                <p class="text-sm text-ink-secondary leading-relaxed">
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
          class="stat-card bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 sm:p-7 shadow-md shadow-purple-950/5 text-center flex flex-col justify-center hover:shadow-lg transition-shadow"
        >
          <span
            class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1 font-heading"
          >
            {{ stat.value }}
          </span>
          <span class="text-sm sm:text-base font-bold text-ink-primary mb-1">
            {{ stat.label }}
          </span>
          <span class="text-xs text-ink-secondary">
            {{ stat.detail }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
