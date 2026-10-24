<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { NAVIGATION_ITEMS } from '@/data/portfolioData';
import type { NavItem } from '@/types/portfolio';
import DtMonogram from '@/components/DtMonogram.vue';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { Menu, X, ArrowUpRight } from 'lucide-vue-next';

interface Props {
  isScrolled: boolean;
  activeSection: string;
  isFooterVisible?: boolean;
  isHidden?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isFooterVisible: false,
  isHidden: false,
});

const emit = defineEmits<{
  (e: 'navigate', sectionId: string): void;
}>();

const { isReducedMotion } = useReducedMotion();
const isMobileMenuOpen = ref<boolean>(false);
const headerRef = ref<HTMLElement | null>(null);
const navBarRef = ref<HTMLDivElement | null>(null);
let gsapCtx: gsap.Context | null = null;

const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false;
};

const handleNavClick = (item: NavItem): void => {
  emit('navigate', item.href);
  closeMobileMenu();
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

const handlePointerMove = (e: MouseEvent): void => {
  if (!navBarRef.value || isReducedMotion.value) return;
  const rect = navBarRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  navBarRef.value.style.setProperty('--light-x', `${x}px`);
  navBarRef.value.style.setProperty('--light-y', `${y}px`);
  navBarRef.value.style.setProperty('--light-opacity', '1');
};

const handlePointerLeave = (): void => {
  if (!navBarRef.value) return;
  navBarRef.value.style.setProperty('--light-opacity', '0');
};

const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

watch(isMobileMenuOpen, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }
});

watch(
  () => props.isFooterVisible || props.isHidden,
  (hidden) => {
    if (hidden && isMobileMenuOpen.value) {
      closeMobileMenu();
    }
  },
);

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);

    if (!isReducedMotion.value && headerRef.value) {
      gsapCtx = gsap.context(() => {
        gsap.fromTo(
          headerRef.value,
          { y: -24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.1 },
        );
      }, headerRef.value);
    }
  }
});

onUnmounted(() => {
  if (gsapCtx) {
    gsapCtx.revert();
    gsapCtx = null;
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown);
    document.body.classList.remove('overflow-hidden');
  }
});
</script>

<template>
  <header
    ref="headerRef"
    class="fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
    :class="[
      props.isFooterVisible || props.isHidden
        ? '-translate-y-full opacity-0 pointer-events-none'
        : 'transform-none opacity-100',
      props.isScrolled ? 'pt-0' : 'pt-3.5 sm:pt-4',
    ]"
    :aria-hidden="props.isFooterVisible || props.isHidden"
  >
    <div
      class="w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="[
        props.isScrolled
          ? 'max-w-full px-6 sm:px-8 lg:px-12 mx-0'
          : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
      ]"
    >
      <div
        ref="navBarRef"
        class="relative w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border overflow-hidden"
        :class="[
          props.isFooterVisible || props.isHidden ? 'pointer-events-none' : 'pointer-events-auto',
          props.isScrolled
            ? 'rounded-none border-x-0 border-t-0 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl shadow-xs px-0 py-2.5 sm:py-3'
            : 'rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-xs px-4 sm:px-5 py-2 sm:py-2.5',
        ]"
        @mousemove="handlePointerMove"
        @mouseleave="handlePointerLeave"
      >
        <!-- Subtle Non-AI Ambient Specular Light Following Pointer -->
        <div
          class="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style="
            background: radial-gradient(
              320px circle at var(--light-x, 50%) var(--light-y, 50%),
              rgba(15, 23, 42, 0.04),
              transparent 70%
            );
            opacity: var(--light-opacity, 0);
          "
          aria-hidden="true"
        />

        <div class="relative z-10 flex items-center justify-between">
          <!-- Brand Monogram & Name -->
          <a
            href="#home"
            class="flex items-center gap-3 group border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none rounded-xl p-1 transition-all duration-200 select-none"
            @click.prevent="handleNavClick({ label: 'Home', href: '#home' })"
          >
            <!-- Geometric DT Monogram Tile -->
            <DtMonogram size-class="w-9 h-9" icon-class="w-5 h-4" />

            <!-- Identity Text -->
            <div class="flex flex-col text-left transition-transform duration-200 group-hover:translate-x-0.5">
              <span
                class="text-xs sm:text-sm font-bold tracking-tight text-slate-900 group-hover:text-slate-950 transition-colors"
              >
                Try Sereyvichea
              </span>
              <span class="text-xs font-medium text-slate-500 hidden sm:inline">
                Full-Stack Engineer
              </span>
            </div>
          </a>

          <!-- Desktop & Tablet Navigation Links -->
          <nav class="hidden md:flex items-center gap-1">
            <a
              v-for="item in NAVIGATION_ITEMS"
              :key="item.href"
              :href="item.href"
              class="px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 relative border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none flex items-center select-none"
              :class="[
                props.activeSection === item.href.replace('#', '')
                  ? 'text-slate-950 bg-slate-100 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50',
              ]"
              @click.prevent="handleNavClick(item)"
            >
              <span
                v-if="props.activeSection === item.href.replace('#', '')"
                class="w-1.5 h-1.5 rounded-full bg-slate-900 inline-block mr-1.5"
              />
              <span>{{ item.label }}</span>
            </a>
          </nav>

          <!-- Right Action Button -->
          <div class="hidden sm:flex items-center gap-3">
            <a
              href="#contact"
              class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition-all duration-200 shadow-xs hover:shadow-sm border border-slate-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none active:scale-95 select-none cursor-pointer"
              @click.prevent="handleNavClick({ label: 'Contact', href: '#contact' })"
            >
              <span>Let's Talk</span>
              <ArrowUpRight class="w-3.5 h-3.5" />
            </a>
          </div>

          <!-- Mobile Menu Toggle Button (Min 44x44px for accessibility) -->
          <div class="flex md:hidden">
            <button
              type="button"
              class="w-11 h-11 rounded-xl bg-white/90 border border-slate-200/80 text-slate-900 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 shadow-xs cursor-pointer"
              :aria-expanded="isMobileMenuOpen"
              aria-label="Toggle navigation menu"
              @click="toggleMobileMenu"
            >
              <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
              <X v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Drawer Overlay Menu -->
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden mt-2 w-full pointer-events-auto bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-xl p-6 transition-all duration-300"
      >
        <nav class="flex flex-col space-y-1">
          <a
            v-for="item in NAVIGATION_ITEMS"
            :key="item.href"
            :href="item.href"
            class="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors min-h-11"
            :class="[
              props.activeSection === item.href.replace('#', '')
                ? 'bg-slate-100 text-slate-950 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950',
            ]"
            @click.prevent="handleNavClick(item)"
          >
            <span>{{ item.label }}</span>
            <span
              v-if="props.activeSection === item.href.replace('#', '')"
              class="w-2 h-2 rounded-full bg-slate-900"
            />
          </a>

          <div class="pt-4 mt-2 border-t border-slate-100">
            <a
              href="#contact"
              class="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs min-h-11 cursor-pointer transition-all"
              @click.prevent="handleNavClick({ label: 'Contact', href: '#contact' })"
            >
              <span>Let's Talk</span>
              <ArrowUpRight class="w-4 h-4" />
            </a>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>
