<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent, shallowRef } from 'vue';
import { gsap } from 'gsap';
import { HERO_CONTENT, CONTACT_INFO } from '@/data/portfolioData';
import { useReducedMotion } from '@/composables/useReducedMotion';
import {
  ArrowDown,
  FileText,
  MapPin,
  Terminal,
  Layers,
  Cpu,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
} from 'lucide-vue-next';

const ThreePearlOrb = defineAsyncComponent(() => import('@/components/ThreePearlOrb.vue'));

const emit = defineEmits<{
  (e: 'navigate', sectionId: string): void;
  (e: 'open-resume'): void;
}>();

const { isReducedMotion } = useReducedMotion();
const sectionRef = ref<HTMLElement | null>(null);
const portraitCardRef = ref<HTMLDivElement | null>(null);

let gsapCtx: gsap.Context | null = null;
let tiltRafId: number | null = null;

// Active architecture inspector tab
type ArchTabKey = 'frontend' | 'backend' | 'architecture';
const activeTab = ref<ArchTabKey>('frontend');

const architectureTabs = [
  {
    id: 'frontend' as const,
    label: 'Frontend',
    icon: Layers,
    headline: 'Reactive Vue 3 & Hardware-Accelerated UI',
    specs: [
      'Strict <script setup lang="ts"> Composition API contracts',
      'GSAP orchestrated scroll & micro-physics transitions',
      'Custom Three.js WebGL shaders & 120fps lock',
    ],
    metric: '60/120 FPS Target',
  },
  {
    id: 'backend' as const,
    label: 'Backend',
    icon: Cpu,
    headline: 'High-Concurrency Node.js & Distributed Data',
    specs: [
      'Event-driven REST microservices with JWT & role guards',
      'PostgreSQL relational modeling & Redis memory cache',
      'Fast-fail circuit breakers & stream data processing',
    ],
    metric: '<50ms Fast-Fail',
  },
  {
    id: 'architecture' as const,
    label: 'System Design',
    icon: Terminal,
    headline: 'Fault-Tolerant Enterprise Engineering',
    specs: [
      'Anti-proxy Haversine GPS geofence validation',
      'Atomic database migrations & zero-downtime deployments',
      'End-to-end containerized CI/CD release pipelines',
    ],
    metric: '99.9% Uptime SLA',
  },
] as const;

// Interactive 3D Card Tilt state
let targetTiltX = 0;
let targetTiltY = 0;
let currentTiltX = 0;
let currentTiltY = 0;
let isHoveringCard = false;

const handleCardPointerMove = (e: MouseEvent): void => {
  if (isReducedMotion.value || !portraitCardRef.value) return;
  const rect = portraitCardRef.value.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;

  targetTiltY = x * 14; // max 14deg tilt on Y
  targetTiltX = -y * 12; // max 12deg tilt on X
  isHoveringCard = true;
};

const handleCardPointerLeave = (): void => {
  targetTiltX = 0;
  targetTiltY = 0;
  isHoveringCard = false;
};

const updateTiltPhysics = (): void => {
  // Smooth damped spring interpolation
  currentTiltX += (targetTiltX - currentTiltX) * 0.12;
  currentTiltY += (targetTiltY - currentTiltY) * 0.12;

  if (portraitCardRef.value) {
    if (Math.abs(currentTiltX) > 0.01 || Math.abs(currentTiltY) > 0.01 || isHoveringCard) {
      portraitCardRef.value.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    } else {
      portraitCardRef.value.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  }

  tiltRafId = requestAnimationFrame(updateTiltPhysics);
};

onMounted(() => {
  // Start tilt animation frame
  if (!isReducedMotion.value) {
    tiltRafId = requestAnimationFrame(updateTiltPhysics);
  }

  // Orchestrate Cinematic Entrance on Reload / Page Visit with GSAP
  if (typeof window !== 'undefined' && sectionRef.value) {
    gsapCtx = gsap.context(() => {
      if (isReducedMotion.value) {
        // Reduced motion: instant display
        gsap.set(
          [
            '.hero-status-pill',
            '.hero-headline-item',
            '.hero-subtext',
            '.hero-cta-group',
            '.hero-social-strip',
            '.hero-portrait-stage',
            '.hero-inspector',
            '.hero-scroll-indicator',
          ],
          { opacity: 1, y: 0, scale: 1 },
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Availability Status Pill
      tl.fromTo(
        '.hero-status-pill',
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.15 },
      );

      // 2. Headline items staggered reveal
      tl.fromTo(
        '.hero-headline-item',
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.09 },
        '-=0.45',
      );

      // 3. Subtext statement
      tl.fromTo(
        '.hero-subtext',
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 },
        '-=0.5',
      );

      // 4. CTAs and social buttons
      tl.fromTo(
        '.hero-cta-group',
        { y: 18, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.65 },
        '-=0.45',
      );

      tl.fromTo(
        '.hero-social-strip',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.35',
      );

      // 5. Portrait Stage with scale & fade
      tl.fromTo(
        '.hero-portrait-stage',
        { opacity: 0, scale: 0.94, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.95, ease: 'power2.out' },
        0.3,
      );

      // 6. Interactive Inspector Widget
      tl.fromTo(
        '.hero-inspector',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.4',
      );

      // 7. Scroll down indicator
      tl.fromTo(
        '.hero-scroll-indicator',
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.2',
      );
    }, sectionRef.value);
  }
});

onUnmounted(() => {
  if (tiltRafId !== null) {
    cancelAnimationFrame(tiltRafId);
    tiltRafId = null;
  }
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
    class="relative min-h-[100dvh] flex flex-col justify-center pt-24 sm:pt-28 lg:pt-24 pb-12 sm:pb-16 overflow-hidden"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
        <!-- Left Column: Editorial Presentation, Value Proposition & Actions -->
        <div class="lg:col-span-7 flex flex-col space-y-5 sm:space-y-6">
          <!-- Availability Status Pill -->
          <div class="hero-status-pill flex flex-wrap items-center gap-3">
            <div
              class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-800 shadow-xs"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span class="font-medium">{{ HERO_CONTENT.availabilityText }}</span>
            </div>

            <div class="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin class="w-3.5 h-3.5 text-slate-400" />
              <span>Phnom Penh, Cambodia (UTC+7)</span>
            </div>
          </div>

          <!-- Headline Stack: Confident Editorial Typography -->
          <div class="space-y-3">
            <div class="hero-headline-item">
              <p class="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-500">
                Senior Full-Stack Engineer & Architect
              </p>
            </div>

            <h1
              class="hero-headline-item text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]"
            >
              Engineering resilient web applications & digital experiences.
            </h1>

            <div class="hero-headline-item flex items-center gap-3 pt-1">
              <span class="text-base sm:text-lg font-bold text-slate-900">
                Try Sereyvichea
              </span>
              <span class="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span class="text-xs sm:text-sm text-slate-600 font-medium">
                Vue 3 • TypeScript • Node.js • Cloud Architecture
              </span>
            </div>
          </div>

          <!-- Value Statement (Concise, Under 25 Words) -->
          <p
            class="hero-subtext text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal"
          >
            {{ HERO_CONTENT.supportingStatement }}
          </p>

          <!-- Interactive Architectural Spec Preview (Tabs) -->
          <div
            class="hero-inspector bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 max-w-xl"
          >
            <!-- Tab Buttons -->
            <div class="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <button
                v-for="tab in architectureTabs"
                :key="tab.id"
                type="button"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-8"
                :class="[
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70',
                ]"
                @click="activeTab = tab.id"
              >
                <component :is="tab.icon" class="w-3.5 h-3.5" />
                <span>{{ tab.label }}</span>
              </button>

              <div class="ml-auto hidden sm:flex items-center gap-1.5 text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{{ architectureTabs.find((t) => t.id === activeTab)?.metric }}</span>
              </div>
            </div>

            <!-- Active Tab Content -->
            <div class="space-y-2">
              <div
                v-for="tab in architectureTabs"
                v-show="activeTab === tab.id"
                :key="`content-${tab.id}`"
                class="space-y-2 transition-all duration-200"
              >
                <p class="text-xs font-bold text-slate-900 tracking-tight">
                  {{ tab.headline }}
                </p>
                <ul class="space-y-1 text-xs text-slate-600">
                  <li
                    v-for="(spec, i) in tab.specs"
                    :key="i"
                    class="flex items-start gap-2"
                  >
                    <span class="text-slate-400 font-mono">›</span>
                    <span>{{ spec }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- CTAs & Actions Group -->
          <div class="hero-cta-group flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-98 cursor-pointer min-h-11"
              @click="handlePrimaryClick"
            >
              <span>{{ HERO_CONTENT.primaryCta }}</span>
              <ArrowDown class="w-4 h-4" />
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 font-medium text-xs sm:text-sm transition-all duration-200 shadow-xs hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-98 cursor-pointer min-h-11"
              @click="handleSecondaryClick"
            >
              <FileText class="w-4 h-4 text-slate-600" />
              <span>{{ HERO_CONTENT.secondaryCta }}</span>
            </button>
          </div>

          <!-- Quick Social Links Strip -->
          <div class="hero-social-strip flex items-center gap-3 pt-1 text-slate-500">
            <span class="text-xs font-medium text-slate-400">Connect:</span>
            <a
              href="https://github.com/sereyvichea2828"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-lg bg-white/80 border border-slate-200/80 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              aria-label="GitHub Profile"
            >
              <Github class="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/try-sereyvichea-8a890a436/"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-lg bg-white/80 border border-slate-200/80 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              aria-label="LinkedIn Profile"
            >
              <Linkedin class="w-4 h-4" />
            </a>
            <a
              :href="'mailto:' + CONTACT_INFO.email"
              class="w-8 h-8 rounded-lg bg-white/80 border border-slate-200/80 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              aria-label="Direct Email"
            >
              <Mail class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Right Column: Interactive 3D Card Tilt Developer Portrait & Orb -->
        <div class="hero-portrait-stage lg:col-span-5 relative flex items-center justify-center">
          <div class="relative w-full max-w-xs sm:max-w-sm lg:max-w-xs xl:max-w-sm mx-auto">
            <!-- Interactive 3D Perspective Card -->
            <div
              ref="portraitCardRef"
              data-portrait
              class="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 p-2 sm:p-2.5 cursor-pointer will-change-transform transition-shadow duration-300 hover:shadow-2xl hover:border-slate-300"
              @mousemove="handleCardPointerMove"
              @mouseleave="handleCardPointerLeave"
            >
              <div class="relative overflow-hidden rounded-2xl aspect-4/5 bg-slate-100">
                <img
                  :src="HERO_CONTENT.portraitImage"
                  :alt="HERO_CONTENT.portraitAlt"
                  class="w-full h-full object-cover object-center rounded-2xl transition-transform duration-700 ease-out hover:scale-103"
                  loading="eager"
                />

                <!-- Subtle Crystalline Light Sheen -->
                <div class="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden" aria-hidden="true">
                  <div class="hero-sheen-sweep" />
                </div>
              </div>

              <!-- Sleek Bottom Info Caption (Non-AI, Grounded) -->
              <div class="mt-2.5 px-2 py-1.5 flex items-center justify-between text-xs border-t border-slate-100">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500" />
                  <span class="font-bold text-slate-900">Try Sereyvichea</span>
                </div>
                <span class="font-mono text-slate-500 text-xs">Phnom Penh</span>
              </div>
            </div>

            <!-- Floating 3D Pearl Glass Orb (Ambient Companion) -->
            <div class="absolute -top-7 -right-7 z-20 pointer-events-none hidden sm:block">
              <ThreePearlOrb size-class="w-24 h-24 sm:w-28 sm:h-28" />
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Centered Scroll Down Indicator -->
      <div class="hero-scroll-indicator mt-12 sm:mt-16 text-center flex justify-center">
        <button
          type="button"
          class="inline-flex flex-col items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-400 hover:text-slate-900 transition-colors cursor-pointer group"
          @click="handleScrollIndicatorClick"
          aria-label="Scroll to about section"
        >
          <span class="uppercase tracking-widest text-xs">EXPLORE</span>
          <ChevronDown class="w-4 h-4 animate-bounce text-slate-400 group-hover:text-slate-900 transition-colors" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-sheen-sweep {
  position: absolute;
  inset: -60%;
  background: linear-gradient(
    115deg,
    transparent 30%,
    rgba(255, 255, 255, 0.45) 50%,
    transparent 70%
  );
  transform: translateX(-100%) rotate(15deg);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

[data-portrait]:hover .hero-sheen-sweep {
  opacity: 1;
  animation: sheenSlide 1.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

@keyframes sheenSlide {
  0% {
    transform: translateX(-100%) rotate(15deg);
  }
  100% {
    transform: translateX(100%) rotate(15deg);
  }
}
</style>
