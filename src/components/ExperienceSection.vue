<script setup lang="ts">
import { EXPERIENCES } from '@/data/portfolioData'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { Calendar, MapPin } from 'lucide-vue-next'

const { targetRef, isVisible } = useScrollReveal(0.12)
const { isReducedMotion } = useReducedMotion()
</script>

<template>
  <section
    id="experience"
    ref="targetRef"
    class="py-24 relative z-10 transition-[transform,opacity] duration-700 ease-out"
    :class="[
      isVisible || isReducedMotion ? 'opacity-100 transform-none' : 'opacity-0 translate-y-6',
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="max-w-3xl mb-16">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-8 h-px bg-cyan-400/60" />
          <p class="text-xs font-mono uppercase tracking-widest text-cyan-400 font-medium">
            CAREER TRAJECTORY
          </p>
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wider text-white leading-tight">
          Experience & Architecture
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-300">
          A continuous track record of scaling frontend systems, shipping high-uptime backends, and upholding engineering standards.
        </p>
      </div>

      <!-- Timeline Structure -->
      <div class="relative pl-6 sm:pl-8 border-l border-slate-800/80 space-y-12">
        <div
          v-for="exp in EXPERIENCES"
          :key="exp.id"
          class="relative group"
        >
          <!-- Timeline Glowing Node Anchor (Centered on border with standard -left-2) -->
          <div
            class="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 transition-colors duration-300 flex items-center justify-center"
            :class="[
              exp.isCurrent
                ? 'border-cyan-400 shadow-sm shadow-cyan-400/50'
                : 'border-slate-700 group-hover:border-slate-500',
            ]"
          >
            <div
              v-if="exp.isCurrent"
              class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
            />
          </div>

          <!-- Experience Card (Complying with Anti-Gravity Standards) -->
          <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/20 hover:border-slate-700/80 transition-all duration-200">
            <!-- Header Meta -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
              <div>
                <h3 class="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {{ exp.role }}
                </h3>
                <p class="text-sm font-semibold text-cyan-400 mt-0.5">
                  {{ exp.company }}
                </p>
              </div>

              <div class="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span class="inline-flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5 text-slate-500" />
                  {{ exp.period }}
                </span>
                <span class="text-slate-600">•</span>
                <span class="inline-flex items-center gap-1">
                  <MapPin class="w-3.5 h-3.5 text-slate-500" />
                  {{ exp.location }}
                </span>
              </div>
            </div>

            <!-- Role Description Narrative -->
            <p class="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
              {{ exp.description }}
            </p>

            <!-- Key Production Achievements -->
            <div class="space-y-2 mb-6">
              <div
                v-for="(achieve, idx) in exp.achievements"
                :key="idx"
                class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <span>{{ achieve }}</span>
              </div>
            </div>

            <!-- Tech Badges -->
            <div class="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
              <span
                v-for="tech in exp.technologies"
                :key="tech"
                class="px-2.5 py-1 rounded text-xs font-mono bg-slate-900/90 text-slate-400 border border-slate-800"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
