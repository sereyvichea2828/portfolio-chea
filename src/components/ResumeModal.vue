<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue';
import { HERO_CONTENT } from '@/data/portfolioData';
import { useModalState } from '@/composables/useModalState';
import { X, Download, Mail, FileCheck, CheckCircle2 } from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { registerModal } = useModalState();

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
    registerModal('resume-modal', open);
  },
  { immediate: true },
);

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  registerModal('resume-modal', false);
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown);
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="props.isOpen"
        data-lenis-prevent
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/40 backdrop-blur-xs"
        @click.self="handleClose"
      >
        <div
          data-lenis-prevent
          class="relative w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-white border border-slate-200/90 rounded-2xl shadow-xl flex flex-col overflow-hidden text-left modal-card"
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
            <h3 class="text-xl font-bold text-slate-900 tracking-tight leading-snug">
              ប្រវត្តិរូបសង្ខេប
            </h3>
            <p class="text-xs text-slate-500">{{ HERO_CONTENT.khmerName }} — {{ HERO_CONTENT.title }}</p>
          </div>
        </div>

        <button
          type="button"
          class="w-11 h-11 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-900 flex items-center justify-center border border-slate-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer shadow-xs transition-colors"
          aria-label="បិទផ្ទាំង"
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
        <div class="space-y-2.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900">
            សេចក្តីសង្ខេបវិជ្ជាជីវៈ
          </h4>
          <p class="text-xs sm:text-sm text-slate-800 leading-relaxed">
            អ្នកអភិវឌ្ឍន៍កម្មវិធីពេញលេញ ដែលមានបទពិសោធន៍ការងារជាក់ស្តែងជាង ៤ ឆ្នាំ ក្នុងការកសាងកម្មវិធីគេហទំព័ររស់រវើក សេវាកម្មម៉ាស៊ីនបម្រើដំណើរការរហ័ស និងបទពិសោធន៍រូបភាពអន្តរកម្ម។ មានប្រវត្តិការងារច្បាស់លាស់ក្នុងការរៀបចំស្ថាបត្យកម្មប្រព័ន្ធដែលមានភាពធន់ខ្ពស់ និងការចូលរួមណែនាំបច្ចេកទេសដល់ក្រុមការងារ។
          </p>
        </div>

        <!-- Core Competencies -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">
            សមត្ថភាពស្នូល
          </h4>
          <div class="grid grid-cols-2 gap-2.5 text-xs text-slate-800">
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>ស្ថាបត្យកម្មចំណុចប្រទាក់ទំនើប</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>កិច្ចសន្យាកូដ និងប្រភេទត្រឹមត្រូវ</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>សេវាកម្មតភ្ជាប់ទិន្នន័យម៉ាស៊ីនបម្រើ</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>មូលដ្ឋានទិន្នន័យទំនាក់ទំនង និងឯកសារ</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>ក្រាហ្វិក និងរូបភាពបីវិមាត្រអន្តរកម្ម</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>ការវេចខ្ចប់កម្មវិធី និងស្វ័យប្រវត្តិកម្ម</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div
        class="p-4 sm:p-6 pt-3 sm:pt-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0"
      >
        <a
          href="mailto:dyte.vichea.dev@gmail.com?subject=សំណើទំនាក់ទំនង%20-%20ប្រវត្តិរូបសង្ខេប"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/80 text-xs font-semibold transition-colors min-h-11 shadow-xs cursor-pointer"
        >
          <Mail class="w-4 h-4 text-slate-500" />
          <span>ផ្ញើសំណើសុំឯកសារបន្ថែម</span>
        </a>

        <button
          type="button"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer min-h-11"
          @click="handleDownloadAction"
        >
          <Download class="w-4 h-4" />
          <span>បោះពុម្ព / រក្សាទុកជា PDF</span>
        </button>
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
