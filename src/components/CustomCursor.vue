<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { isReducedMotion } = useReducedMotion()

const isVisible = ref<boolean>(false)
const isHovering = ref<boolean>(false)
const isClicking = ref<boolean>(false)
const isTouchDevice = ref<boolean>(false)

let targetX = -100
let targetY = -100
let dotX = -100
let dotY = -100
let ringX = -100
let ringY = -100

let lastTime = performance.now()
let rafId: number | null = null

const dotElementRef = ref<HTMLDivElement | null>(null)
const ringElementRef = ref<HTMLDivElement | null>(null)

const handleMouseMove = (e: MouseEvent): void => {
  targetX = e.clientX
  targetY = e.clientY
  if (!isVisible.value) {
    isVisible.value = true
    dotX = targetX
    dotY = targetY
    ringX = targetX
    ringY = targetY
  }
}

const handleMouseDown = (): void => {
  isClicking.value = true
}

const handleMouseUp = (): void => {
  isClicking.value = false
}

const handleMouseLeave = (): void => {
  isVisible.value = false
}

const handleMouseEnter = (): void => {
  isVisible.value = true
}

const handleElementHover = (e: MouseEvent): void => {
  const target = e.target as HTMLElement | null
  if (!target) return

  const interactive = target.closest('a, button, input, textarea, select, [data-cursor="pointer"]')
  isHovering.value = !!interactive
}

const updateCursorPhysics = (): void => {
  const now = performance.now()
  const dt = Math.min((now - lastTime) / 1000, 0.1)
  lastTime = now

  const dotFactor = 1.0 - Math.exp(-28.0 * dt)
  const ringFactor = 1.0 - Math.exp(-10.0 * dt)

  dotX += (targetX - dotX) * dotFactor
  dotY += (targetY - dotY) * dotFactor

  ringX += (targetX - ringX) * ringFactor
  ringY += (targetY - ringY) * ringFactor

  if (dotElementRef.value) {
    dotElementRef.value.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`
  }

  if (ringElementRef.value) {
    ringElementRef.value.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
  }

  rafId = requestAnimationFrame(updateCursorPhysics)
}

onMounted(() => {
  if (typeof window === 'undefined') return

  if (window.matchMedia('(pointer: coarse)').matches) {
    isTouchDevice.value = true
    return
  }

  lastTime = performance.now()
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('mousemove', handleElementHover, { passive: true })
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('mouseenter', handleMouseEnter)

  rafId = requestAnimationFrame(updateCursorPhysics)
})

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }

  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mousemove', handleElementHover)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mouseleave', handleMouseLeave)
    document.removeEventListener('mouseenter', handleMouseEnter)
  }
})
</script>

<template>
  <div
    v-if="!isTouchDevice && !isReducedMotion"
    class="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    :class="{ 'opacity-100': isVisible, 'opacity-0': !isVisible }"
    aria-hidden="true"
  >
    <!-- Trailing soft lavender pearl halo -->
    <div
      ref="ringElementRef"
      class="fixed -top-5 -left-5 w-10 h-10 rounded-full border border-purple-400/50 bg-purple-300/15 shadow-xs shadow-purple-500/15 transition-transform duration-100 ease-out flex items-center justify-center pointer-events-none will-change-transform"
      :class="{
        'scale-140 border-purple-600/80 bg-purple-400/25 shadow-md shadow-purple-500/30': isHovering,
        'scale-85 border-purple-700/90': isClicking,
      }"
    />

    <!-- Precise center point -->
    <div
      ref="dotElementRef"
      class="fixed -top-1 -left-1 w-2 h-2 rounded-full bg-linear-to-tr from-purple-600 to-indigo-500 shadow-xs shadow-purple-500/60 pointer-events-none transition-transform duration-75 will-change-transform"
      :class="{
        'from-purple-500 to-cyan-500 scale-125': isHovering,
        'scale-75': isClicking,
      }"
    />
  </div>
</template>
