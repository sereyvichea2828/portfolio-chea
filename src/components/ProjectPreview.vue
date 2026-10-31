<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Project } from '@/types/portfolio';
import CampusMockup from '@/components/mockups/CampusMockup.vue';
import MathMockup from '@/components/mockups/MathMockup.vue';
import { Layers } from 'lucide-vue-next';

interface Props {
  project: Project;
}

const props = defineProps<Props>();

const imageError = ref<boolean>(false);
const imageLoaded = ref<boolean>(false);

// Reset image loading and error states whenever the project or its imageUrl changes
watch(
  () => `${props.project?.id || ''}_${props.project?.imageUrl || ''}`,
  () => {
    imageError.value = false;
    imageLoaded.value = false;
  },
  { immediate: true },
);

const handleImageError = (): void => {
  imageError.value = true;
  imageLoaded.value = false;
};

const handleImageLoad = (): void => {
  imageLoaded.value = true;
  imageError.value = false;
};

const hasValidImage = computed<boolean>(() => {
  return Boolean(props.project?.imageUrl && !imageError.value);
});
</script>

<template>
  <div class="relative w-full h-full select-none overflow-hidden bg-slate-100 flex items-center justify-center">
    <!-- 1. Authentic Project Screenshot (Displayed when valid imageUrl exists and load succeeds) -->
    <template v-if="hasValidImage">
      <img
        :src="props.project.imageUrl"
        :alt="props.project.imageAlt || props.project.title"
        class="w-full h-full object-cover object-top block transition-transform duration-300 group-hover:scale-[1.01]"
        :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
        loading="eager"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </template>

    <!-- 2. Authentic Project-Specific Domain Mockups (Fallback) -->
    <template v-else-if="props.project.mockupType === 'campus'">
      <CampusMockup />
    </template>
    <template v-else-if="props.project.mockupType === 'math'">
      <MathMockup />
    </template>

    <!-- 3. Neutral Fallback Presentation for Unrecognized / Empty Mockup Types (Zero Blank Previews) -->
    <template v-else>
      <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-slate-300">
        <div class="w-10 h-10 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
          <Layers class="w-5 h-5" />
        </div>
        <p class="font-bold text-white text-sm">{{ props.project.title }}</p>
        <p class="text-xs text-slate-400 mt-1 max-w-xs">
          {{ props.project.category }}
          <template v-if="props.project.tags?.length">
            / {{ props.project.tags.join(', ') }}
          </template>
        </p>
      </div>
    </template>
  </div>
</template>
