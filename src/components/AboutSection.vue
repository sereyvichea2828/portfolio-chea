<script setup lang="ts">
import { ref } from 'vue';
import { ABOUT_CONTENT } from '@/data/portfolioData';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { useCertificateModal } from '@/composables/useCertificateModal';
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'navigate', sectionId: string): void;
}>();

const sectionRef = ref<HTMLElement | null>(null);
const { isReducedMotion } = useReducedMotion();

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  if (isReducedMotion.value) {
    const all = container.querySelectorAll('.about-header, .about-story, .about-body');
    all.forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
    return;
  }

  const header = container.querySelector('.about-header');
  const story = container.querySelector('.about-story');
  const body = container.querySelector('.about-body');

  if (header) {
    tl.fromTo(
      header,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
    );
  }

  if (story) {
    tl.fromTo(
      story,
      { y: 16, opacity: 0 },
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

  if (body) {
    tl.fromTo(
      body,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
      '-=0.35',
    );
  }
});

const handleNavigate = (targetId: string): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  emit('navigate', targetId);
};

const { openCertificate } = useCertificateModal();

const handleOpenCertificate = (): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  openCertificate();
};
</script>

<template>
  <section id="about" ref="sectionRef" class="py-16 sm:py-20 lg:py-24 relative z-10 scroll-mt-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 1. Section Header (Standardized Editorial Hierarchy) -->
      <div class="about-header max-w-3xl mb-12 sm:mb-16 space-y-2.5">
        <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
          {{ ABOUT_CONTENT.sectionTag }}
        </p>
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-extrabold text-slate-900 leading-[1.3] font-heading tracking-normal"
        >
          {{ ABOUT_CONTENT.headline }}
        </h2>
        <p
          v-if="ABOUT_CONTENT.subheadline"
          class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal"
        >
          {{ ABOUT_CONTENT.subheadline }}
        </p>
      </div>

      <!-- 2. Personal Story (Core Focus: Completely Unboxed, Typography-Led) -->
      <div class="about-story max-w-4xl mb-16 sm:mb-20 space-y-6">
        <p
          class="text-lg sm:text-xl lg:text-2xl font-medium text-slate-900 leading-relaxed font-heading"
        >
          {{ ABOUT_CONTENT.leadBio }}
        </p>

        <div class="space-y-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          <p v-for="(paragraph, pIndex) in ABOUT_CONTENT.storyParagraphs" :key="pIndex">
            {{ paragraph }}
          </p>
        </div>

        <p class="text-sm sm:text-base text-slate-500 leading-relaxed pt-2">
          {{ ABOUT_CONTENT.credentialNote }}
          <button
            type="button"
            class="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1 cursor-pointer ml-1.5 underline underline-offset-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 rounded-xs"
            @click="handleOpenCertificate"
          >
            <span>មើលវិញ្ញាបនបត្រ</span>
            <ArrowUpRight class="w-3.5 h-3.5" />
          </button>
        </p>
      </div>

      <!-- 3. Two Editorial Chapters (Unboxed, Pure Spacing & Typography) -->
      <div class="about-body max-w-4xl space-y-16 sm:space-y-20">
        <!-- Chapter A: Knowledge & Experience -->
        <div class="space-y-8 sm:space-y-10">
          <div class="space-y-1.5">
            <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
              ចំណេះដឹង និងការអនុវត្ត
            </p>
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              អ្វីដែលខ្ញុំបានហាត់រៀន និងអាចកសាងបាន
            </h3>
          </div>

          <!-- Clean 2-column editorial text layout (No cards, no boxes, no numbers, no dots) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 sm:gap-y-10">
            <div v-for="item in ABOUT_CONTENT.capabilities" :key="item.id" class="space-y-2">
              <h4 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
                {{ item.title }}
              </h4>
              <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Chapter B: Working Principles -->
        <div class="space-y-8 sm:space-y-10">
          <div class="space-y-1.5">
            <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
              របៀបធ្វើការ
            </p>
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              គោលការណ៍ការងារដែលខ្ញុំប្រកាន់ខ្ជាប់
            </h3>
          </div>

          <!-- Natural sequence of concise statements (No numbers, no dots, no table lines) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7 sm:gap-y-8">
            <div
              v-for="principle in ABOUT_CONTENT.principles"
              :key="principle.id"
              class="space-y-1.5"
            >
              <h4 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
                {{ principle.title }}
              </h4>
              <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {{ principle.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Chapter C: Restrained, Understated Navigation Actions -->
        <div
          class="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 text-sm sm:text-base"
        >
          <button
            type="button"
            class="font-semibold text-slate-900 hover:text-slate-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            @click="handleNavigate('#contact')"
          >
            <span>ពិភាក្សាការងារជាមួយខ្ញុំ</span>
            <ArrowRight class="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
