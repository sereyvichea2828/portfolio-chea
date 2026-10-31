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
  if (isReducedMotion.value) {
    const all = container.querySelectorAll(
      '.about-header, .about-intro, .about-details, .principle-row, .about-stats',
    );
    all.forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
    return;
  }

  const header = container.querySelector('.about-header');
  const intro = container.querySelector('.about-intro');
  const details = container.querySelector('.about-details');
  const principleRows = container.querySelectorAll('.principle-row');
  const statsStrip = container.querySelector('.about-stats');

  if (header) {
    tl.fromTo(
      header,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
    );
  }
  if (intro) {
    tl.fromTo(
      intro,
      { y: 14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
      '-=0.4',
    );
  }
  if (details) {
    tl.fromTo(
      details,
      { y: 14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
      '-=0.45',
    );
  }
  if (principleRows.length > 0) {
    tl.fromTo(
      principleRows,
      { y: 12, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
      '-=0.35',
    );
  }
  if (statsStrip) {
    tl.fromTo(
      statsStrip,
      { y: 14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
      '-=0.3',
    );
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

const handleExperienceClick = (): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  emit('navigate', '#experience');
};
</script>

<template>
  <section id="about" ref="sectionRef" class="py-14 sm:py-20 relative z-10 scroll-mt-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 1. Understated Section Header -->
      <div class="about-header max-w-3xl mb-12 sm:mb-16 space-y-2.5">
        <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
          {{ ABOUT_CONTENT.sectionTag }}
        </p>
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-extrabold text-slate-900 leading-[1.3] font-heading tracking-normal"
        >
          {{ ABOUT_CONTENT.headline }}
        </h2>
      </div>

      <!-- 2. Editorial 5/7 Grid Composition (Zero Nested Glass Cards) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16 sm:mb-20">
        <!-- Left Column (5 cols): Prominent Introduction & CTA -->
        <div class="about-intro lg:col-span-5 flex flex-col space-y-6">
          <div class="border-l-2 border-slate-900 pl-4 sm:pl-5 space-y-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">
              ទស្សនវិស័យ & គោលជំហរ
            </span>
            <p
              class="text-base sm:text-lg lg:text-xl font-medium text-slate-900 leading-relaxed font-heading"
            >
              {{ ABOUT_CONTENT.leadBio }}
            </p>
          </div>

          <!-- Verified Identity Badges -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white/80 border border-slate-200/90 text-slate-700 shadow-2xs"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-600" aria-hidden="true" />
              <span>និស្សិតវិស្វកម្ម ITE A3</span>
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white/80 border border-slate-200/90 text-slate-700 shadow-2xs"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
              <span>DevOps Certified (TFDevs)</span>
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white/80 border border-slate-200/90 text-slate-700 shadow-2xs"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-slate-600" aria-hidden="true" />
              <span>រាជធានីភ្នំពេញ កម្ពុជា</span>
            </span>
          </div>

          <div class="pt-1 flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer min-h-11 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              @click="handleExploreClick"
            >
              <span>ស្វែងយល់ពីសេវាកម្ម</span>
              <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-800 border border-slate-200/90 hover:bg-slate-50 active:bg-slate-100 font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-200 cursor-pointer min-h-11 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              @click="handleExperienceClick"
            >
              <span>មើលវិញ្ញាបនបត្រ</span>
            </button>
          </div>
        </div>

        <!-- Right Column (7 cols): Detailed Narrative & Core Principles Rows -->
        <div class="about-details lg:col-span-7 flex flex-col space-y-8">
          <!-- Comfortable Reading Column with clean paragraphs -->
          <div class="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            <p
              v-for="(paragraph, pIndex) in ABOUT_CONTENT.detailedBio.split('\n\n')"
              :key="pIndex"
            >
              {{ paragraph }}
            </p>
          </div>

          <!-- Core Principles — Clean Editorial Rows Separated by Thin Hairlines -->
          <div class="pt-2 space-y-3">
            <h3
              class="text-xs font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-200/80"
            >
              គោលការណ៍វិស្វកម្មស្នូល
            </h3>

            <div class="divide-y divide-slate-200/80">
              <div
                v-for="(principle, index) in ABOUT_CONTENT.principles"
                :key="principle.id"
                class="principle-row py-4 sm:py-5 group transition-colors duration-200"
              >
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-start">
                  <!-- Row Identifier: Index + Icon + Title (5 cols) -->
                  <div class="sm:col-span-5 flex items-start gap-2.5">
                    <component
                      :is="getPrincipleIcon(principle.iconName)"
                      class="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <h4
                      class="text-sm sm:text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors"
                    >
                      {{ principle.title }}
                    </h4>
                  </div>

                  <!-- Row Description (7 cols) -->
                  <div class="sm:col-span-7">
                    <p
                      class="text-xs sm:text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors"
                    >
                      {{ principle.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Coordinated Typographic Statistics Strip (Single Balanced Unit) -->
      <div class="about-stats pt-10 sm:pt-12 border-t border-slate-200/80">
        <div
          class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80"
        >
          <div
            v-for="(stat, index) in ABOUT_CONTENT.stats"
            :key="stat.label"
            class="stat-col py-6 sm:py-2"
            :class="[
              index === 0 ? 'sm:pr-8' : '',
              index === 1 ? 'sm:px-8' : '',
              index === 2 ? 'sm:pl-8' : '',
            ]"
          >
            <div class="flex flex-col space-y-1">
              <span
                class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading tracking-normal"
              >
                {{ stat.value }}
              </span>
              <span class="text-sm sm:text-base font-bold text-slate-900 pt-1">
                {{ stat.label }}
              </span>
              <span class="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {{ stat.detail }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
