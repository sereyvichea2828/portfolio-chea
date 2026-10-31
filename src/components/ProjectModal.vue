<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import type { Project } from '@/types/portfolio';
import { useModalState } from '@/composables/useModalState';
import { X, ArrowUpRight, Github } from 'lucide-vue-next';

interface Props {
  project: Project | null;
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { registerModal } = useModalState();
const modalRef = ref<HTMLDivElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);
let lastFocusedElement: HTMLElement | null = null;

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
      closeButtonRef.value?.focus();
    } else {
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
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
  registerModal('project-modal', false);
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown);
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
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
          class="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center border border-slate-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer shadow-2xs transition-colors"
          aria-label="បិទផ្ទាំង"
          @click="handleClose"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- 1. Header (Centered, Clean, Authoritative Case Study Header) -->
        <div
          class="px-5 sm:px-6 py-5 sm:py-6 border-b border-slate-200/80 flex flex-col items-center justify-center shrink-0 bg-white"
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
          <section v-if="props.project.challenge" class="space-y-2 text-left">
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
          <section v-if="props.project.solution" class="space-y-2 text-left">
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
            class="space-y-2 pt-1 text-left"
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
            class="pt-1 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-2"
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
          class="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-200/80 bg-slate-50/80 flex flex-wrap items-center justify-center gap-3 shrink-0"
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

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease-out;
}

.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition:
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.22s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-card {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}

.modal-fade-leave-to .modal-card {
  transform: scale(0.97) translateY(4px);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active,
  .modal-fade-leave-active,
  .modal-fade-enter-active .modal-card,
  .modal-fade-leave-active .modal-card {
    transition: none !important;
  }
}
</style>
