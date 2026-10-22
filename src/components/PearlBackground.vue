<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useReducedMotion } from '@/composables/useReducedMotion';

const { isReducedMotion } = useReducedMotion();

const lightX = ref<number>(50);
const lightY = ref<number>(30);

let targetX = 50;
let targetY = 30;
let currentX = 50;
let currentY = 30;
let rafId: number | null = null;
let lastTime = performance.now();

const handleMouseMove = (e: MouseEvent): void => {
  const width = window.innerWidth || 1;
  const height = window.innerHeight || 1;
  targetX = (e.clientX / width) * 100;
  targetY = (e.clientY / height) * 100;
};

const updateLightPhysics = (): void => {
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  // Silky frame-rate independent easing
  const factor = 1.0 - Math.exp(-4.5 * dt);
  currentX += (targetX - currentX) * factor;
  currentY += (targetY - currentY) * factor;

  lightX.value = currentX;
  lightY.value = currentY;

  rafId = requestAnimationFrame(updateLightPhysics);
};

onMounted(() => {
  if (typeof window === 'undefined') return;
  if (!isReducedMotion.value) {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    lastTime = performance.now();
    rafId = requestAnimationFrame(updateLightPhysics);
  }
});

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleMouseMove);
  }
});
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-pearl-bg" aria-hidden="true">
    <!-- Base Pearl Ambient Radial linears -->
    <!-- Large soft lavender aura at top-right -->
    <div
      class="absolute -top-32 -right-32 w-160 h-160 rounded-full bg-linear-to-br from-purple-200/50 via-indigo-100/40 to-transparent blur-3xl opacity-80"
    />

    <!-- Pale mist blue aura at center-left -->
    <div
      class="absolute top-1/4 -left-32 w-xl h-144 rounded-full bg-linear-to-tr from-sky-100/60 via-blue-50/40 to-transparent blur-3xl opacity-75"
    />

    <!-- Subtle aqua/cyan ambient highlight at bottom-right -->
    <div
      class="absolute bottom-12 -right-12 w-lg h-128 rounded-full bg-linear-to-tl from-cyan-100/40 via-purple-100/30 to-transparent blur-3xl opacity-60"
    />

    <!-- Soft pale lavender wash behind hero/center -->
    <div
      class="absolute top-1/3 left-1/3 w-xl h-144 rounded-full bg-purple-100/35 blur-3xl opacity-60"
    />

    <!-- Interactive Pointer-Following Soft Light Aura -->
    <div
      v-if="!isReducedMotion"
      class="absolute w-lg h-128 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-opacity duration-500"
      :style="{
        left: `${lightX}%`,
        top: `${lightY}%`,
        background:
          'radial-linear(circle, rgba(155, 135, 245, 0.12) 0%, rgba(121, 153, 250, 0.06) 40%, transparent 70%)',
      }"
    />

    <!-- Ultra-subtle micro-grain for porcelain depth -->
    <div
      class="absolute inset-0 opacity-20 pointer-events-none"
      style="
        background-image: radial-linear(#151827 0.5px, transparent 0.5px);
        background-size: 32px 32px;
      "
    />
  </div>
</template>
