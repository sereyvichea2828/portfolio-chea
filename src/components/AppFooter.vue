<script setup lang="ts">
import { ref, inject } from 'vue';
import { NAVIGATION_ITEMS, CONTACT_INFO, HERO_CONTENT } from '@/data/portfolioData';
import type { NavItem } from '@/types/portfolio';
import DtMonogram from '@/components/DtMonogram.vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { useReducedMotion } from '@/composables/useReducedMotion';
import {
  ArrowUp,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Send,
  Code2,
} from 'lucide-vue-next';

import type { SmoothScrollController } from '@/composables/useSmoothScroll';

const FOOTER_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
] as const;

const currentYear = new Date().getFullYear();

const { targetRef, isVisible } = useScrollReveal(0.08);
const { isReducedMotion } = useReducedMotion();

const scrollToSection = inject<(sectionId: string, updateUrl?: boolean) => void>('scrollToSection');
const smoothScroll = inject<SmoothScrollController>('smoothScroll');

const handleNavClick = (href: string): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  const cleanId = href.replace('#', '').replace('/', '') || 'home';
  if (scrollToSection) {
    scrollToSection(cleanId, true);
  } else if (typeof window !== 'undefined') {
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

const scrollToTop = (): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  if (smoothScroll) {
    smoothScroll.scrollTo(0, { offset: 0, duration: 0.85 });
  } else if (scrollToSection) {
    scrollToSection('home', true);
  } else if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Subtle ambient pointer reflection across the pearl glass panel
const footerPanelRef = ref<HTMLDivElement | null>(null);

const handlePointerMove = (e: MouseEvent): void => {
  if (!footerPanelRef.value || isReducedMotion.value) return;
  const rect = footerPanelRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  footerPanelRef.value.style.setProperty('--light-x', `${x}px`);
  footerPanelRef.value.style.setProperty('--light-y', `${y}px`);
  footerPanelRef.value.style.setProperty('--light-opacity', '1');
};

const handlePointerLeave = (): void => {
  if (!footerPanelRef.value) return;
  footerPanelRef.value.style.setProperty('--light-opacity', '0');
};

const socialLinks = [
  {
    name: 'GitHub',
    handle: '@sereyvichea2828',
    url: 'https://github.com/sereyvichea2828',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    handle: 'Try Sereyvichea',
    url: 'https://www.linkedin.com/in/try-sereyvichea-8a890a436/',
    icon: Linkedin,
  },
  {
    name: 'Email',
    handle: 'dyte.vichea.dev@gmail.com',
    url: 'mailto:dyte.vichea.dev@gmail.com',
    icon: Mail,
  },
] as const;
</script>

<template>
  <footer
    ref="targetRef"
    class="relative z-10 pt-16 sm:pt-20 pb-12 sm:pb-16 overflow-hidden transition-[transform,opacity] duration-1000 ease-out"
    :class="[
      isVisible || isReducedMotion ? 'opacity-100 transform-none' : 'opacity-0 translate-y-6',
    ]"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <!-- Main Pearl Glass Grand Card Panel (consistent with other sections) -->
      <div
        ref="footerPanelRef"
        class="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-md shadow-purple-950/5 p-6 sm:p-10 lg:p-12 overflow-hidden transition-all duration-300 group"
        @mousemove="handlePointerMove"
        @mouseleave="handlePointerLeave"
      >
        <!-- Subtle Specular Light Reflection Following Pointer -->
        <div
          class="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style="
            opacity: var(--light-opacity, 0);
            background: radial-gradient(
              600px circle at var(--light-x, 50%) var(--light-y, 50%),
              rgba(255, 255, 255, 0.75),
              transparent 70%
            );
          "
          aria-hidden="true"
        />

        <!-- Abstract Translucent Liquid Glass Curve in Corner -->
        <svg
          class="absolute -right-16 -bottom-16 w-80 h-80 pointer-events-none opacity-25 z-0"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M40,120 C70,60 140,80 160,130 C180,180 120,200 60,180 C0,160 10,180 40,120 Z"
            fill="url(#glass-accent-gradient)"
          />
          <defs>
            <linearGradient id="glass-accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#94A3B8" stop-opacity="0.25" />
              <stop offset="50%" stop-color="#CBD5E1" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#E2E8F0" stop-opacity="0.05" />
            </linearGradient>
          </defs>
        </svg>

        <!-- Four-Column Editorial Content Grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 relative z-10"
        >
          <!-- Column 1: Developer Identity (lg:col-span-4) -->
          <div class="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div class="space-y-4">
              <!-- Monogram & Name -->
              <div class="flex items-center gap-3">
                <DtMonogram size-class="w-12 h-12" icon-class="w-7 h-5" />
                <div>
                  <h3 class="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                    {{ HERO_CONTENT.name }}
                  </h3>
                  <p class="text-xs font-semibold text-slate-500">
                    {{ HERO_CONTENT.title }}
                  </p>
                </div>
              </div>

              <!-- Professional Narrative Bio -->
              <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Architecting reactive web systems, scalable backend services, and interactive 3D
                WebGL experiences with architectural rigor and pearl glass aesthetics.
              </p>
            </div>

          </div>

          <!-- Column 2: Navigation Links (lg:col-span-2) -->
          <div class="lg:col-span-2 space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800">Navigation</h4>
            <nav class="flex flex-col space-y-1.5">
              <a
                v-for="item in FOOTER_NAV_ITEMS"
                :key="item.href"
                :href="item.href"
                class="group inline-flex items-center gap-2 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-all rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 min-h-11 sm:min-h-0"
                @click.prevent="handleNavClick(item.href)"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full bg-slate-400 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all"
                />
                <span class="group-hover:translate-x-1 transition-transform">
                  {{ item.label }}
                </span>
              </a>
            </nav>
          </div>

          <!-- Column 3: Social Connections (lg:col-span-3) -->
          <div class="lg:col-span-3 space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800">Connect</h4>
            <div class="flex flex-col space-y-2.5">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center justify-between p-2.5 rounded-2xl bg-white/60 hover:bg-white border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 min-h-11"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-xs"
                  >
                    <component :is="social.icon" class="w-4 h-4" />
                  </div>
                  <div class="flex flex-col text-left">
                    <span
                      class="text-xs font-semibold text-slate-900 group-hover:text-slate-950 transition-colors"
                    >
                      {{ social.name }}
                    </span>
                    <span class="text-xs text-slate-500 truncate max-w-36">
                      {{ social.handle }}
                    </span>
                  </div>
                </div>
                <ArrowUpRight
                  class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>
            </div>
          </div>

          <!-- Column 4: Contact Collaboration CTA (lg:col-span-3) -->
          <div class="lg:col-span-3 flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Sparkles class="w-4 h-4 text-slate-500" />
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Collaboration
                </h4>
              </div>
              <h5 class="text-base font-bold text-slate-900 tracking-tight leading-snug">
                Let's build something great together.
              </h5>
              <p class="text-xs text-slate-600 leading-relaxed">
                Have a new project, an architecture review, or looking to scale your engineering systems? Let's connect.
              </p>
            </div>

            <!-- Get In Touch CTA Action Button -->
            <div class="pt-2">
              <a
                href="#contact"
                class="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide shadow-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-95 min-h-11 cursor-pointer"
                @click.prevent="handleNavClick('#contact')"
              >
                <span>Get in Touch</span>
                <Send class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <!-- Refined Horizontal Divider -->
        <div
          class="w-full h-px bg-slate-200/80 my-8 sm:my-10"
        />

        <!-- Bottom Bar: Dynamic Copyright & Circular Back-to-Top -->
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 relative z-10"
        >
          <!-- Copyright Info -->
          <div class="flex items-center gap-2 text-center sm:text-left">
            <Code2 class="w-4 h-4 text-slate-400 hidden sm:inline-block" />
            <p>
              © {{ currentYear }}
              <span class="font-semibold text-slate-800">{{ HERO_CONTENT.name }}</span
              >. All rights reserved.
            </p>
          </div>

          <!-- Circular Back to Top Button (min 44x44px for accessibility) -->
          <div>
            <button
              type="button"
              class="w-11 h-11 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              aria-label="Back to top"
              @click="scrollToTop"
            >
              <ArrowUp class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
