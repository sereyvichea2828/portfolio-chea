<script setup lang="ts">
import { ref } from 'vue'
import { SERVICES } from '@/data/portfolioData'
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { Layout, Server, Layers, Database, ArrowUpRight, CheckCircle2 } from 'lucide-vue-next'

const sectionRef = ref<HTMLElement | null>(null)
const { isReducedMotion } = useReducedMotion()

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  const header = container.querySelector('.services-header')
  const cards = container.querySelectorAll('.service-card')

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
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.09, ease: 'power3.out', clearProps: 'transform,scale,willChange' },
      '-=0.4'
    )
  }
})

const getServiceIcon = (name: string) => {
  switch (name) {
    case 'Layout':
      return Layout
    case 'Server':
      return Server
    case 'Layers':
      return Layers
    default:
      return Database
  }
}

const getAccentClasses = (color: string) => {
  switch (color) {
    case 'lavender':
      return {
        iconBg: 'bg-purple-100 text-purple-600',
        badge: 'text-purple-700 bg-purple-50',
      }
    case 'periwinkle':
      return {
        iconBg: 'bg-indigo-100 text-indigo-600',
        badge: 'text-indigo-700 bg-indigo-50',
      }
    case 'aqua':
      return {
        iconBg: 'bg-cyan-100 text-cyan-700',
        badge: 'text-cyan-800 bg-cyan-50',
      }
    default:
      return {
        iconBg: 'bg-blue-100 text-blue-600',
        badge: 'text-blue-700 bg-blue-50',
      }
  }
}
</script>

<template>
  <section
    id="services"
    ref="sectionRef"
    class="py-24 relative z-10 scroll-mt-24"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="services-header max-w-3xl mb-16">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-8 h-0.5 bg-linear-to-r from-purple-400 to-indigo-400 rounded-full" />
          <p class="text-xs font-bold uppercase tracking-widest text-purple-600">
            SERVICES & EXPERTISE
          </p>
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider text-ink-primary leading-tight">
          Services I Offer
        </h2>
        <p class="mt-4 text-base sm:text-lg text-ink-secondary">
          End-to-end full-stack capabilities combining intuitive user interfaces with resilient distributed backend logic.
        </p>
      </div>

      <!-- Services 2x2 Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div
          v-for="service in SERVICES"
          :key="service.id"
          class="service-card group relative bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-7 sm:p-8 shadow-md shadow-purple-950/5 hover:shadow-xl hover:shadow-purple-950/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <!-- Soft Moving Specular Highlight on Hover -->
          <div
            class="absolute inset-0 bg-linear-to-br from-white/60 via-transparent to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            aria-hidden="true"
          />

          <div class="relative z-10 space-y-5">
            <!-- Icon & Directional Arrow Header -->
            <div class="flex items-start justify-between">
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105"
                :class="getAccentClasses(service.accentColor).iconBg"
              >
                <component :is="getServiceIcon(service.iconName)" class="w-6 h-6" />
              </div>

              <div
                class="w-9 h-9 rounded-full bg-white/80 border border-slate-100 flex items-center justify-center text-ink-secondary group-hover:text-purple-600 group-hover:border-purple-200 transition-all"
              >
                <ArrowUpRight class="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            <!-- Title & Description -->
            <div>
              <h3 class="text-xl font-bold text-ink-primary tracking-tight group-hover:text-purple-900 transition-colors">
                {{ service.title }}
              </h3>
              <p class="text-sm text-ink-secondary leading-relaxed mt-2">
                {{ service.description }}
              </p>
            </div>

            <!-- Feature Bullet List -->
            <div class="space-y-2 pt-2 border-t border-slate-100">
              <div
                v-for="(item, idx) in service.items"
                :key="idx"
                class="flex items-center gap-2.5 text-xs sm:text-sm text-ink-primary/80"
              >
                <CheckCircle2 class="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
