<script setup lang="ts">
import { ref } from 'vue';
import { TESTIMONIALS } from '@/data/portfolioData';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { Quote } from 'lucide-vue-next';

const sectionRef = ref<HTMLElement | null>(null);
const { isReducedMotion } = useReducedMotion();

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  const header = container.querySelector('.testimonials-header');
  const cards = container.querySelectorAll('.testimonial-card');

  if (header) {
    tl.fromTo(header, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' });
  }
  if (cards.length > 0) {
    tl.fromTo(
      cards,
      { y: 28, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    );
  }
});
</script>

<template>
  <section
    id="testimonials"
    ref="sectionRef"
    class="py-24 relative z-10"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="testimonials-header max-w-3xl mb-16">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-8 h-0.5 bg-linear-to-r from-purple-400 to-indigo-400 rounded-full" />
          <p class="text-xs font-bold uppercase tracking-widest text-purple-600">
            COLLABORATION & TRUST
          </p>
        </div>
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider text-ink-primary leading-tight"
        >
          What People Say
        </h2>
        <p class="mt-4 text-base sm:text-lg text-ink-secondary">
          Reflections from engineering collaborators, product leaders, and architecture peers.
        </p>
      </div>

      <!-- Testimonial Cards 3-Column Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div
          v-for="item in TESTIMONIALS"
          :key="item.id"
          class="testimonial-card bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-7 shadow-md shadow-purple-950/5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <!-- Quote Content -->
          <div class="space-y-4">
            <div
              class="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs"
            >
              <Quote class="w-5 h-5" />
            </div>

            <p class="text-sm sm:text-base text-ink-primary/90 leading-relaxed font-normal italic">
              "{{ item.quote }}"
            </p>
          </div>

          <!-- Author Info -->
          <div class="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3.5">
            <img
              :src="item.avatar"
              :alt="item.author"
              class="w-11 h-11 rounded-full object-cover border border-purple-200 shadow-xs"
              loading="lazy"
            />
            <div class="flex flex-col">
              <span class="text-sm font-bold text-ink-primary">
                {{ item.author }}
              </span>
              <span class="text-xs text-ink-secondary">
                {{ item.role }} ·
                <span class="text-purple-600 font-medium">{{ item.company }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
