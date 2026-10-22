<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue';
import type { Project } from '@/types/portfolio';
import { X, ExternalLink, Github, Cpu, ShieldCheck } from 'lucide-vue-next';

interface Props {
  project: Project | null;
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleClose = (): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  emit('close');
};

const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key === 'Escape' && props.isOpen) {
    handleClose();
  }
};

watch(
  () => props.isOpen,
  (open) => {
    if (typeof document !== 'undefined') {
      if (open) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }
  },
);

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown);
    document.body.classList.remove('overflow-hidden');
  }
});
</script>

<template>
  <div
    v-if="props.isOpen && props.project"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/30 backdrop-blur-sm"
    @click.self="handleClose"
  >
    <div
      class="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto text-left"
    >
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
            {{ props.project.category }}
          </span>
          <h3 class="text-2xl font-extrabold text-ink-primary mt-2 tracking-tight">
            {{ props.project.title }}
          </h3>
          <p class="text-xs sm:text-sm text-ink-secondary mt-0.5">
            {{ props.project.tagline }}
          </p>
        </div>

        <button
          type="button"
          class="w-11 h-11 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-ink-primary flex items-center justify-center border border-slate-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 shrink-0 cursor-pointer shadow-xs"
          aria-label="Close modal"
          @click="handleClose"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Problem & Engineering Solution -->
      <div class="space-y-4">
        <div>
          <h4
            class="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1 flex items-center gap-1.5"
          >
            <Cpu class="w-3.5 h-3.5 text-purple-600" />
            The Architectural Challenge
          </h4>
          <p
            class="text-sm text-ink-primary/90 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100"
          >
            {{ props.project.challenge }}
          </p>
        </div>

        <div>
          <h4
            class="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1 flex items-center gap-1.5"
          >
            <ShieldCheck class="w-3.5 h-3.5 text-indigo-600" />
            Engineered Solution
          </h4>
          <p
            class="text-sm text-ink-primary/90 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100"
          >
            {{ props.project.solution }}
          </p>
        </div>
      </div>

      <!-- Benchmark Metrics -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-2">
          Verified Performance Benchmarks
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            v-for="metric in props.project.metrics"
            :key="metric.label"
            class="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs text-center"
          >
            <span class="text-xs text-ink-secondary block">{{ metric.label }}</span>
            <span class="text-sm sm:text-base font-bold text-purple-700">{{ metric.value }}</span>
          </div>
        </div>
      </div>

      <!-- Tech Stack Badges -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-2">
          Technology Stack
        </h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in props.project.tags"
            :key="tag"
            class="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-ink-primary/90"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Action Footer Links -->
      <div
        class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3"
      >
        <a
          :href="props.project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-ink-primary text-xs font-semibold transition-colors min-h-11 shadow-xs"
        >
          <Github class="w-4 h-4" />
          <span>Source Repository</span>
        </a>

        <a
          :href="props.project.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-semibold transition-all min-h-11 shadow-sm"
        >
          <span>Live Deployment</span>
          <ExternalLink class="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
</template>
