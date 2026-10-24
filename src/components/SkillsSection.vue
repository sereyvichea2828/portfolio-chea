<script setup lang="ts">
import { ref } from 'vue'
import { SKILL_GROUPS } from '@/data/portfolioData'
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'
import FrameworkCenterpiece from '@/components/FrameworkCenterpiece.vue'
import TechnologyLogo from '@/components/TechnologyLogo.vue'
import { Sparkles, Layers, Cpu } from 'lucide-vue-next'

const sectionRef = ref<HTMLElement | null>(null)
const activeTab = ref<string>('all')
const { isReducedMotion } = useReducedMotion()

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  const header = container.querySelector('.skills-header')
  const cards = container.querySelectorAll('.tech-card')

  if (header) {
    tl.fromTo(
      header,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,willChange' }
    )
  }

  if (cards.length > 0) {
    tl.fromTo(
      cards,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.04,
        ease: 'power3.out',
        clearProps: 'transform,scale,willChange',
      },
      '-=0.4'
    )
  }
})

const tabs = [
  { id: 'all', label: 'All Technologies' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Databases' },
  { id: 'tools', label: 'DevOps & Tools' },
] as const

const marqueeTechs = [
  { name: 'Vue 3', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Node.js', category: 'Runtime' },
  { name: 'Vite', category: 'Bundler' },
  { name: 'Three.js', category: '3D WebGL' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MongoDB', category: 'NoSQL' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'Docker', category: 'Containers' },
  { name: 'Git', category: 'VCS' },
  { name: 'Redis', category: 'Caching' },
] as const
</script>

<template>
  <section
    id="skills"
    ref="sectionRef"
    class="py-24 sm:py-32 relative z-10 overflow-hidden scroll-mt-24"
  >
    <!-- Soft Pearl Ambient Gradient Blobs -->
    <div
      class="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-linear-to-tr from-purple-200/30 via-indigo-100/20 to-transparent blur-3xl pointer-events-none"
      aria-hidden="true"
    />
    <div
      class="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-linear-to-bl from-cyan-100/30 via-purple-100/20 to-transparent blur-3xl pointer-events-none"
      aria-hidden="true"
    />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <!-- Section Header -->
      <div class="skills-header max-w-3xl mb-12 sm:mb-16 space-y-2">
        <p class="text-xs font-bold uppercase tracking-widest text-slate-500">
          TECHNICAL PROFILE & STACK
        </p>
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
        >
          Built With Modern Technologies
        </h2>
        <p class="text-base sm:text-lg text-slate-600 leading-relaxed">
          Tools and frameworks I use to build modern, scalable digital experiences.
        </p>
      </div>

      <!-- Framework Showcase Centerpiece -->
      <div class="mb-16">
        <FrameworkCenterpiece />
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-10 no-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 min-h-11 flex items-center justify-center"
          :class="[
            activeTab === tab.id
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs',
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Categorized Technology Cards Grid -->
      <div ref="cardsContainerRef" class="space-y-10">
        <div
          v-for="group in SKILL_GROUPS"
          :key="group.id"
          v-show="activeTab === 'all' || activeTab === group.id"
          class="space-y-4"
        >
          <!-- Group Title Bar -->
          <div class="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <div class="flex items-center gap-2.5">
              <span class="w-2 h-2 rounded-full bg-slate-900" />
              <h3 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {{ group.title }}
              </h3>
            </div>
            <span class="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              {{ group.skills.length }} Verified
            </span>
          </div>

          <!-- Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="skill in group.skills"
              :key="skill.name"
              class="tech-card group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 p-4 shadow-xs hover:border-slate-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div class="relative z-10 flex items-start gap-3.5">
                <!-- Tech Brand Logo Container with Hover Rotation -->
                <div
                  class="w-11 h-11 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                >
                  <TechnologyLogo :name="skill.name" size-class="w-6 h-6" />
                </div>

                <!-- Info Block -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <h4 class="text-sm font-bold text-slate-900 transition-colors truncate">
                      {{ skill.name }}
                    </h4>
                    <span
                      class="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 shrink-0"
                    >
                      {{ skill.experience }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-600 mt-1 leading-snug line-clamp-2">
                    {{ skill.highlight }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subtle Horizontal Continuous Technology Marquee Banner -->
      <div class="mt-16 pt-8 border-t border-slate-200/80 overflow-hidden">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-6">
          Active Engineering Ecosystem
        </p>

        <!-- Marquee Track with Pause on Hover -->
        <div class="marquee-wrapper relative w-full overflow-hidden mask-gradient-x py-1">
          <div
            class="marquee-track flex gap-4 w-max animate-marquee"
            :class="{ 'animate-none': isReducedMotion }"
          >
            <!-- Original Sequence -->
            <div
              v-for="item in marqueeTechs"
              :key="'m1-' + item.name"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white backdrop-blur-xs border border-white/90 hover:border-purple-300 shadow-2xs hover:shadow-xs transition-all duration-200 shrink-0 cursor-default"
            >
              <TechnologyLogo :name="item.name" size-class="w-4 h-4" />
              <span class="text-xs font-semibold text-slate-800">{{ item.name }}</span>
            </div>

            <!-- Duplicated Sequence for Infinite Smooth Marquee Loop -->
            <div
              v-for="item in marqueeTechs"
              :key="'m2-' + item.name"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white backdrop-blur-xs border border-white/90 hover:border-purple-300 shadow-2xs hover:shadow-xs transition-all duration-200 shrink-0 cursor-default"
            >
              <TechnologyLogo :name="item.name" size-class="w-4 h-4" />
              <span class="text-xs font-semibold text-slate-800">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

.marquee-wrapper:hover .marquee-track,
.marquee-track:hover {
  animation-play-state: paused;
}

.mask-gradient-x {
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
