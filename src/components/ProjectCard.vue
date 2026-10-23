<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '@/types/portfolio';
import ProjectPreview from '@/components/ProjectPreview.vue';
import { Github, ArrowUpRight, FileText } from 'lucide-vue-next';

interface Props {
  project: Project;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'select-case-study', project: Project): void;
}>();

// Limit strictly to maximum of 3 primary technology tags
const displayTags = computed<string[]>(() => {
  return props.project.tags.slice(0, 3);
});

// Check if project has an independent live web demo (different from github repo)
const hasLiveDemo = computed<boolean>(() => {
  return (
    Boolean(props.project.demoUrl) &&
    props.project.demoUrl !== props.project.githubUrl &&
    !props.project.demoUrl.includes('github.com')
  );
});
</script>

<template>
  <article
    class="project-card group h-full flex flex-col bg-white rounded-2xl sm:rounded-3xl border overflow-hidden cursor-pointer"
    @click="emit('select-case-study', props.project)"
  >
    <!-- 1. Large Product Screenshot & Fallback (Generous 16:10 Ratio for Mockups) -->
    <div class="p-3 sm:p-4 pb-0">
      <div
        class="relative w-full aspect-16/10 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950 select-none shadow-xs"
      >
        <div class="w-full h-full transition-transform duration-500 ease-out group-hover:scale-102">
          <ProjectPreview :project="props.project" />
        </div>
      </div>
    </div>

    <!-- 2. Card Body: Balanced spacing connecting preview with metadata -->
    <div class="px-4 sm:px-5 pt-2.5 sm:pt-3 pb-4 sm:pb-5 flex flex-col flex-1">
      <!-- Category Badge: Compact margin -->
      <div class="mb-1.5 flex items-center">
        <span
          class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-purple-50 text-purple-700 border border-purple-100/80 uppercase tracking-wider"
        >
          {{ props.project.category }}
        </span>
      </div>

      <!-- Project Title -->
      <h3
        class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-purple-600 transition-colors mb-2 flex items-start"
      >
        {{ props.project.title }}
      </h3>

      <!-- Description Region -->
      <p class="text-sm text-slate-600 leading-relaxed mb-3 flex items-start">
        {{ props.project.description }}
      </p>

      <!-- Dedicated Technology Tag Region -->
      <div class="flex flex-wrap items-start content-start gap-1.5 mb-3.5">
        <span
          v-for="tag in displayTags"
          :key="tag"
          class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60 whitespace-nowrap"
        >
          {{ tag }}
        </span>
      </div>

      <!-- 3. Bottom Action Row: Pushed to bottom via mt-auto with equal 2-column grid and aligned dividers -->
      <div class="mt-auto pt-3 border-t border-slate-100">
        <div class="grid grid-cols-2 gap-2.5 w-full">
          <!-- Primary Action: Full-width half column with guaranteed whitespace-nowrap -->
          <a
            v-if="hasLiveDemo"
            :href="props.project.demoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="h-10 px-3 py-2 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm hover:shadow-purple-600/20 transition-all duration-200 cursor-pointer whitespace-nowrap min-w-0 flex items-center justify-center gap-1.5"
            @click.stop
          >
            <span class="truncate">Live Demo</span>
            <ArrowUpRight class="w-3.5 h-3.5 shrink-0" />
          </a>
          <button
            v-else
            type="button"
            class="h-10 px-3 py-2 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm hover:shadow-purple-600/20 transition-all duration-200 cursor-pointer whitespace-nowrap min-w-0 flex items-center justify-center gap-1.5"
            @click.stop="emit('select-case-study', props.project)"
          >
            <FileText class="w-3.5 h-3.5 shrink-0" />
            <span class="truncate">Case Study</span>
          </button>

          <!-- Secondary Action: GitHub Source Code button -->
          <a
            :href="props.project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="h-10 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/70 text-xs font-semibold transition-all duration-200 whitespace-nowrap min-w-0 flex items-center justify-center gap-1.5"
            aria-label="View Source Code on GitHub"
            @click.stop
          >
            <Github class="w-3.5 h-3.5 shrink-0" />
            <span class="truncate">Source Code</span>
          </a>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  box-shadow:
    0 2px 8px rgba(30, 41, 59, 0.035),
    0 10px 30px rgba(99, 102, 241, 0.045);
  border-color: rgba(226, 232, 240, 0.85);
  transition:
    box-shadow 250ms ease,
    border-color 250ms ease,
    transform 250ms ease;
  will-change: auto;
}

.project-card:hover {
  box-shadow:
    0 6px 16px rgba(30, 41, 59, 0.055),
    0 16px 36px rgba(99, 102, 241, 0.075);
  border-color: rgba(192, 132, 252, 0.7);
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .project-card,
  .project-card:hover {
    transition: none !important;
    transform: none !important;
  }
}
</style>
