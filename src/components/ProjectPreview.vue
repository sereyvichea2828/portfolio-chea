<script setup lang="ts">
import { ref } from 'vue';
import type { Project } from '@/types/portfolio';
import CampusMockup from '@/components/mockups/CampusMockup.vue';
import MathMockup from '@/components/mockups/MathMockup.vue';
import IeeMockup from '@/components/mockups/IeeMockup.vue';

interface Props {
  project: Project;
}

const props = defineProps<Props>();

const imageError = ref<boolean>(false);
const imageLoaded = ref<boolean>(false);

const handleImageError = (): void => {
  imageError.value = true;
};

const handleImageLoad = (): void => {
  imageLoaded.value = true;
};
</script>

<template>
  <div class="relative w-full h-full select-none overflow-hidden bg-slate-950">
    <!-- 1. Genuine Project Screenshot (Rendered when valid imageUrl exists and no load failure) -->
    <template v-if="props.project.imageUrl && !imageError">
      <img
        :src="props.project.imageUrl"
        :alt="props.project.imageAlt || props.project.title"
        class="w-full h-full object-contain transition-opacity duration-300"
        :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
        loading="lazy"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </template>

    <!-- 2. Custom Designed Visual Mockup Preview (Project-Specific Architectural Representation) -->
    <template v-else>
      <CampusMockup v-if="props.project.mockupType === 'campus'" />
      <MathMockup v-else-if="props.project.mockupType === 'math'" />
      <IeeMockup v-else-if="props.project.mockupType === 'iee'" />
    </template>
  </div>
</template>
