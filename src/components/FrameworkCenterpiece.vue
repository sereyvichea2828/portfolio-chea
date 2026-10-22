<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TechLogo from '@/components/TechLogo.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SatelliteTech {
  id: string
  name: string
  role: string
  color: string
  borderColor: string
  glowColor: string
  desktopPos: { x: number; y: number } // Percentage offset from center
}

const SATELLITES: readonly SatelliteTech[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    role: 'Strict Contracts',
    color: 'text-blue-600',
    borderColor: 'border-blue-200/80',
    glowColor: 'shadow-blue-500/10',
    desktopPos: { x: 0, y: -135 },
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    role: 'Utility Scaling',
    color: 'text-cyan-600',
    borderColor: 'border-cyan-200/80',
    glowColor: 'shadow-cyan-500/10',
    desktopPos: { x: 135, y: -70 },
  },
  {
    id: 'vite',
    name: 'Vite',
    role: 'Fast Bundling',
    color: 'text-purple-600',
    borderColor: 'border-purple-200/80',
    glowColor: 'shadow-purple-500/10',
    desktopPos: { x: 135, y: 70 },
  },
  {
    id: 'node',
    name: 'Node.js',
    role: 'Backend Concurrency',
    color: 'text-emerald-600',
    borderColor: 'border-emerald-200/80',
    glowColor: 'shadow-emerald-500/10',
    desktopPos: { x: 0, y: 135 },
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    role: 'Relational Store',
    color: 'text-indigo-600',
    borderColor: 'border-indigo-200/80',
    glowColor: 'shadow-indigo-500/10',
    desktopPos: { x: -135, y: 70 },
  },
  {
    id: 'three',
    name: 'Three.js',
    role: '3D WebGL Shaders',
    color: 'text-slate-800',
    borderColor: 'border-purple-200/80',
    glowColor: 'shadow-purple-500/10',
    desktopPos: { x: -135, y: -70 },
  },
] as const

const containerRef = ref<HTMLDivElement | null>(null)
const centerHubRef = ref<HTMLDivElement | null>(null)
const satelliteRefs = ref<HTMLElement[]>([])
const { isReducedMotion } = useReducedMotion()

const activeTechId = ref<string>('vue')
const parallaxX = ref<number>(0)
const parallaxY = ref<number>(0)

let scrollTriggerInstance: ScrollTrigger | null = null

const handlePointerMove = (e: MouseEvent): void => {
  if (isReducedMotion.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const normX = (e.clientX - rect.left) / rect.width - 0.5
  const normY = (e.clientY - rect.top) / rect.height - 0.5
  parallaxX.value = normX * 16
  parallaxY.value = normY * 16
}

const handlePointerLeave = (): void => {
  parallaxX.value = 0
  parallaxY.value = 0
}

onMounted(() => {
  if (typeof window === 'undefined') return

  if (isReducedMotion.value) {
    if (centerHubRef.value) centerHubRef.value.style.opacity = '1'
    satelliteRefs.value.forEach((el) => {
      if (el) el.style.opacity = '1'
    })
    return
  }

  if (containerRef.value && centerHubRef.value) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 80%',
        once: true,
      },
    })

    scrollTriggerInstance = tl.scrollTrigger ?? null

    tl.fromTo(
      centerHubRef.value,
      { scale: 0.7, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'back.out(1.5)' }
    )

    if (satelliteRefs.value.length > 0) {
      tl.fromTo(
        satelliteRefs.value,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.5'
      )
    }
  }
})

onUnmounted(() => {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill()
    scrollTriggerInstance = null
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full max-w-4xl mx-auto py-12 px-4 select-none"
    @mousemove="handlePointerMove"
    @mouseleave="handlePointerLeave"
  >
    <!-- Soft Pearl Ambient Light Backdrop -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-linear-to-tr from-purple-200/35 via-indigo-100/25 to-cyan-100/30 blur-3xl pointer-events-none"
      aria-hidden="true"
    />

    <!-- Desktop & Tablet Radial Orbital Constellation (Hidden on small mobile) -->
    <div
      class="hidden md:flex relative items-center justify-center h-96 w-full transition-transform duration-300 ease-out will-change-transform"
      :style="{
        transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
      }"
    >
      <!-- Connected Radial SVG Lines -->
      <svg
        class="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="-220 -180 440 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <!-- Concentric ambient orbital guide rings -->
        <circle cx="0" cy="0" r="140" stroke="#E9D5FF" stroke-width="1" stroke-dasharray="4 6" opacity="0.6" />
        <circle cx="0" cy="0" r="75" stroke="#E0E7FF" stroke-width="1" opacity="0.4" />

        <!-- Radial spoke lines to each satellite -->
        <g v-for="sat in SATELLITES" :key="sat.id">
          <line
            x1="0"
            y1="0"
            :x2="sat.desktopPos.x"
            :y2="sat.desktopPos.y"
            stroke="url(#line-gradient)"
            stroke-width="1.5"
            stroke-dasharray="3 4"
            opacity="0.75"
          />
          <!-- Animated pulse dot on connection line -->
          <circle
            :cx="sat.desktopPos.x * 0.55"
            :cy="sat.desktopPos.y * 0.55"
            r="2"
            fill="#9333EA"
            opacity="0.7"
          >
            <animate
              attributeName="opacity"
              values="0.2;1;0.2"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#C084FC" stop-opacity="0.8" />
            <stop offset="50%" stop-color="#818CF8" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Centerpiece Hub: Vue 3 Primary Engine -->
      <div
        ref="centerHubRef"
        class="relative z-10 flex flex-col items-center justify-center transition-all duration-300 group cursor-pointer"
        @mouseenter="activeTechId = 'vue'"
      >
        <div
          class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-xl shadow-purple-950/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-emerald-500/15 group-hover:border-emerald-300/80"
        >
          <!-- Soft glowing halo behind Vue logo -->
          <div
            class="absolute inset-0 rounded-3xl bg-linear-to-tr from-emerald-400/20 via-purple-300/20 to-cyan-300/20 blur-md pointer-events-none"
            aria-hidden="true"
          />
          <TechLogo name="vue" size-class="w-14 h-14 sm:w-16 sm:h-16" />
        </div>

        <div
          class="mt-2.5 px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-xs font-bold text-emerald-700 shadow-xs flex items-center gap-1.5"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Core Engine • Vue 3</span>
        </div>
      </div>

      <!-- Orbital Satellites -->
      <div
        v-for="(sat, idx) in SATELLITES"
        :key="sat.id"
        :ref="(el) => { if (el) satelliteRefs[idx] = el as HTMLElement }"
        class="absolute z-10 transition-all duration-300 ease-out cursor-pointer group"
        :style="{
          transform: `translate3d(${sat.desktopPos.x}px, ${sat.desktopPos.y}px, 0)`,
        }"
        @mouseenter="activeTechId = sat.id"
      >
        <div
          class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border shadow-md transition-all duration-300 group-hover:scale-108 group-hover:-translate-y-1 group-hover:bg-white"
          :class="[sat.borderColor, sat.glowColor]"
        >
          <TechLogo :name="sat.name" size-class="w-7 h-7" />
          <div class="flex flex-col text-left">
            <span class="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
              {{ sat.name }}
            </span>
            <span class="text-xs text-slate-500 font-medium leading-none">
              {{ sat.role }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Responsive Grid (320px–767px) -->
    <div class="md:hidden flex flex-col items-center space-y-6">
      <!-- Vue 3 Mobile Centerpiece -->
      <div class="flex flex-col items-center">
        <div
          class="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-xl border border-white shadow-lg shadow-purple-950/10 flex items-center justify-center p-3"
        >
          <TechLogo name="vue" size-class="w-12 h-12" />
        </div>
        <span class="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Core Engine • Vue 3
        </span>
      </div>

      <!-- Supporting Technologies Responsive Grid -->
      <div class="grid grid-cols-2 gap-3 w-full">
        <div
          v-for="sat in SATELLITES"
          :key="sat.id"
          class="flex items-center gap-2 p-3 rounded-2xl bg-white/80 border border-slate-100 shadow-xs"
        >
          <TechLogo :name="sat.name" size-class="w-6 h-6" />
          <div class="flex flex-col text-left min-w-0">
            <span class="text-xs font-bold text-slate-900 truncate">{{ sat.name }}</span>
            <span class="text-xs text-slate-500 truncate">{{ sat.role }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
