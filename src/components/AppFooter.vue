<script setup lang="ts">
import { inject } from 'vue';
import { CONTACT_INFO, HERO_CONTENT } from '@/data/portfolioData';
import type { NavItem } from '@/types/portfolio';
import DtMonogram from '@/components/DtMonogram.vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { ArrowUpRight, Github, Linkedin, Mail, Send } from 'lucide-vue-next';
import type { SmoothScrollController } from '@/composables/useSmoothScroll';

const FOOTER_NAV_ITEMS: readonly NavItem[] = [
  { label: 'ទំព័រដើម', href: '#home' },
  { label: 'អំពីខ្ញុំ', href: '#about' },
  { label: 'សេវាកម្ម', href: '#services' },
  { label: 'ជំនាញ', href: '#skills' },
  { label: 'គម្រោង', href: '#projects' },
  { label: 'បទពិសោធន៍', href: '#experience' },
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
    name: 'អ៊ីមែល',
    handle: CONTACT_INFO.email,
    url: `mailto:${CONTACT_INFO.email}`,
    icon: Mail,
  },
] as const;
</script>

<template>
  <!-- Full-Width Footer Shell: Spans 100% of viewport width edge to edge with compact, sleek vertical padding -->
  <footer
    ref="targetRef"
    class="w-full relative z-10 bg-white/95 border-t border-slate-200/90 pt-5 sm:pt-6 pb-3 sm:pb-4 text-slate-900 transition-[transform,opacity] duration-700 ease-out"
    :class="[
      isVisible || isReducedMotion ? 'opacity-100 transform-none' : 'opacity-0 translate-y-6',
    ]"
  >
    <!-- Section Container: Decreased px to strictly equal the navbar's px-4 sm:px-6 lg:px-8 -->
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <!-- Four-Column Editorial Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 xl:gap-8">
        <!-- Column 1: Developer Identity (lg:col-span-4) -->
        <div class="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div class="space-y-3.5">
            <!-- Monogram & Name Baseline -->
            <div class="flex items-center gap-3">
              <DtMonogram size-class="w-10 h-10" icon-class="w-5 h-4" />
              <div>
                <h3
                  class="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-heading"
                >
                  {{ HERO_CONTENT.khmerName }}
                </h3>
                <p class="text-xs font-semibold text-slate-500">
                  {{ HERO_CONTENT.title }}
                </p>
              </div>
            </div>

            <!-- Professional Narrative Bio -->
            <p
              class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal text-pretty max-w-sm"
            >
              រៀបចំស្ថាបត្យកម្មប្រព័ន្ធគេហទំព័ររស់រវើក សេវាកម្មដំណើរការខាងក្រោយដែលអាចពង្រីកបាន
              និងបទពិសោធន៍រូបភាពអន្តរកម្ម ប្រកបដោយភាពរឹងមាំ និងសោភ័ណភាពស្រស់ស្អាតទំនើប។
            </p>
          </div>
        </div>

        <!-- Column 2: Navigation Links (lg:col-span-2) -->
        <div class="lg:col-span-2 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800">មាតិកាគេហទំព័រ</h4>
          <nav class="flex flex-col space-y-1.5" aria-label="ការរុករកនៅបាតទំព័រ">
            <a
              v-for="item in FOOTER_NAV_ITEMS"
              :key="item.href"
              :href="item.href"
              class="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors py-1 inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-sm"
              @click.prevent="handleNavClick(item.href)"
            >
              {{ item.label }}
            </a>
          </nav>
        </div>

        <!-- Column 3: Social Connections (lg:col-span-3) -->
        <div class="lg:col-span-3 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800">បណ្តាញសង្គម</h4>
          <div class="flex flex-col space-y-2">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 hover:border-slate-300 transition-colors text-xs sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 min-h-12"
            >
              <div class="flex items-center gap-3 min-w-0">
                <component
                  :is="social.icon"
                  class="w-4.5 h-4.5 text-slate-500 group-hover:text-slate-900 transition-colors shrink-0"
                />
                <div class="flex flex-col min-w-0">
                  <span class="font-semibold text-slate-900 truncate">{{ social.name }}</span>
                  <span class="text-[11px] text-slate-500 truncate">{{ social.handle }}</span>
                </div>
              </div>
              <ArrowUpRight
                class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0"
              />
            </a>
          </div>
        </div>

        <!-- Column 4: Contact Collaboration CTA (lg:col-span-3) -->
        <div class="lg:col-span-3 flex flex-col justify-between space-y-4">
          <div class="space-y-2.5">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800">
              កិច្ចសហការការងារ
            </h4>
            <h5 class="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
              តោះយើងរួមគ្នាកសាងអ្វីដែលអស្ចារ្យ!
            </h5>
            <p class="text-xs text-slate-600 leading-relaxed font-normal">
              តើអ្នកមានគម្រោងថ្មី ការត្រួតពិនិត្យស្ថាបត្យកម្មកូដ
              ឬចង់ពង្រីកប្រព័ន្ធវិស្វកម្មរបស់អ្នកដែរឬទេ?
            </p>
          </div>

          <!-- Get In Touch CTA Action Button -->
          <div class="pt-1">
            <a
              href="#contact"
              class="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 min-h-11 cursor-pointer"
              @click.prevent="handleNavClick('#contact')"
            >
              <span>ទាក់ទងមកខ្ញុំ</span>
              <Send class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <!-- Refined Architectural Horizontal Divider (Compact Vertical Spacing) -->
      <div class="w-full h-px bg-slate-200/80 my-3 sm:my-3.5" />

      <!-- Bottom Bar: Minimalist Executive Baseline (Compact Vertical Padding) -->
      <div
        class="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 font-normal tracking-normal py-0.5"
      >
        <!-- Copyright Info (Left) -->
        <p class="text-center sm:text-left text-slate-500 text-xs">
          © {{ currentYear }} {{ HERO_CONTENT.name }}. All rights reserved.
        </p>

        <!-- Terms, Privacy, Cookies Legal Links (Right) -->
        <div class="flex items-center gap-5 sm:gap-6 text-xs text-slate-500">
          <a
            href="#home"
            class="hover:text-slate-900 transition-colors cursor-pointer select-none"
            @click.prevent="scrollToTop"
          >
            Terms
          </a>
          <a
            href="#home"
            class="hover:text-slate-900 transition-colors cursor-pointer select-none"
            @click.prevent="scrollToTop"
          >
            Privacy
          </a>
          <a
            href="#home"
            class="hover:text-slate-900 transition-colors cursor-pointer select-none"
            @click.prevent="scrollToTop"
          >
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  footer {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  footer {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
