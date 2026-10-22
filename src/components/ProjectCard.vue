<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Project } from '@/types/portfolio';
import FinanceMockup from '@/components/mockups/FinanceMockup.vue';
import TasksMockup from '@/components/mockups/TasksMockup.vue';
import ApiMockup from '@/components/mockups/ApiMockup.vue';
import { ExternalLink, Github, ArrowUpRight, FileText } from 'lucide-vue-next';

interface Props {
  project: Project;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'select-case-study', project: Project): void;
}>();

const cardRef = ref<HTMLDivElement | null>(null);

let targetRotX = 0;
let targetRotY = 0;
let currentRotX = 0;
let currentRotY = 0;

let lightTargetX = 50;
let lightTargetY = 50;
let currentLightX = 50;
let currentLightY = 50;

let animFrameId: number | null = null;
let lastTime = performance.now();

const handleMouseMove = (e: MouseEvent): void => {
  if (!cardRef.value) return;
  const rect = cardRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  targetRotY = (x / rect.width - 0.5) * 4.0;
  targetRotX = -((y / rect.height - 0.5) * 4.0);

  lightTargetX = (x / rect.width) * 100;
  lightTargetY = (y / rect.height) * 100;
};

const handleMouseLeave = (): void => {
  targetRotX = 0;
  targetRotY = 0;
  lightTargetX = 50;
  lightTargetY = 50;
};

const updatePhysics = (): void => {
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  const tiltFactor = 1.0 - Math.exp(-12.0 * dt);
  currentRotX += (targetRotX - currentRotX) * tiltFactor;
  currentRotY += (targetRotY - currentRotY) * tiltFactor;

  const lightFactor = 1.0 - Math.exp(-8.0 * dt);
  currentLightX += (lightTargetX - currentLightX) * lightFactor;
  currentLightY += (lightTargetY - currentLightY) * lightFactor;

  if (cardRef.value) {
    cardRef.value.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
    cardRef.value.style.setProperty('--light-x', `${currentLightX.toFixed(1)}%`);
    cardRef.value.style.setProperty('--light-y', `${currentLightY.toFixed(1)}%`);
  }

  animFrameId = requestAnimationFrame(updatePhysics);
};

onMounted(() => {
  lastTime = performance.now();
  animFrameId = requestAnimationFrame(updatePhysics);
});

onUnmounted(() => {
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
});
</script>

<template>
  <div
    ref="cardRef"
    class="relative bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl shadow-lg shadow-purple-950/5 hover:shadow-2xl hover:shadow-purple-950/15 transition-all duration-300 flex flex-col justify-between overflow-hidden group will-change-transform h-full"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Soft Moving Specular Spotlight on Card Hover -->
    <div
      class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      style="
        background: radial-gradient(
          500px circle at var(--light-x, 50%) var(--light-y, 50%),
          rgba(255, 255, 255, 0.75),
          transparent 70%
        );
      "
      aria-hidden="true"
    />

    <!-- Top: Product Preview Window with Frame & Rounded Corners -->
    <div class="p-3 sm:p-4 pb-0 relative z-10">
      <div
        class="relative w-full aspect-16/10 rounded-2xl overflow-hidden border border-slate-900/40 shadow-inner group-hover:shadow-purple-500/10 transition-all duration-300 bg-slate-950 cursor-pointer"
        @click="emit('select-case-study', props.project)"
      >
        <FinanceMockup v-if="props.project.mockupType === 'finance'" />
        <TasksMockup v-else-if="props.project.mockupType === 'tasks'" />
        <ApiMockup v-else-if="props.project.mockupType === 'api'" />

        <!-- Sleek Floating Bottom Glass Action Dock (Non-intrusive & Strictly No-Wrap) -->
        <div
          class="absolute inset-x-0 bottom-0 pt-10 pb-2.5 px-3 bg-linear-to-t from-slate-950/95 via-slate-950/60 to-transparent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-end gap-2 z-20 pointer-events-none group-hover:pointer-events-auto flex-nowrap"
        >
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-purple-500/50 text-xs font-semibold backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md shadow-black/30 hover:scale-102 active:scale-95 shrink-0 whitespace-nowrap"
            @click.stop="emit('select-case-study', props.project)"
          >
            <FileText class="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span class="whitespace-nowrap">Case Study</span>
          </button>

          <a
            :href="props.project.demoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white border border-purple-400/40 text-xs font-semibold backdrop-blur-md transition-all duration-200 shadow-md shadow-purple-950/30 hover:scale-102 active:scale-95 shrink-0 whitespace-nowrap"
            @click.stop
          >
            <span class="whitespace-nowrap">Live Demo</span>
            <ArrowUpRight class="w-3.5 h-3.5 text-purple-200 shrink-0" />
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom Half: Project Narrative & Meta -->
    <div class="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-4 relative z-20">
      <div class="space-y-3">
        <!-- Category Pill & Primary Stat -->
        <div class="flex items-center justify-between gap-2">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100/80"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span>{{ props.project.category }}</span>
          </span>
          <span
            class="text-xs font-mono font-semibold text-slate-600 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/60"
          >
            {{ props.project.metrics[0]?.value }}
          </span>
        </div>

        <!-- Title & Tagline -->
        <div>
          <h3
            class="text-xl font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors tracking-tight leading-snug"
          >
            {{ props.project.title }}
          </h3>
          <p class="text-xs text-slate-500 font-medium mt-1">
            {{ props.project.tagline }}
          </p>
        </div>

        <!-- Description with line-clamp for neat balance -->
        <p class="text-sm text-slate-600 leading-relaxed line-clamp-2">
          {{ props.project.description }}
        </p>

        <!-- 3 Engineering Metrics Strip -->
        <div class="grid grid-cols-3 gap-1.5 pt-1">
          <div
            v-for="metric in props.project.metrics"
            :key="metric.label"
            class="p-2 rounded-xl bg-slate-50/90 border border-slate-200/50 text-center"
          >
            <span class="text-xs text-slate-400 block truncate">{{ metric.label }}</span>
            <span class="text-xs font-bold text-slate-800 block truncate mt-0.5">{{ metric.value }}</span>
          </div>
        </div>

        <!-- Tech Stack Badges -->
        <div class="flex flex-wrap gap-1.5 pt-1">
          <span
            v-for="tag in props.project.tags"
            :key="tag"
            class="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Action Footer Links -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-bold tracking-wide transition-colors group/btn cursor-pointer focus:outline-none"
          @click="emit('select-case-study', props.project)"
        >
          <span>EXPLORE ARCHITECTURE</span>
          <ArrowUpRight
            class="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
          />
        </button>

        <div class="flex items-center gap-2">
          <a
            :href="props.project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 flex items-center justify-center transition-colors"
            aria-label="GitHub Repository"
          >
            <Github class="w-4 h-4" />
          </a>
          <a
            :href="props.project.demoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 flex items-center justify-center transition-colors"
            aria-label="Live Demo Link"
          >
            <ExternalLink class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
