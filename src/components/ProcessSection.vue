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
      <div class="process-header max-w-3xl mb-16">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-8 h-0.5 bg-linear-to-r from-purple-400 to-indigo-400 rounded-full" />
          <p class="text-xs font-bold uppercase tracking-widest text-purple-600">
            WORKFLOW & METHODOLOGY
          </p>
        </div>
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider text-ink-primary leading-tight"
        >
          My Development Process
        </h2>
        <p class="mt-4 text-base sm:text-lg text-ink-secondary">
          A disciplined five-step progression engineered to eliminate ambiguity and deliver
          resilient software.
        </p>
      </div>

      <!-- Process Steps Container -->
      <!-- Desktop: 5 horizontal connected cards using pure CSS hover to eliminate stuck states -->
      <div class="hidden lg:grid grid-cols-5 gap-4 relative">
        <div
          v-for="step in PROCESS_STEPS"
          :key="step.number"
          tabindex="0"
          class="process-card relative z-10 group bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-sm shadow-purple-950/5 hover:border-purple-300 hover:ring-2 hover:ring-purple-100 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 focus-visible:border-purple-300 focus-visible:ring-2 focus-visible:ring-purple-100 focus-visible:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-default outline-none"
        >
          <div class="space-y-4">
            <!-- Step Number Pill -->
            <div class="flex items-center justify-between">
              <span
                class="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center font-mono shadow-xs"
              >
                {{ step.number }}
              </span>
              <span class="text-xs text-ink-secondary uppercase tracking-wider font-semibold">
                Phase
              </span>
            </div>

            <!-- Title & Summary -->
            <div>
              <h3
                class="text-base font-bold text-ink-primary tracking-tight group-hover:text-purple-700 transition-colors"
              >
                {{ step.title }}
              </h3>
              <p class="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                {{ step.summary }}
              </p>
            </div>
          </div>

          <!-- Deliverables list -->
          <div class="mt-5 pt-3 border-t border-slate-100 space-y-1.5">
            <div
              v-for="(deliv, idx) in step.deliverables"
              :key="idx"
              class="flex items-center gap-1.5 text-xs text-ink-primary/75"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
              <span class="truncate">{{ deliv }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile & Tablet: Vertical Timeline -->
      <div class="lg:hidden space-y-6 relative pl-6 border-l-2 border-purple-200">
        <div
          v-for="step in PROCESS_STEPS"
          :key="step.number"
          class="relative bg-white/75 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm shadow-purple-950/5 space-y-3"
        >
          <!-- Timeline Node -->
          <div
            class="absolute -left-9 top-6 w-6 h-6 rounded-full bg-white border-4 border-purple-500 shadow-xs flex items-center justify-center"
          />

          <div class="flex items-center justify-between">
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-700"
            >
              STEP {{ step.number }}
            </span>
            <span class="text-xs text-ink-secondary font-medium uppercase">
              Phase {{ step.number }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-ink-primary">
            {{ step.title }}
          </h3>

          <p class="text-sm text-ink-secondary leading-relaxed">
            {{ step.description }}
          </p>

          <div class="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
            <span
              v-for="(deliv, idx) in step.deliverables"
              :key="idx"
              class="px-2.5 py-1 rounded-full text-xs bg-purple-50 text-purple-700"
            >
              {{ deliv }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
