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
        iconBg: 'bg-slate-100 text-slate-800 border border-slate-200/80',
        badge: 'text-slate-800 bg-slate-100',
      }
    case 'periwinkle':
      return {
        iconBg: 'bg-slate-100 text-slate-800 border border-slate-200/80',
        badge: 'text-slate-800 bg-slate-100',
      }
    case 'aqua':
      return {
        iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
        badge: 'text-emerald-800 bg-emerald-50',
      }
    default:
      return {
        iconBg: 'bg-slate-100 text-slate-800 border border-slate-200/80',
        badge: 'text-slate-800 bg-slate-100',
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
      <div class="services-header max-w-3xl mb-14 sm:mb-16 space-y-2">
        <p class="text-xs font-bold uppercase tracking-widest text-slate-500">
          SERVICES & EXPERTISE
        </p>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Services I Offer
        </h2>
        <p class="text-base sm:text-lg text-slate-600">
          End-to-end full-stack capabilities combining intuitive user interfaces with resilient distributed backend logic.
        </p>
      </div>

      <!-- Services 2x2 Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div
          v-for="service in SERVICES"
          :key="service.id"
          class="service-card group relative bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
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
                class="w-9 h-9 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-100 transition-all"
              >
                <ArrowUpRight class="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            <!-- Title & Description -->
            <div>
              <h3 class="text-xl font-bold text-slate-900 tracking-tight transition-colors">
                {{ service.title }}
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed mt-2">
                {{ service.description }}
              </p>
            </div>

            <!-- Feature Bullet List -->
            <div class="space-y-2 pt-2 border-t border-slate-100">
              <div
                v-for="(item, idx) in service.items"
                :key="idx"
                class="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700"
              >
                <CheckCircle2 class="w-3.5 h-3.5 text-slate-900 shrink-0" />
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
