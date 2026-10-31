<script setup lang="ts">
import { ref } from 'vue';
import { PROCESS_STEPS } from '@/data/portfolioData';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';

const sectionRef = ref<HTMLElement | null>(null);
const { isReducedMotion } = useReducedMotion();

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  if (isReducedMotion.value) {
    const all = container.querySelectorAll('.process-header, .process-step');
    all.forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
    return;
  }

  const header = container.querySelector('.process-header');
  const steps = container.querySelectorAll('.process-step');

  if (header) {
    tl.fromTo(
      header,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', clearProps: 'transform,willChange' },
    );
  }

  if (steps.length > 0) {
    tl.fromTo(
      steps,
      { y: 14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
      '-=0.3',
    );
  }
});
</script>

<template>
  <section id="process" ref="sectionRef" class="py-14 sm:py-20 relative z-10 scroll-mt-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 1. Section Header -->
      <div class="process-header max-w-3xl mb-12 sm:mb-16 space-y-2.5">
        <div class="flex items-center gap-2">
          <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
            លំហូរការងារ & វិធីសាស្ត្រ
          </p>
        </div>
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-extrabold text-slate-900 leading-[1.3] font-heading tracking-normal"
        >
          ដំណើរការការងារអភិវឌ្ឍន៍របស់ខ្ញុំ
        </h2>
        <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal text-pretty">
          ជំហានការងារច្បាស់លាស់ចំនួន ៥ ដំណាក់កាល ដែលបង្កើតឡើងដើម្បីលុបបំបាត់ភាពមិនច្បាស់លាស់
          និងធានាការបញ្ចេញកម្មវិធីប្រកបដោយគុណភាពខ្ពស់។
        </p>
      </div>

      <!-- 2. Connected Editorial Workflow Sequence (Single Responsive Architecture) -->
      <div class="space-y-10 sm:space-y-12">
        <div
          v-for="step in PROCESS_STEPS"
          :key="step.number"
          class="process-step border-b border-slate-200/80 pb-10 sm:pb-12 last:border-b-0 last:pb-0"
        >
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
            <!-- Left Column: Step Indicator + Primary Title + Summary (5 cols on Desktop) -->
            <div class="lg:col-span-5 flex items-start gap-3.5 sm:gap-4">
              <!-- Crisp Monospace Step Index Tile -->
              <div
                class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white font-mono text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 shadow-xs select-none"
              >
                {{ step.number }}
              </div>

              <!-- Title & Immediate Executive Summary -->
              <div class="pt-0.5">
                <h3
                  class="text-lg sm:text-xl font-bold text-slate-900 font-heading leading-tight tracking-normal"
                >
                  {{ step.title }}
                </h3>
                <p class="text-xs sm:text-sm font-semibold text-slate-700 mt-1.5 leading-snug">
                  {{ step.summary }}
                </p>
              </div>
            </div>

            <!-- Right Column: Technical Methodology & Deliverables (7 cols on Desktop) -->
            <div class="lg:col-span-7 pl-12.5 sm:pl-14 lg:pl-0 space-y-3.5">
              <p
                class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal text-pretty"
              >
                {{ step.description }}
              </p>

              <!-- Deliverables Micro-Tag List -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-xs font-medium text-slate-500 mr-1 select-none">
                  លទ្ធផលទទួលបាន៖
                </span>
                <span
                  v-for="deliv in step.deliverables"
                  :key="deliv"
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
                >
                  {{ deliv }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
