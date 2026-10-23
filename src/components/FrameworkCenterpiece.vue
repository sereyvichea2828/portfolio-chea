<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import TechLogo from '@/components/TechLogo.vue';
import { useReducedMotion } from '@/composables/useReducedMotion';
import gsap from 'gsap';

interface SatelliteTech {
  id: string;
  name: string;
  role: string;
  color: string;
  borderColor: string;
  glowColor: string;
  desktopPos: { x: number; y: number };
  lineLength: number;
}

// Ordered strictly in the requested staggered reveal sequence:
// 1. TypeScript (top) -> 2. Three.js (left) -> 3. Tailwind CSS (right) ->
// 4. PostgreSQL (lower left) -> 5. Vite (lower right) -> 6. Node.js (bottom)
const SATELLITES: readonly SatelliteTech[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    role: 'Strict Contracts',
    color: 'text-blue-600',
    borderColor: 'border-blue-200/80',
    glowColor: 'shadow-blue-500/10',
    desktopPos: { x: 0, y: -150 },
    lineLength: 150,
  },
  {
    id: 'three',
    name: 'Three.js',
    role: '3D WebGL Shaders',
    color: 'text-slate-800',
    borderColor: 'border-purple-200/80',
    glowColor: 'shadow-purple-500/10',
    desktopPos: { x: -200, y: -75 },
    lineLength: 213.6,
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    role: 'Utility Scaling',
    color: 'text-cyan-600',
    borderColor: 'border-cyan-200/80',
    glowColor: 'shadow-cyan-500/10',
    desktopPos: { x: 200, y: -75 },
    lineLength: 213.6,
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    role: 'Relational Store',
    color: 'text-indigo-600',
    borderColor: 'border-indigo-200/80',
    glowColor: 'shadow-indigo-500/10',
    desktopPos: { x: -200, y: 75 },
    lineLength: 213.6,
  },
  {
    id: 'vite',
    name: 'Vite',
    role: 'Fast Bundling',
    color: 'text-purple-600',
    borderColor: 'border-purple-200/80',
    glowColor: 'shadow-purple-500/10',
    desktopPos: { x: 200, y: 75 },
    lineLength: 213.6,
  },
  {
    id: 'node',
    name: 'Node.js',
    role: 'Backend Concurrency',
    color: 'text-emerald-600',
    borderColor: 'border-emerald-200/80',
    glowColor: 'shadow-emerald-500/10',
    desktopPos: { x: 0, y: 155 },
    lineLength: 155,
  },
] as const;

const containerRef = ref<HTMLDivElement | null>(null);
const ambientGlowRef = ref<HTMLDivElement | null>(null);
const orbitRingRef = ref<SVGElement | null>(null);
const innerRingRef = ref<SVGElement | null>(null);
const vueLogoBoxRef = ref<HTMLDivElement | null>(null);
const vueHaloRef = ref<HTMLDivElement | null>(null);
const coreEngineBadgeRef = ref<HTMLDivElement | null>(null);
const mobileHubRef = ref<HTMLDivElement | null>(null);

const satelliteFloatRefs = ref<Record<string, HTMLElement>>({});
const satelliteCardRefs = ref<Record<string, HTMLElement>>({});
const lineRefs = ref<Record<string, SVGLineElement>>({});
const pulseDotRefs = ref<Record<string, SVGCircleElement>>({});
const mobileCardRefs = ref<HTMLElement[]>([]);

const { isReducedMotion } = useReducedMotion();

const activeTechId = ref<string>('vue');
const parallaxX = ref<number>(0);
const parallaxY = ref<number>(0);
const isRevealed = ref<boolean>(false);

let entranceTimeline: gsap.core.Timeline | null = null;
let ambientTweens: gsap.core.Tween[] = [];
let observer: IntersectionObserver | null = null;
let safetyTimeoutId: ReturnType<typeof setTimeout> | null = null;
let hasEntered = false;

const handlePointerMove = (e: MouseEvent): void => {
  if (isReducedMotion.value || !containerRef.value || !isRevealed.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const normX = (e.clientX - rect.left) / rect.width - 0.5;
  const normY = (e.clientY - rect.top) / rect.height - 0.5;
  parallaxX.value = normX * 16;
  parallaxY.value = normY * 16;
};

const handlePointerLeave = (): void => {
  parallaxX.value = 0;
  parallaxY.value = 0;
};

const killAmbientMotion = (): void => {
  ambientTweens.forEach((t) => t.kill());
  ambientTweens = [];
  Object.values(satelliteFloatRefs.value).forEach((el) => {
    if (el) gsap.set(el, { clearProps: 'all' });
  });
};

const startAmbientMotion = (): void => {
  if (isReducedMotion.value) return;
  killAmbientMotion();

  // 1. Subtle breathing pulse on Vue center halo
  if (vueHaloRef.value) {
    const haloTween = gsap.to(vueHaloRef.value, {
      scale: 1.08,
      opacity: 0.35,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    ambientTweens.push(haloTween);
  }

  // 2. Gentle floating drift on satellite float wrappers (separate from hover card)
  SATELLITES.forEach((sat, i) => {
    const floatEl = satelliteFloatRefs.value[sat.id];
    if (!floatEl) return;
    const yDelta = i % 2 === 0 ? 3 : -3;
    const cardTween = gsap.to(floatEl, {
      y: `+=${yDelta}`,
      duration: 3.2 + (i % 3) * 0.7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.15,
    });
    ambientTweens.push(cardTween);
  });

  // 3. Ambient slow dash drift on the orbit ring
  if (orbitRingRef.value) {
    const ringTween = gsap.to(orbitRingRef.value, {
      strokeDashoffset: -20,
      duration: 12,
      repeat: -1,
      ease: 'none',
    });
    ambientTweens.push(ringTween);
  }
};

const buildEntranceTimeline = (): gsap.core.Timeline => {
  const tl = gsap.timeline({
    paused: true,
    defaults: {
      ease: 'power3.out',
    },
    onComplete: () => {
      isRevealed.value = true;
      // Clear all temporary inline styles so elements return to pure resting CSS
      if (vueLogoBoxRef.value) gsap.set(vueLogoBoxRef.value, { clearProps: 'transform,opacity' });
      if (coreEngineBadgeRef.value) gsap.set(coreEngineBadgeRef.value, { clearProps: 'transform,opacity' });
      orderedSatelliteEls.forEach((el) => {
        if (el) gsap.set(el, { clearProps: 'transform,opacity' });
      });
      mobileCardRefs.value.forEach((el) => {
        if (el) gsap.set(el, { clearProps: 'transform,opacity' });
      });
      if (mobileHubRef.value) gsap.set(mobileHubRef.value, { clearProps: 'transform,opacity' });
      startAmbientMotion();
    },
  });

  // Collect ordered elements
  const orderedSatelliteEls = SATELLITES.map((s) => satelliteCardRefs.value[s.id]).filter(Boolean);
  const orderedLines = SATELLITES.map((s) => lineRefs.value[s.id]).filter(Boolean);
  const orderedDots = SATELLITES.map((s) => pulseDotRefs.value[s.id]).filter(Boolean);

  // Step 1: Ambient Background Glow (500–700ms)
  if (ambientGlowRef.value) {
    tl.fromTo(
      ambientGlowRef.value,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.65, ease: 'power2.out' },
      0,
    );
  }

  // Step 2: Dashed Orbit Ring & Inner Guide (700–900ms)
  if (orbitRingRef.value && innerRingRef.value) {
    tl.fromTo(
      [orbitRingRef.value, innerRingRef.value],
      { opacity: 0, scale: 0.88, transformOrigin: '0px 0px' },
      { opacity: 0.65, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
      0.2,
    );
  }

  // Step 3: Progressive Connector Lines from Central Logo Outward (500–700ms)
  if (orderedLines.length > 0) {
    tl.fromTo(
      orderedLines,
      { opacity: 0, scale: 0, transformOrigin: '0px 0px' },
      { opacity: 0.75, scale: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out' },
      0.35,
    );
  }
  if (orderedDots.length > 0) {
    tl.fromTo(
      orderedDots,
      { opacity: 0, scale: 0, transformOrigin: 'center' },
      { opacity: 0.7, scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.7)' },
      0.55,
    );
  }

  // Step 4: Central Vue Logo (450–650ms, scale 0.94 -> 1)
  if (vueLogoBoxRef.value) {
    tl.fromTo(
      vueLogoBoxRef.value,
      { opacity: 0, scale: 0.94, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      0.5,
    );
  }

  // Step 5: Technology Cards (Staggered 1 -> 6, 400–600ms, moving upward slightly)
  if (orderedSatelliteEls.length > 0) {
    tl.fromTo(
      orderedSatelliteEls,
      { opacity: 0, y: 16, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.11,
        ease: 'power3.out',
      },
      0.65,
    );
  }

  // Step 6: Core Engine Label Badge (350–450ms)
  if (coreEngineBadgeRef.value) {
    tl.fromTo(
      coreEngineBadgeRef.value,
      { opacity: 0, scale: 0.9, y: 8 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' },
      1.25,
    );
  }

  // Mobile layout synchronization
  if (mobileHubRef.value) {
    tl.fromTo(
      mobileHubRef.value,
      { opacity: 0, scale: 0.94, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      0.4,
    );
  }
  if (mobileCardRefs.value.length > 0) {
    tl.fromTo(
      mobileCardRefs.value,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power3.out' },
      0.6,
    );
  }

  return tl;
};

onMounted(() => {
  if (typeof window === 'undefined') return;

  if (isReducedMotion.value) {
    isRevealed.value = true;
    return;
  }

  entranceTimeline = buildEntranceTimeline();

  // Native IntersectionObserver guarantees automatic, reliable trigger decoupled from scroll libraries
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;

      if (entry.isIntersecting) {
        if (!hasEntered) {
          hasEntered = true;
          entranceTimeline?.restart();
        } else {
          startAmbientMotion();
        }
      } else {
        // When scrolled out of the viewport, pause ambient motion to conserve resources
        // NEVER reset the entrance timeline to pause(0), as that leaves elements stuck at opacity 0!
        killAmbientMotion();
      }
    },
    {
      threshold: 0.15,
      rootMargin: '100px 0px 50px 0px',
    },
  );

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }

  // Immediate viewport assessment on mount (e.g. direct route entry or page refresh)
  requestAnimationFrame(() => {
    if (!containerRef.value) return;
    const rect = containerRef.value.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (!hasEntered) {
        hasEntered = true;
        entranceTimeline?.restart();
      }
    }
  });

  // Hard safety timeout: guarantees elements are fully visible and not stuck waiting
  safetyTimeoutId = setTimeout(() => {
    if (!hasEntered) {
      hasEntered = true;
      if (entranceTimeline) {
        entranceTimeline.progress(1);
      }
      isRevealed.value = true;
      startAmbientMotion();
    }
  }, 1500);
});

onUnmounted(() => {
  if (safetyTimeoutId) {
    clearTimeout(safetyTimeoutId);
    safetyTimeoutId = null;
  }
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (entranceTimeline) {
    entranceTimeline.kill();
    entranceTimeline = null;
  }
  killAmbientMotion();
});
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full max-w-4xl mx-auto py-12 px-4 select-none"
    @mousemove="handlePointerMove"
    @mouseleave="handlePointerLeave"
  >
    <!-- Step 1: Ambient Background Radial Glow -->
    <div
      ref="ambientGlowRef"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-linear-to-tr from-purple-200/35 via-indigo-100/25 to-cyan-100/30 blur-3xl pointer-events-none opacity-60"
      aria-hidden="true"
    />

    <!-- Desktop & Tablet Radial Orbital Constellation (Hidden on mobile) -->
    <div
      class="hidden md:flex relative items-center justify-center min-h-110 h-110 w-full transition-transform duration-300 ease-out"
      :style="{
        transform: isRevealed ? `translate3d(${parallaxX}px, ${parallaxY}px, 0)` : 'none',
      }"
    >
      <!-- Connected Radial SVG Lines & Dashed Orbit -->
      <svg
        class="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="-300 -220 600 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <!-- Step 2: Concentric Ambient Orbital Guide Rings -->
        <ellipse
          ref="orbitRingRef"
          cx="0"
          cy="0"
          rx="200"
          ry="150"
          stroke="#E9D5FF"
          stroke-width="1.5"
          stroke-dasharray="4 6"
          opacity="0.65"
        />
        <circle
          ref="innerRingRef"
          cx="0"
          cy="0"
          r="75"
          stroke="#E0E7FF"
          stroke-width="1"
          opacity="0.4"
        />

        <!-- Step 3: Radial Spoke Lines to Each Satellite Node -->
        <g v-for="sat in SATELLITES" :key="sat.id">
          <line
            :ref="
              (el) => {
                if (el) lineRefs[sat.id] = el as SVGLineElement;
              }
            "
            x1="0"
            y1="0"
            :x2="sat.desktopPos.x"
            :y2="sat.desktopPos.y"
            stroke="url(#orbit-line-gradient)"
            stroke-width="1.5"
            stroke-dasharray="3 4"
            opacity="0.75"
          />
          <!-- Connection Pulse Dot -->
          <circle
            :ref="
              (el) => {
                if (el) pulseDotRefs[sat.id] = el as SVGCircleElement;
              }
            "
            :cx="sat.desktopPos.x * 0.55"
            :cy="sat.desktopPos.y * 0.55"
            r="2.5"
            fill="#9333EA"
            opacity="0.7"
          />
        </g>

        <defs>
          <linearGradient id="orbit-line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#C084FC" stop-opacity="0.8" />
            <stop offset="50%" stop-color="#818CF8" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Step 4: Centerpiece Hub (Vue 3 Primary Engine) -->
      <div
        class="relative z-20 flex flex-col items-center justify-center transition-all duration-300 group cursor-pointer"
        @mouseenter="activeTechId = 'vue'"
      >
        <div
          ref="vueLogoBoxRef"
          class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-xl shadow-purple-950/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-emerald-500/15 group-hover:border-emerald-300/80"
        >
          <!-- Soft Glowing Halo behind Vue Logo -->
          <div
            ref="vueHaloRef"
            class="absolute inset-0 rounded-3xl bg-linear-to-tr from-emerald-400/25 via-purple-300/20 to-cyan-300/25 blur-md pointer-events-none opacity-20"
            aria-hidden="true"
          />
          <TechLogo name="vue" size-class="w-14 h-14 sm:w-16 sm:h-16" />
        </div>

        <!-- Step 6: Core Engine Label Badge -->
        <div
          ref="coreEngineBadgeRef"
          class="mt-2.5 px-3.5 py-1 rounded-full bg-emerald-50/95 border border-emerald-200/90 text-xs font-bold text-emerald-700 shadow-xs flex items-center gap-1.5 whitespace-nowrap z-20"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Core Engine • Vue 3</span>
        </div>
      </div>

      <!-- Step 5: Orbital Satellites (Staggered Staged Reveal 1 -> 6) -->
      <div
        v-for="sat in SATELLITES"
        :key="sat.id"
        class="absolute z-10 cursor-pointer group"
        :style="{
          left: `calc(50% + ${sat.desktopPos.x}px)`,
          top: `calc(50% + ${sat.desktopPos.y}px)`,
          transform: 'translate(-50%, -50%)',
        }"
        @mouseenter="activeTechId = sat.id"
      >
        <!-- Floating wrapper isolated for GSAP ambient drift so CSS hover transform is never overridden -->
        <div
          :ref="
            (el) => {
              if (el) satelliteFloatRefs[sat.id] = el as HTMLElement;
            }
          "
        >
          <div
            :ref="
              (el) => {
                if (el) satelliteCardRefs[sat.id] = el as HTMLElement;
              }
            "
            class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border shadow-md transition-all duration-300 group-hover:scale-108 group-hover:-translate-y-1 group-hover:bg-white"
            :class="[sat.borderColor, sat.glowColor]"
          >
            <TechLogo :name="sat.name" size-class="w-7 h-7" />
            <div class="flex flex-col text-left whitespace-nowrap">
              <span
                class="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors"
              >
                {{ sat.name }}
              </span>
              <span class="text-xs text-slate-500 font-medium leading-none">
                {{ sat.role }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Responsive Grid (320px–767px) -->
    <div class="md:hidden flex flex-col items-center space-y-6">
      <!-- Vue 3 Mobile Centerpiece -->
      <div ref="mobileHubRef" class="flex flex-col items-center">
        <div
          class="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-xl border border-white shadow-lg shadow-purple-950/10 flex items-center justify-center p-3"
        >
          <TechLogo name="vue" size-class="w-12 h-12" />
        </div>
        <span
          class="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
        >
          Core Engine • Vue 3
        </span>
      </div>

      <!-- Supporting Technologies Responsive Grid -->
      <div class="grid grid-cols-2 gap-3 w-full">
        <div
          v-for="(sat, idx) in SATELLITES"
          :key="sat.id"
          :ref="
            (el) => {
              if (el) mobileCardRefs[idx] = el as HTMLElement;
            }
          "
          class="flex items-center gap-2 p-3 rounded-2xl bg-white/80 border border-slate-100 shadow-xs"
        >
          <TechLogo :name="sat.name" size-class="w-6 h-6" />
          <div class="flex flex-col text-left min-w-0">
            <span class="text-xs font-bold text-slate-900 truncate">{{ sat.name }}</span>
            <span class="text-xs text-slate-500 truncate">{{ sat.role }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
