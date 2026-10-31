<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { HERO_CONTENT, CONTACT_INFO } from '@/data/portfolioData';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { ArrowDown, FileText, Github, Linkedin, Mail, ChevronDown } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'navigate', sectionId: string): void;
  (e: 'open-resume'): void;
}>();

const { isReducedMotion } = useReducedMotion();
const sectionRef = ref<HTMLElement | null>(null);

let gsapCtx: gsap.Context | null = null;

onMounted(() => {
  if (typeof window !== 'undefined' && sectionRef.value) {
    gsapCtx = gsap.context(() => {
      if (isReducedMotion.value) {
        gsap.set(
          [
            '.hero-eyebrow',
            '.hero-headline-line',
            '.hero-identity',
            '.hero-description',
            '.hero-action-item',
            '.hero-portrait',
            '.hero-scroll',
          ],
          { opacity: 1, y: 0 },
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Eyebrow label appears with subtle fade and upward movement
      tl.fromTo(
        '.hero-eyebrow',
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.08, clearProps: 'transform,willChange' },
      );

      // 2. Main Khmer headline reveals smoothly with restrained line-by-line entrance
      tl.fromTo(
        '.hero-headline-line',
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform,willChange',
        },
        '-=0.35',
      );

      // 3. Personal name and professional title appear naturally
      tl.fromTo(
        '.hero-identity',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, clearProps: 'transform,willChange' },
        '-=0.35',
      );

      // 4. Supporting description follows
      tl.fromTo(
        '.hero-description',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, clearProps: 'transform,willChange' },
        '-=0.35',
      );

      // 5. Action buttons appear together with a short stagger
      tl.fromTo(
        '.hero-action-item',
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
          clearProps: 'transform,willChange',
        },
        '-=0.3',
      );

      // 6. Portrait enters with subtle fade and gentle upward movement (preserving proportions)
      tl.fromTo(
        '.hero-portrait',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', clearProps: 'transform,willChange' },
        0.2,
      );

      // 7. Scroll indicator appears last
      tl.fromTo(
        '.hero-scroll',
        { opacity: 0, y: -6 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', clearProps: 'transform,willChange' },
        '-=0.2',
      );
    }, sectionRef.value);
  }
});

onUnmounted(() => {
  if (gsapCtx) {
    gsapCtx.revert();
    gsapCtx = null;
  }
});

const handlePrimaryClick = (): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  emit('navigate', '#projects');
};

const handleSecondaryClick = (): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  emit('open-resume');
};

const handleScrollIndicatorClick = (): void => {
  emit('navigate', '#about');
};
</script>

<template>
  <section
    id="home"
    ref="sectionRef"
    class="relative min-h-dvh flex flex-col justify-between bg-transparent pt-16 sm:pt-20 lg:pt-20 pb-3 sm:pb-4 text-slate-900"
  >
    <!-- Center Main Content: Balanced Two-Column Hero Composition -->
    <div
      class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-3 sm:py-6 lg:py-6 relative z-10 flex-1 flex flex-col justify-center"
    >
      <div
        class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 xl:gap-16 items-center"
      >
        <!-- Left Column: Editorial Introduction, Identity, & Direct Actions (Order 2 on mobile, Order 1 on Desktop) -->
        <div
          class="order-2 md:order-1 md:col-span-7 flex flex-col space-y-3.5 sm:space-y-4 lg:space-y-5"
        >
          <!-- 1. Eyebrow Label -->
          <div class="hero-eyebrow flex items-center gap-2">
            <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
              {{ HERO_CONTENT.eyebrow }}
            </p>
          </div>

          <!-- 2. Bold Three-Line Khmer Headline (One Color Only: Slate-900) -->
          <h1
            class="hero-headline text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold text-slate-900 leading-[1.24] font-heading tracking-tight max-w-xl"
          >
            <span class="block"><span class="hero-headline-line block">បង្កើតគេហទំព័រទំនើប</span></span>
            <span class="block"><span class="hero-headline-line block">និងដំណោះស្រាយឌីជីថល</span></span>
            <span class="block"><span class="hero-headline-line block">ប្រកបដោយប្រសិទ្ធភាព</span></span>
          </h1>

          <!-- 3. Identity Row on a Clean Baseline -->
          <div class="hero-identity flex items-center gap-3 text-slate-900 pt-0.5">
            <span class="text-lg sm:text-xl font-bold font-heading text-slate-900">
              {{ HERO_CONTENT.khmerName }}
            </span>
            <span class="text-slate-300 select-none text-base font-light" aria-hidden="true"
              >/</span
            >
            <span class="text-xs sm:text-sm font-medium text-slate-600">
              {{ HERO_CONTENT.title }}
            </span>
          </div>

          <!-- 4. Readable Supporting Statement -->
          <p
            class="hero-description text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal text-pretty"
          >
            {{ HERO_CONTENT.supportingStatement }}
          </p>

          <!-- 5. Clear Action Buttons & Consistent Social Links (No Filter Tabs) -->
          <div class="hero-actions flex flex-wrap items-center gap-3 pt-1.5 sm:pt-2">
            <!-- Primary CTA: Projects -->
            <button
              type="button"
              class="hero-action-item inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer min-h-11"
              @click="handlePrimaryClick"
            >
              <span>{{ HERO_CONTENT.primaryCta }}</span>
              <ArrowDown class="w-4 h-4" />
            </button>

            <!-- Secondary CTA: CV -->
            <button
              type="button"
              class="hero-action-item inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-semibold text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer min-h-11"
              @click="handleSecondaryClick"
            >
              <FileText class="w-4 h-4 text-slate-500" />
              <span>{{ HERO_CONTENT.secondaryCta }}</span>
            </button>

            <!-- Integrated Social Links -->
            <div class="hero-action-item flex items-center gap-2 sm:ml-2">
              <a
                href="https://github.com/sereyvichea2828"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-lg bg-white border border-slate-200/80 hover:border-slate-400 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="GitHub Profile"
              >
                <Github class="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/try-sereyvichea-8a890a436/"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-lg bg-white border border-slate-200/80 hover:border-slate-400 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="LinkedIn Profile"
              >
                <Linkedin class="w-4 h-4" />
              </a>
              <a
                :href="'mailto:' + CONTACT_INFO.email"
                class="w-10 h-10 rounded-lg bg-white border border-slate-200/80 hover:border-slate-400 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Direct Email"
              >
                <Mail class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <!-- Right Column: Prominent Developer Portrait (Order 1 on mobile, Order 2 on Desktop) -->
        <div
          class="hero-portrait order-1 md:order-2 md:col-span-5 flex items-center justify-center md:justify-end w-full"
        >
          <!-- Full width on phone, proportional on tablet and desktop -->
          <div class="w-full max-w-full sm:max-w-md md:max-w-82.5 lg:max-w-90 xl:max-w-95">
            <div
              class="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs select-none bg-slate-900"
              style="aspect-ratio: 1792 / 2400"
            >
              <img
                :src="HERO_CONTENT.portraitImage"
                :alt="HERO_CONTENT.portraitAlt"
                class="w-full h-full object-cover block filter contrast-[1.02]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Centered Scroll Down Indicator (Line 242: Guaranteed Fully Visible on Viewport) -->
    <div
      class="hero-scroll relative z-10 w-full text-center flex justify-center shrink-0 pt-1 pb-3 sm:pb-4"
    >
      <button
        type="button"
        class="inline-flex flex-col items-center gap-1 text-xs font-medium tracking-wide text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-lg px-3 py-1.5 min-h-11 justify-center"
        @click="handleScrollIndicatorClick"
        aria-label="រំកិលទៅកាន់ផ្នែកអំពីខ្ញុំ"
      >
        <span class="text-xs sm:text-sm font-medium leading-relaxed select-none"
          >ស្វែងយល់បន្ថែម</span
        >
        <ChevronDown
          class="w-4 h-4 animate-bounce text-slate-500 group-hover:text-slate-900 transition-colors shrink-0"
        />
      </button>
    </div>
  </section>
</template>
