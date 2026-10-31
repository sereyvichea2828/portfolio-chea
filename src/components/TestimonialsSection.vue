<script setup lang="ts">
import { ref } from 'vue';
import { TESTIMONIALS } from '@/data/portfolioData';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { Quote } from 'lucide-vue-next';

const sectionRef = ref<HTMLElement | null>(null);

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  const header = container.querySelector('.testimonials-header');
  const cards = container.querySelectorAll('.testimonial-card');

  if (header) {
    tl.fromTo(
      header,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', clearProps: 'transform,willChange' }
    );
  }
  if (cards.length > 0) {
    tl.fromTo(
      cards,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,willChange' },
      '-=0.35'
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
          <span class="w-8 h-0.5 bg-linear-to-r from-emerald-500 to-indigo-500 rounded-full" />
          <p class="text-xs font-bold uppercase tracking-wider text-slate-500">
            កិច្ចសហការ និងទំនុកចិត្ត
          </p>
        </div>
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
        >
          មតិយោបល់ពីដៃគូការងារ
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          ការឆ្លុះបញ្ចាំងពីសហការីវិស្វកម្ម ថ្នាក់ដឹកនាំផលិតផល និងក្រុមការងារបច្ចេកវិទ្យា។
        </p>
      </div>

      <!-- Testimonial Cards 3-Column Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div
          v-for="item in TESTIMONIALS"
          :key="item.id"
          class="testimonial-card bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
        >
          <!-- Quote Content -->
          <div class="space-y-4">
            <div
              class="w-10 h-10 rounded-xl bg-slate-100 text-indigo-600 flex items-center justify-center border border-slate-200"
            >
              <Quote class="w-5 h-5" />
            </div>

            <p class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal italic">
              "{{ item.quote }}"
            </p>
          </div>

          <!-- Author Info -->
          <div class="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3.5">
            <img
              :src="item.avatar"
              :alt="item.author"
              class="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-xs"
              loading="lazy"
            />
            <div class="flex flex-col">
              <span class="text-sm font-bold text-slate-900">
                {{ item.author }}
              </span>
              <span class="text-xs text-slate-500">
                {{ item.role }} ·
                <span class="text-indigo-600 font-medium">{{ item.company }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
