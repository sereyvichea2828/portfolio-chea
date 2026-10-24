<script setup lang="ts">
import { ref } from 'vue';
import { PROCESS_STEPS } from '@/data/portfolioData';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';

const sectionRef = ref<HTMLElement | null>(null);

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  const header = container.querySelector('.process-header');
  const cards = container.querySelectorAll('.process-card');

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
        stagger: 0.09,
        ease: 'power3.out',
        clearProps: 'transform,scale,willChange',
      },
      '-=0.4',
    );
  }
});

</script>

<template>
  <section
    id="process"
    ref="sectionRef"
    class="py-24 relative z-10 scroll-mt-24"
  >

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="process-header max-w-3xl mb-14 sm:mb-16 space-y-2">
        <p class="text-xs font-bold uppercase tracking-widest text-slate-500">
          WORKFLOW & METHODOLOGY
        </p>
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
        >
          My Development Process
        </h2>
        <p class="text-base sm:text-lg text-slate-600">
          A disciplined five-step progression engineered to eliminate ambiguity and deliver
          resilient software.
        </p>
      </div>

      <!-- Process Steps Container -->
      <!-- Desktop: 5 horizontal connected cards -->
      <div class="hidden lg:grid grid-cols-5 gap-4 relative">
        <div
          v-for="step in PROCESS_STEPS"
          :key="step.number"
          tabindex="0"
          class="process-card relative z-10 group bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-default outline-none"
        >
          <div class="space-y-4">
            <!-- Step Number Pill -->
            <div class="flex items-center justify-between">
              <span
                class="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs"
              >
                {{ step.number }}
              </span>
              <span class="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Phase
              </span>
            </div>

            <!-- Title & Summary -->
            <div>
              <h3
                class="text-base font-bold text-slate-900 tracking-tight transition-colors"
              >
                {{ step.title }}
              </h3>
              <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {{ step.summary }}
              </p>
            </div>
          </div>

          <!-- Deliverables list -->
          <div class="mt-5 pt-3 border-t border-slate-100 space-y-1.5">
            <div
              v-for="(deliv, idx) in step.deliverables"
              :key="idx"
              class="flex items-center gap-1.5 text-xs text-slate-600"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              <span class="truncate">{{ deliv }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile & Tablet: Vertical Timeline -->
      <div class="lg:hidden space-y-6 relative pl-6 border-l-2 border-slate-200">
        <div
          v-for="step in PROCESS_STEPS"
          :key="step.number"
          class="relative bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3"
        >
          <!-- Timeline Node -->
          <div
            class="absolute -left-9 top-6 w-6 h-6 rounded-full bg-white border-4 border-slate-900 shadow-xs flex items-center justify-center"
          />

          <div class="flex items-center justify-between">
            <span
              class="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-900 text-white"
            >
              STEP {{ step.number }}
            </span>
            <span class="text-xs text-slate-400 font-medium uppercase">
              Phase {{ step.number }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-slate-900">
            {{ step.title }}
          </h3>

          <p class="text-sm text-slate-600 leading-relaxed">
            {{ step.description }}
          </p>

          <div class="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
            <span
              v-for="(deliv, idx) in step.deliverables"
              :key="idx"
              class="px-2.5 py-1 rounded-md text-xs bg-slate-100 text-slate-700"
            >
              {{ deliv }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
