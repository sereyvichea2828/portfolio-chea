<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import type { Project } from '@/types/portfolio';
import { useModalState } from '@/composables/useModalState';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { X, ArrowUpRight, Github } from 'lucide-vue-next';

interface OriginRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Props {
  project: Project | null;
  isOpen: boolean;
  originRect?: OriginRect | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { registerModal } = useModalState();
const { isReducedMotion } = useReducedMotion();
const modalRef = ref<HTMLDivElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);
let lastFocusedElement: HTMLElement | null = null;
let activeTl: gsap.core.Timeline | null = null;
let cachedOriginRect: OriginRect | null = null;

const getOriginRect = (): OriginRect | null => {
  // 1. Check if originating project card element exists in the DOM
  if (props.project?.id) {
    const el = document.getElementById(`project-card-${props.project.id}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
      }
    }
  }

  // 2. Use prop snapshot if provided
  if (props.originRect && props.originRect.width > 0 && props.originRect.height > 0) {
    return props.originRect;
  }

  return null;
};

const onEnter = (el: Element, done: () => void): void => {
  if (isReducedMotion.value) {
    done();
    return;
  }

  if (activeTl) {
    activeTl.kill();
    activeTl = null;
  }

  const backdrop = el as HTMLElement;
  const card = backdrop.querySelector<HTMLElement>('.modal-card');
  const closeBtn = backdrop.querySelector<HTMLElement>('.modal-close-btn');
  const header = backdrop.querySelector<HTMLElement>('.modal-header-content');
  const sections = backdrop.querySelectorAll<HTMLElement>('.modal-section-item');
  const footer = backdrop.querySelector<HTMLElement>('.modal-footer-content');

  if (!card) {
    done();
    return;
  }

  const origin = getOriginRect();
  if (origin) {
    cachedOriginRect = origin;
  }
  const targetRect = card.getBoundingClientRect();
  const hasOrigin = Boolean(
    origin &&
      origin.width > 0 &&
      origin.height > 0 &&
      targetRect.width > 0 &&
      targetRect.height > 0,
  );

  // Calculate displacement from the clicked card to screen center
  let deltaX = 0;
  let deltaY = 40;
  const startScale = 0.36; // Canva Succession: Starts distinctly small and zooms to large full

  if (hasOrigin && origin) {
    const originCenterX = origin.left + origin.width / 2;
    const originCenterY = origin.top + origin.height / 2;
    const curX = Number(gsap.getProperty(card, 'x')) || 0;
    const curY = Number(gsap.getProperty(card, 'y')) || 0;
    const targetCenterX = targetRect.left + targetRect.width / 2 - curX;
    const targetCenterY = targetRect.top + targetRect.height / 2 - curY;

    deltaX = originCenterX - targetCenterX;
    deltaY = originCenterY - targetCenterY;
  }

  // Pre-set initial transform & optical blur synchronously to guarantee ZERO flash of full size
  gsap.set(card, {
    x: deltaX,
    y: deltaY,
    scale: startScale,
    opacity: 0.35,
    filter: 'blur(12px)',
    transformOrigin: 'center center',
    willChange: 'transform, filter, opacity',
  });
  gsap.set(backdrop, { opacity: 0 });
  if (header) gsap.set(header, { opacity: 0, y: 14, filter: 'blur(6px)' });
  if (closeBtn) gsap.set(closeBtn, { opacity: 0, scale: 0.8 });
  if (sections) gsap.set(sections, { opacity: 0, y: 12, filter: 'blur(5px)' });
  if (footer) gsap.set(footer, { opacity: 0, y: 10, filter: 'blur(4px)' });

  // Coordinated Canva Succession GSAP Timeline: Zoom Expansion (Small -> Large Full) + Depth + Blur-to-Focus
  const tl = gsap.timeline({
    onComplete: () => {
      activeTl = null;
      // Clear all transient GSAP transforms & filter properties to preserve crystal-clear text antialiasing
      gsap.set(card, { clearProps: 'all' });
      if (header) gsap.set(header, { clearProps: 'all' });
      if (closeBtn) gsap.set(closeBtn, { clearProps: 'all' });
      if (sections) gsap.set(sections, { clearProps: 'all' });
      if (footer) gsap.set(footer, { clearProps: 'all' });
      done();
    },
  });
  activeTl = tl;

  // STAGE 1 — Background Focus Transition: Smooth backdrop fade-in & soft blur
  tl.to(
    backdrop,
    { opacity: 1, duration: 0.45, ease: 'power2.out' },
    0,
  );

  // STAGE 2 — Canva Succession Zoom Expansion: Progressive forward zoom from SMALL (scale: 0.36) to LARGE FULL (scale: 1.0)
  tl.to(
    card,
    {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.65,
      ease: 'expo.out',
    },
    0,
  );

  // STAGE 3 — Focus and Content Reveal: Progressively resolves from optical blur into razor-sharp focus
  if (header) {
    tl.to(
      header,
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.40,
        ease: 'power3.out',
      },
      0.22,
    );
  }

  if (closeBtn) {
    tl.to(
      closeBtn,
      {
        opacity: 1,
        scale: 1,
        duration: 0.32,
        ease: 'power3.out',
      },
      0.24,
    );
  }

  if (sections && sections.length > 0) {
    tl.to(
      sections,
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.38,
        stagger: 0.05,
        ease: 'power3.out',
      },
      0.26,
    );
  }

  if (footer) {
    tl.to(
      footer,
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.32,
        ease: 'power3.out',
      },
      0.34,
    );
  }
};

const onLeave = (el: Element, done: () => void): void => {
  if (isReducedMotion.value) {
    done();
    return;
  }

  if (activeTl) {
    activeTl.kill();
    activeTl = null;
  }

  const backdrop = el as HTMLElement;
  const card = backdrop.querySelector<HTMLElement>('.modal-card');
  const closeBtn = backdrop.querySelector<HTMLElement>('.modal-close-btn');
  const header = backdrop.querySelector<HTMLElement>('.modal-header-content');
  const sections = backdrop.querySelectorAll<HTMLElement>('.modal-section-item');
  const footer = backdrop.querySelector<HTMLElement>('.modal-footer-content');

  if (!card) {
    done();
    return;
  }

  const origin = getOriginRect() || cachedOriginRect;
  const targetRect = card.getBoundingClientRect();
  const hasOrigin = Boolean(
    origin &&
      origin.width > 0 &&
      origin.height > 0 &&
      targetRect.width > 0 &&
      targetRect.height > 0,
  );

  let deltaX = 0;
  let deltaY = 30;
  const endScale = 0.36;

  if (hasOrigin && origin) {
    const originCenterX = origin.left + origin.width / 2;
    const originCenterY = origin.top + origin.height / 2;
    const curX = Number(gsap.getProperty(card, 'x')) || 0;
    const curY = Number(gsap.getProperty(card, 'y')) || 0;
    const targetCenterX = targetRect.left + targetRect.width / 2 - curX;
    const targetCenterY = targetRect.top + targetRect.height / 2 - curY;

    deltaX = originCenterX - targetCenterX;
    deltaY = originCenterY - targetCenterY;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      activeTl = null;
      done();
    },
  });
  activeTl = tl;

  // 1. Content optical blur and quick fade-out
  const contentEls = [
    header,
    closeBtn,
    footer,
    ...(sections ? Array.from(sections) : []),
  ].filter(Boolean) as HTMLElement[];

  if (contentEls.length > 0) {
    tl.to(
      contentEls,
      {
        opacity: 0,
        filter: 'blur(5px)',
        duration: 0.16,
        ease: 'power2.in',
      },
      0,
    );
  }

  // 2. Reverse Succession Zoom: Modal smoothly contracts from LARGE FULL down to SMALL at originating card position
  tl.to(
    card,
    {
      x: deltaX,
      y: deltaY,
      scale: endScale,
      opacity: 0,
      filter: 'blur(10px)',
      transformOrigin: 'center center',
      duration: 0.44,
      ease: 'power3.inOut',
    },
    0.03,
  );

  // 3. Smooth backdrop release and fade out
  tl.to(
    backdrop,
    {
      opacity: 0,
      duration: 0.38,
      ease: 'power2.inOut',
    },
    0.06,
  );
};

const handleClose = (): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  emit('close');
};

const handleKeyDown = (e: KeyboardEvent): void => {
  if (!props.isOpen) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    handleClose();
    return;
  }

  // Keyboard accessibility: trap focus inside modal
  if (e.key === 'Tab' && modalRef.value) {
    const focusableEls = modalRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (focusableEls.length === 0) return;

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }
};

watch(
  () => props.isOpen,
  async (open) => {
    registerModal('project-modal', open);

    if (typeof document === 'undefined') return;

    if (open) {
      lastFocusedElement = document.activeElement as HTMLElement | null;
      await nextTick();
      closeButtonRef.value?.focus({ preventScroll: true });
    } else {
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus({ preventScroll: true });
        lastFocusedElement = null;
      }
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  if (activeTl) {
    activeTl.kill();
    activeTl = null;
  }
  registerModal('project-modal', false);
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown);
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition appear :css="false" @enter="onEnter" @leave="onLeave">
      <div
        v-if="props.isOpen && props.project"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs overflow-hidden"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`project-modal-title-${props.project.id}`"
        @click.self="handleClose"
      >
        <!-- Modal Card Container (Centered, Technical Document Surface) -->
        <div
          ref="modalRef"
          data-lenis-prevent
          class="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200/90 rounded-2xl shadow-xl flex flex-col overflow-hidden text-center modal-card"
        >
        <!-- Accessible Close Button (Positioned at top-right corner) -->
        <button
          ref="closeButtonRef"
          type="button"
          class="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center border border-slate-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer shadow-2xs transition-colors modal-close-btn"
          aria-label="បិទផ្ទាំង"
          @click="handleClose"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- 1. Header (Centered, Clean, Authoritative Case Study Header) -->
        <div
          class="px-5 sm:px-6 py-5 sm:py-6 border-b border-slate-200/80 flex flex-col items-center justify-center shrink-0 bg-white modal-header-content"
        >
          <!-- Quiet Category Metadata Pill -->
          <span
            class="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold tracking-wider text-slate-600 uppercase text-[11px] mb-2"
          >
            {{ props.project.category }}
          </span>

          <!-- Primary Project Title (Centered) -->
          <h2
            :id="`project-modal-title-${props.project.id}`"
            class="text-xl sm:text-2xl font-bold font-heading text-slate-900 leading-snug tracking-tight text-center max-w-lg"
          >
            {{ props.project.title }}
          </h2>

          <!-- Supporting Tagline (Centered) -->
          <p
            v-if="props.project.tagline"
            class="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed text-center max-w-xl text-pretty"
          >
            {{ props.project.tagline }}
          </p>
        </div>

        <!-- 2. Scrollable Modal Body (Independently Scrollable Case Study Document) -->
        <div
          data-lenis-prevent
          class="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5 overscroll-contain text-slate-800"
        >
          <!-- 01 — Architectural Challenge -->
          <section v-if="props.project.challenge" class="space-y-2 text-left modal-section-item">
            <div class="flex items-center gap-2 text-xs font-semibold tracking-wider">
              <span class="font-mono text-slate-400 font-bold">01</span>
              <span class="text-slate-300" aria-hidden="true">/</span>
              <span class="text-slate-900 font-bold">បញ្ហាប្រឈមនៃស្ថាបត្យកម្ម</span>
            </div>
            <p
              class="text-sm text-slate-700 leading-relaxed font-normal text-pretty pl-4 border-l-2 border-slate-200"
            >
              {{ props.project.challenge }}
            </p>
          </section>

          <!-- 02 — Engineering Solution -->
          <section v-if="props.project.solution" class="space-y-2 text-left modal-section-item">
            <div class="flex items-center gap-2 text-xs font-semibold tracking-wider">
              <span class="font-mono text-slate-400 font-bold">02</span>
              <span class="text-slate-300" aria-hidden="true">/</span>
              <span class="text-slate-900 font-bold">ដំណោះស្រាយវិស្វកម្ម</span>
            </div>
            <p
              class="text-sm text-slate-700 leading-relaxed font-normal text-pretty pl-4 border-l-2 border-slate-200"
            >
              {{ props.project.solution }}
            </p>
          </section>

          <!-- 03 — Operational Metrics (Centered Definition Grid) -->
          <section
            v-if="props.project.metrics && props.project.metrics.length > 0"
            class="space-y-2 pt-1 text-left modal-section-item"
          >
            <div class="flex items-center gap-2 text-xs font-semibold tracking-wider">
              <span class="font-mono text-slate-400 font-bold">03</span>
              <span class="text-slate-300" aria-hidden="true">/</span>
              <span class="text-slate-900 font-bold">ទិន្នន័យប្រតិបត្តិការ</span>
            </div>

            <!-- Editorial Definition List with Centered Metrics -->
            <dl
              class="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80"
            >
              <div
                v-for="metric in props.project.metrics"
                :key="metric.label"
                class="flex flex-col items-center justify-center text-center p-1"
              >
                <dt class="text-xs text-slate-500 font-medium">{{ metric.label }}</dt>
                <dd
                  class="text-sm sm:text-base font-semibold text-slate-900 font-sans tracking-normal mt-1 text-center"
                >
                  {{ metric.value }}
                </dd>
              </div>
            </dl>
          </section>

          <!-- 04 — Core Technologies (Centered, readable inline badges) -->
          <section
            v-if="props.project.tags && props.project.tags.length > 0"
            class="pt-1 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-2 modal-section-item"
          >
            <span class="font-medium text-slate-400 mr-0.5">បច្ចេកវិទ្យាស្នូល:</span>
            <span
              v-for="tag in props.project.tags"
              :key="tag"
              class="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/80 text-slate-700 font-medium text-xs"
            >
              {{ tag }}
            </span>
          </section>
        </div>

        <!-- 3. Action Footer (Centered, Balanced, Responsive) -->
        <div
          v-if="props.project.demoUrl || props.project.githubUrl"
          class="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-200/80 bg-slate-50/80 flex flex-wrap items-center justify-center gap-3 shrink-0 modal-footer-content"
        >
          <!-- Secondary Action: GitHub Repository -->
          <a
            v-if="props.project.githubUrl"
            :href="props.project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-950 transition-colors text-xs sm:text-sm font-semibold min-h-11 shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <Github class="w-4 h-4 text-slate-500" />
            <span>ប្រភពកូដ</span>
          </a>

          <!-- Primary Action: Live Demo -->
          <a
            v-if="props.project.demoUrl && props.project.demoUrl !== props.project.githubUrl"
            :href="props.project.demoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs sm:text-sm font-semibold transition-colors min-h-11 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <span>សាកល្បងផ្ទាល់</span>
            <ArrowUpRight class="w-4 h-4 text-slate-300" />
          </a>
        </div>
      </div>
    </div>
    </Transition>
  </Teleport>
</template>
