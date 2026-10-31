<script setup lang="ts">
import { ref } from 'vue';
import { ABOUT_CONTENT } from '@/data/portfolioData';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { ArrowRight } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'navigate', sectionId: string): void;
}>();

const sectionRef = ref<HTMLElement | null>(null);
const { isReducedMotion } = useReducedMotion();

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  if (isReducedMotion.value) {
    const all = container.querySelectorAll(
      '.about-header, .about-story, .about-capabilities, .about-principles, .about-actions',
    );
    all.forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
    return;
  }

  const elements = [
    container.querySelector('.about-header'),
    container.querySelector('.about-story'),
    container.querySelector('.about-capabilities'),
    container.querySelector('.about-principles'),
    container.querySelector('.about-actions'),
  ].filter(Boolean);

  if (elements.length > 0) {
    tl.fromTo(
      elements,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
    );
  }
});

const handleNavigate = (targetId: string): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  emit('navigate', targetId);
};
</script>

<template>
  <section id="about" ref="sectionRef" class="py-14 sm:py-20 lg:py-24 relative z-10 scroll-mt-24">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 1. Editorial Section Header -->
      <div class="about-header max-w-3xl mb-12 sm:mb-16 space-y-3">
        <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
          {{ ABOUT_CONTENT.sectionTag }}
        </p>
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug sm:leading-snug font-heading tracking-normal"
        >
          {{ ABOUT_CONTENT.headline }}
        </h2>
      </div>

      <!-- 2. Personal Story & Identity (Authentic Narrative) -->
      <div class="about-story mb-14 sm:mb-20">
        <div class="bg-white/80 border border-slate-200/90 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xs space-y-6">
          <!-- Lead Introduction -->
          <div class="border-l-2 border-slate-900 pl-4 sm:pl-5">
            <p class="text-base sm:text-lg lg:text-xl font-medium text-slate-900 leading-relaxed font-heading">
              {{ ABOUT_CONTENT.leadBio }}
            </p>
          </div>

          <!-- Extended Story Paragraphs -->
          <div class="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            <p v-for="(paragraph, pIndex) in ABOUT_CONTENT.storyParagraphs" :key="pIndex">
              {{ paragraph }}
            </p>
          </div>

          <!-- Genuine Credential & Study Note -->
          <div class="pt-4 border-t border-slate-200/80 flex items-start gap-3 text-xs sm:text-sm text-slate-500">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" aria-hidden="true" />
            <p class="leading-relaxed">
              {{ ABOUT_CONTENT.credentialNote }}
            </p>
          </div>
        </div>
      </div>

      <!-- 3. What I Have Learned & Can Build (Core Capabilities in Everyday Khmer) -->
      <div class="about-capabilities mb-14 sm:mb-20 space-y-6 sm:space-y-8">
        <div class="space-y-1.5">
          <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
            ចំណេះដឹង និងបទពិសោធន៍
          </p>
          <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-heading">
            អ្វីដែលខ្ញុំបានហាត់រៀន និងអាចកសាងបាន
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div
            v-for="item in ABOUT_CONTENT.capabilities"
            :key="item.id"
            class="bg-white/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
          >
            <div class="space-y-2.5">
              <span class="text-xs font-bold text-indigo-600 tracking-wider">
                {{ item.number }}
              </span>
              <h4 class="text-base sm:text-lg font-bold text-slate-900">
                {{ item.title }}
              </h4>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. My Working Approach (Genuine Principles) -->
      <div class="about-principles mb-12 sm:mb-16 space-y-6 sm:space-y-8">
        <div class="space-y-1.5">
          <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
            របៀបធ្វើការ
          </p>
          <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-heading">
            គោលការណ៍ការងារដែលខ្ញុំប្រកាន់ខ្ជាប់
          </h3>
        </div>

        <div class="border-t border-slate-200/80 divide-y divide-slate-200/80">
          <div
            v-for="principle in ABOUT_CONTENT.principles"
            :key="principle.id"
            class="py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline group"
          >
            <div class="sm:col-span-1">
              <span class="text-xs sm:text-sm font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                {{ principle.number }}
              </span>
            </div>
            <div class="sm:col-span-4">
              <h4 class="text-sm sm:text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                {{ principle.title }}
              </h4>
            </div>
            <div class="sm:col-span-7">
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {{ principle.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Purposeful Actions -->
      <div class="about-actions pt-8 border-t border-slate-200/80 flex flex-wrap items-center gap-3.5">
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all duration-200 cursor-pointer min-h-11 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          @click="handleNavigate('#projects')"
        >
          <span>មើលគម្រោងស្នាដៃដែលខ្ញុំបានបង្កើត</span>
          <ArrowRight class="w-4 h-4" />
        </button>

        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-800 border border-slate-200/90 hover:bg-slate-50 active:bg-slate-100 font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-200 cursor-pointer min-h-11 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          @click="handleNavigate('#contact')"
        >
          <span>ពិភាក្សាការងារជាមួយខ្ញុំ</span>
        </button>
      </div>
    </div>
  </section>
</template>
