<script setup lang="ts">
import type { Project } from '@/types/portfolio';
import ProjectPreview from '@/components/ProjectPreview.vue';
import { ArrowRight, Github } from 'lucide-vue-next';

interface Props {
  project: Project;
  index?: number;
  showPreview?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  index: undefined,
  showPreview: false,
});

const emit = defineEmits<{
  (e: 'select-case-study', project: Project): void;
}>();

const handleOpenCaseStudy = (): void => {
  emit('select-case-study', props.project);
};
</script>

<template>
  <article
    class="editorial-project-entry group flex flex-col py-5 sm:py-6 first:pt-0 border-b border-slate-200/80 last:border-b-0 transition-colors"
  >
    <!-- Optional Embedded Product Preview Frame -->
    <div
      v-if="props.showPreview"
      class="relative w-full aspect-16/10 rounded-xl overflow-hidden border border-slate-200/90 bg-slate-950 mb-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      role="button"
      tabindex="0"
      :aria-label="`បើកមើលករណីសិក្សាសម្រាប់ ${props.project.title}`"
      @click="handleOpenCaseStudy"
      @keydown.enter.prevent="handleOpenCaseStudy"
      @keydown.space.prevent="handleOpenCaseStudy"
    >
      <ProjectPreview :project="props.project" />
    </div>

    <!-- 1. Metadata Header Row: Index Number & Category -->
    <div class="flex items-center justify-between gap-3 text-xs mb-2">
      <div class="flex items-center gap-2 text-slate-500">
        <span
          v-if="props.index !== undefined"
          class="font-mono text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors"
        >
          0{{ props.index }}
        </span>
        <span
          v-if="props.index !== undefined"
          class="text-slate-300 select-none"
          aria-hidden="true"
        >
          /
        </span>
        <span class="font-semibold tracking-wider text-slate-500 uppercase text-[11px]">
          {{ props.project.category }}
        </span>
      </div>

      <!-- Quick Case Study Trigger Link -->
      <button
        type="button"
        class="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-sm py-0.5"
        @click="handleOpenCaseStudy"
      >
        <span>ករណីសិក្សា</span>
        <ArrowRight
          class="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform"
        />
      </button>
    </div>

    <!-- 2. Primary Project Title (Semantic Button with Keyboard & Focus Support) -->
    <h3 class="text-xl sm:text-2xl font-bold font-heading text-slate-900 leading-snug">
      <button
        type="button"
        class="text-left font-bold text-slate-900 hover:text-slate-600 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-sm"
        @click="handleOpenCaseStudy"
      >
        {{ props.project.title }}
      </button>
    </h3>

    <!-- 3. Concise, Legible Description (No Clamping) -->
    <p class="text-sm text-slate-600 leading-relaxed font-normal text-pretty mt-2.5 flex-1">
      {{ props.project.description }}
    </p>

    <!-- 4. Quiet Technologies & Source Repository Footer -->
    <div class="flex flex-wrap items-center justify-between gap-3 pt-4 mt-2 text-xs text-slate-500">
      <!-- Quiet Technologies List -->
      <div class="flex flex-wrap items-center gap-1.5 font-medium text-slate-600">
        <span
          v-for="(tag, tagIndex) in props.project.tags"
          :key="tag"
          class="inline-flex items-center"
        >
          <span>{{ tag }}</span>
          <span
            v-if="tagIndex < props.project.tags.length - 1"
            class="mx-1.5 text-slate-300 select-none"
            aria-hidden="true"
          >
            /
          </span>
        </span>
      </div>

      <!-- Verified GitHub Source Code Link (Shown only if valid repository exists) -->
      <a
        v-if="props.project.githubUrl"
        :href="props.project.githubUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 font-medium text-slate-500 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-sm py-1"
        @click.stop
      >
        <Github class="w-3.5 h-3.5 text-slate-400" />
        <span>ប្រភពកូដ</span>
      </a>
    </div>
  </article>
</template>
