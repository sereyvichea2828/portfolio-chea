<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { HERO_CONTENT } from '@/data/portfolioData';
import { useReducedMotion } from '@/composables/useReducedMotion';

const ThreePearlOrb = defineAsyncComponent(() => import('@/components/ThreePearlOrb.vue'));
import {
  ArrowDown,
  FileText,
  Sparkles,
  MapPin,
  CheckCircle2,
  Code2,
  ShieldCheck,
} from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'navigate', sectionId: string): void;
  (e: 'open-resume'): void;
}>();

const { isReducedMotion } = useReducedMotion();
const isMounted = ref<boolean>(false);
const isEntranceComplete = ref<boolean>(false);
let entranceTimer: number | null = null;

onMounted(() => {
  requestAnimationFrame(() => {
    isMounted.value = true;
  });

  if (isReducedMotion.value) {
    isEntranceComplete.value = true;
  } else {
    entranceTimer = window.setTimeout(() => {
      isEntranceComplete.value = true;
    }, 1100);
  }
});

onUnmounted(() => {
  if (entranceTimer !== null) {
    clearTimeout(entranceTimer);
    entranceTimer = null;
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
    class="relative min-h-screen flex flex-col justify-center pt-20 sm:pt-24 lg:pt-20 pb-8 sm:pb-10 lg:pb-6 overflow-hidden"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
        <!-- Left Column: Introduction & Call to Actions -->
        <div class="lg:col-span-7 flex flex-col space-y-3.5 sm:space-y-4">
          <!-- Availability Pill -->
          <div
            class="flex items-center gap-3"
            :class="[
              isEntranceComplete || isReducedMotion
                ? 'opacity-100 transform-none'
                : [
                    'transition-[transform,opacity] duration-700 ease-out',
                    isMounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-3',
                  ],
            ]"
          >
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-md border border-white text-ink-primary shadow-xs"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{{ HERO_CONTENT.availabilityText }}</span>
            </div>

            <div class="hidden sm:inline-flex items-center gap-1.5 text-xs text-ink-secondary">
              <MapPin class="w-3.5 h-3.5 text-purple-400" />
              <span>Phnom Penh, Cambodia</span>
            </div>
          </div>

          <!-- Eyebrow Tag -->
          <div
            class="flex items-center gap-2.5"
            :class="[
              isEntranceComplete || isReducedMotion
                ? 'opacity-100 transform-none'
                : [
                    'transition-[transform,opacity] duration-700 ease-out delay-75',
                    isMounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-3',
                  ],
            ]"
          >
            <span class="w-7 h-0.5 bg-linear-to-r from-purple-500 to-indigo-500 rounded-full" />
            <p class="text-xs font-bold uppercase tracking-widest text-purple-600">
              {{ HERO_CONTENT.eyebrow }}
            </p>
          </div>

          <!-- Headline -->
          <div
            class="space-y-2"
            :class="[
              isEntranceComplete || isReducedMotion
                ? 'opacity-100 transform-none'
                : [
                    'transition-[transform,opacity] duration-700 ease-out delay-150',
                    isMounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4',
                  ],
            ]"
          >
            <h1
              class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider text-ink-primary leading-tight"
            >
              Hi, I'm
              <span
                class="bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
              >
                {{ HERO_CONTENT.name }}
              </span>
            </h1>
            <div class="flex flex-wrap items-center gap-2.5 pt-0.5">
              <h2 class="text-lg sm:text-xl lg:text-xl font-bold text-ink-primary">
                {{ HERO_CONTENT.title }}
              </h2>
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400 hidden sm:inline-block" />
              <span
                class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100/80 text-purple-800 border border-purple-200/60 shadow-xs"
              >
                Vue 3 • Node.js • Cloud Architecture
              </span>
            </div>
          </div>

          <!-- Supporting Statement -->
          <p
            class="text-sm sm:text-base text-ink-secondary max-w-xl leading-relaxed"
            :class="[
              isEntranceComplete || isReducedMotion
                ? 'opacity-100 transform-none'
                : [
                    'transition-[transform,opacity] duration-700 ease-out delay-200',
                    isMounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4',
                  ],
            ]"
          >
            {{ HERO_CONTENT.supportingStatement }}
          </p>

          <!-- Core Value Chips -->
          <div
            class="flex flex-wrap gap-2 pt-0.5"
            :class="[
              isEntranceComplete || isReducedMotion
                ? 'opacity-100 transform-none'
                : [
                    'transition-[transform,opacity] duration-700 ease-out delay-250',
                    isMounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4',
                  ],
            ]"
          >
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/80 border border-white text-ink-primary shadow-xs"
            >
              <Code2 class="w-3.5 h-3.5 text-purple-500" />
              Vue 3 & TypeScript
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/80 border border-white text-ink-primary shadow-xs"
            >
              <ShieldCheck class="w-3.5 h-3.5 text-indigo-500" />
              Distributed Node Services
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/80 border border-white text-ink-primary shadow-xs"
            >
              <Sparkles class="w-3.5 h-3.5 text-cyan-500" />
              Interactive 3D Three.js
            </span>
          </div>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            :class="[
              isEntranceComplete || isReducedMotion
                ? 'opacity-100 transform-none'
                : [
                    'transition-[transform,opacity] duration-700 ease-out delay-300',
                    isMounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4',
                  ],
            ]"
          >
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-purple-500 via-indigo-600 to-purple-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 active:scale-98 cursor-pointer min-h-11"
              @click="handlePrimaryClick"
            >
              <span>{{ HERO_CONTENT.primaryCta }}</span>
              <ArrowDown class="w-4 h-4" />
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/80 hover:bg-white text-ink-primary border border-white/90 font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm shadow-purple-950/5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 active:scale-98 cursor-pointer min-h-11"
              @click="handleSecondaryClick"
            >
              <FileText class="w-4 h-4 text-purple-500" />
              <span>{{ HERO_CONTENT.secondaryCta }}</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Developer Portrait & Floating Pearl Glass Panels -->
        <div
          class="lg:col-span-5 relative flex items-center justify-center"
          :class="[
            isEntranceComplete || isReducedMotion
              ? 'opacity-100 transform-none'
              : [
                  'transition-[transform,opacity] duration-1000 ease-out delay-150',
                  isMounted ? 'opacity-100 transform-none' : 'opacity-0 scale-98',
                ],
          ]"
        >
          <!-- Portrait & Floating Elements Container -->
          <div class="relative w-full max-w-xs lg:max-w-xs xl:max-w-sm mx-auto">
            <!-- Crisp Studio Pearl Frame with Liquid Wave Hover Animation -->
            <div
              data-portrait
              class="relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-xl shadow-purple-950/8 p-1.5 sm:p-2 cursor-pointer group transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-purple-500/15 hover:border-purple-300/80 hover:-translate-y-1"
            >
              <div class="relative overflow-hidden rounded-2xl">
                <img
                  :src="HERO_CONTENT.portraitImage"
                  :alt="HERO_CONTENT.portraitAlt"
                  class="w-full h-auto object-cover object-center aspect-4/5 rounded-2xl transition-all duration-700 ease-out group-hover:scale-104"
                  loading="eager"
                />

                <!-- Interactive Liquid Wave Surface Sheen on Hover -->
                <div
                  class="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                  aria-hidden="true"
                >
                  <div
                    class="absolute inset-0 bg-linear-to-tr from-purple-500/10 via-transparent to-cyan-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div class="photo-wave-sheen" />
                </div>
              </div>
            </div>

            <!-- Floating 3D Pearl Glass Orb -->
            <div class="absolute -top-6 -right-6 z-20 pointer-events-none hidden sm:block">
              <ThreePearlOrb size-class="w-24 h-24 sm:w-28 sm:h-28" />
            </div>

            <!-- Floating Info Card: 4+ Years Experience (Top Left) -->
            <div
              class="absolute -top-3 -left-4 sm:-left-5 bg-white/90 backdrop-blur-xl border border-white rounded-2xl px-3.5 py-2 shadow-lg shadow-purple-950/5 hidden sm:flex items-center gap-2.5"
            >
              <div
                class="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs"
              >
                4+
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-bold text-ink-primary">Years Experience</span>
                <span class="text-xs text-ink-secondary">Production Apps</span>
              </div>
            </div>

            <!-- Floating Info Card: 28+ Projects Delivered (Bottom Left) -->
            <div
              class="absolute -bottom-3 -left-3 sm:-left-4 bg-white/90 backdrop-blur-xl border border-white rounded-2xl px-3.5 py-2.5 shadow-xl shadow-purple-950/8 flex items-center gap-2.5 max-w-xs"
            >
              <div
                class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs"
              >
                <CheckCircle2 class="w-4 h-4" />
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-bold text-ink-primary">28+ Projects Delivered</span>
                <span class="text-xs text-ink-secondary">High-Uptime Systems</span>
              </div>
            </div>

            <!-- Floating Info Badge: 99.9% Uptime (Bottom Right) -->
            <div
              class="absolute -bottom-2 -right-2 sm:-right-3 bg-white/90 backdrop-blur-xl border border-white rounded-2xl px-3 py-1.5 shadow-lg shadow-purple-950/5 hidden sm:flex items-center gap-2"
            >
              <span class="w-2 h-2 rounded-full bg-cyan-400" />
              <span class="text-xs font-semibold text-ink-primary">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.photo-wave-sheen {
  position: absolute;
  inset: -60%;
  background: linear-gradient(
    115deg,
    transparent 20%,
    rgba(255, 255, 255, 0) 35%,
    rgba(255, 255, 255, 0.45) 48%,
    rgba(192, 132, 252, 0.35) 52%,
    rgba(56, 189, 248, 0.3) 56%,
    rgba(255, 255, 255, 0) 65%,
    transparent 80%
  );
  transform: translateX(-100%) rotate(15deg);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  mix-blend-mode: overlay;
}

.group:hover .photo-wave-sheen {
  opacity: 1;
  animation: sheenWaveSlide 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes sheenWaveSlide {
  0% {
    transform: translateX(-100%) rotate(15deg);
  }
  100% {
    transform: translateX(100%) rotate(15deg);
  }
}
</style>
