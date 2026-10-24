<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue';
import { X, Download, Mail, FileCheck, CheckCircle2 } from 'lucide-vue-next';

interface Props {
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

const handleDownloadAction = (): void => {
  window.print();
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
    v-if="props.isOpen"
    data-lenis-prevent
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/30 backdrop-blur-sm"
    @click.self="handleClose"
  >
    <div
      data-lenis-prevent
      class="relative w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-white/95 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
    >
      <!-- Modal Header -->
      <div
        class="p-6 sm:p-8 pb-4 border-b border-slate-100 flex items-start justify-between shrink-0"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200/80 flex items-center justify-center shadow-xs"
          >
            <FileCheck class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-900 tracking-tight">
              Curriculum Vitae / Resume
            </h3>
            <p class="text-xs text-slate-500">Try Sereyvichea — Senior Full-Stack Engineer</p>
          </div>
        </div>

        <button
          type="button"
          class="w-11 h-11 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-900 flex items-center justify-center border border-slate-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer shadow-xs transition-colors"
          aria-label="Close modal"
          @click="handleClose"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div
        data-lenis-prevent
        class="flex-1 overflow-y-auto p-6 sm:p-8 py-5 space-y-6 overscroll-contain"
      >
        <!-- Quick Executive Summary -->
        <div class="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900">
            Executive Summary
          </h4>
          <p class="text-xs sm:text-sm text-slate-800 leading-relaxed">
            Full-Stack Developer with 4+ years of production experience engineering reactive Vue 3
            web applications, high-concurrency Node.js services, and interactive 3D WebGL
            experiences. Proven track record of shipping fault-tolerant architectures and mentoring
            engineering teams.
          </p>
        </div>

        <!-- Core Competencies -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">
            Core Competencies
          </h4>
          <div class="grid grid-cols-2 gap-2 text-xs text-slate-800">
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>Vue 3 & Composition API</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>Strict TypeScript Contracts</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>Node.js RESTful Services</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>PostgreSQL & MongoDB</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>Three.js & Interactive 3D</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>Docker & CI/CD Pipelines</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Actions -->
      <div
        class="p-4 sm:p-6 pt-3 sm:pt-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0"
      >
        <a
          href="mailto:dyte.vichea.dev@gmail.com?subject=Portfolio%20Inquiry%20-%20Resume%20Request"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/80 text-xs font-semibold transition-colors min-h-11 shadow-xs"
        >
          <Mail class="w-4 h-4 text-slate-500" />
          <span>Request Custom Dossier</span>
        </a>

        <button
          type="button"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer min-h-11"
          @click="handleDownloadAction"
        >
          <Download class="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>
    </div>
  </div>
</template>
