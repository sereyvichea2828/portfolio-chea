<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { NAVIGATION_ITEMS, HERO_CONTENT } from '@/data/portfolioData';
import type { NavItem } from '@/types/portfolio';
import DtMonogram from '@/components/DtMonogram.vue';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { useModalState } from '@/composables/useModalState';
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
const { registerModal } = useModalState();
const isMobileMenuOpen = ref<boolean>(false);
const headerRef = ref<HTMLElement | null>(null);
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

const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

watch(isMobileMenuOpen, (isOpen) => {
  registerModal('mobile-menu', isOpen);
});

watch(
  () => props.isHidden,
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
          { y: -20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
            delay: 0.05,
            clearProps: 'transform,opacity',
          },
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
  registerModal('mobile-menu', false);
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown);
  }
});
</script>

<template>
  <!-- Outer Fixed Header: Always spans 100% of the viewport width -->
  <header
    ref="headerRef"
    class="fixed top-0 left-0 right-0 z-40 w-full transition-transform duration-300 ease-out pointer-events-none"
    :class="[
      props.isHidden
        ? '-translate-y-full opacity-0'
        : 'translate-y-0 opacity-100',
    ]"
    :aria-hidden="props.isHidden"
  >
    <!--
      Navbar Shell Container:
      - When NOT scrolled: Transparent background, floating with top padding.
      - When scrolled: Full-width solid/blur background, bottom border, sleek shadow-2xs.
    -->
    <div
      class="pointer-events-auto w-full transition-all duration-300 ease-out flex justify-center"
      :class="[
        props.isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs py-2 sm:py-2.5'
          : 'bg-transparent border-b border-transparent shadow-none pt-3 sm:pt-3.5',
      ]"
    >
      <!--
        Navbar Inner Container:
        - When NOT scrolled: Constrained to max-w-6xl mx-auto matching section width.
        - When scrolled: Expands to 100% full width (max-w-full) with px-4 sm:px-6 lg:px-8, STRICTLY EQUAL TO AppFooter.vue!
      -->
      <div
        class="w-full transition-all duration-300 ease-out px-4 sm:px-6 lg:px-8 mx-auto"
        :class="[
          props.isScrolled
            ? 'max-w-full'
            : 'max-w-6xl',
        ]"
      >
        <!--
          Navbar Card Frame:
          - When NOT scrolled: Elevated floating card (bg-white, border-slate-200/90, rounded-xl, shadow-xs, inner padding).
          - When scrolled: Completely frameless (transparent, border-transparent, rounded-none, shadow-none, zero padding).
        -->
        <div
          class="w-full transition-all duration-300 ease-out"
          :class="[
            props.isScrolled
              ? 'bg-transparent border border-transparent rounded-none shadow-none p-0'
              : 'bg-white border border-slate-200/90 rounded-xl shadow-xs px-3.5 sm:px-4 lg:px-5 py-1.5 sm:py-2',
          ]"
        >
          <div class="w-full flex items-center justify-between">
            <!-- Brand Monogram & Name Baseline (Far Left) -->
            <a
              href="#home"
              class="flex items-center gap-2 sm:gap-2.5 group rounded-lg p-0.5 transition-opacity hover:opacity-90 select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              aria-label="ត្រឡប់ទៅទំព័រដើម"
              @click.prevent="handleNavClick({ label: 'ទំព័រដើម', href: '#home' })"
            >
              <!-- Geometric DT Monogram Tile -->
              <DtMonogram
                size-class="w-8 h-8 sm:w-8.5 sm:h-8.5"
                icon-class="w-4 h-3.5 sm:w-4.5 sm:h-4"
              />

              <!-- Identity Text -->
              <div class="flex flex-col text-left">
                <span class="text-xs sm:text-sm font-bold tracking-tight text-slate-900 leading-snug">
                  {{ HERO_CONTENT.khmerName }}
                </span>
                <span class="text-[11px] font-medium text-slate-500 hidden sm:inline leading-none">
                  {{ HERO_CONTENT.title }}
                </span>
              </div>
            </a>

            <!-- Desktop Navigation Links (Centered, Slim py) -->
            <nav class="hidden md:flex items-center gap-0.5 lg:gap-1" aria-label="ការរុករកចម្បង">
              <a
                v-for="item in NAVIGATION_ITEMS"
                :key="item.href"
                :href="item.href"
                class="px-2.5 lg:px-3 py-1.5 text-xs lg:text-[13px] font-medium rounded-lg transition-colors select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                :class="[
                  props.activeSection === item.href.replace('#', '')
                    ? 'text-slate-950 bg-slate-100 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50',
                ]"
                @click.prevent="handleNavClick(item)"
              >
                {{ item.label }}
              </a>
            </nav>

            <!-- Right Action: Work Discussion Button (Far Right, Compact py) -->
            <div class="hidden sm:flex items-center">
              <a
                href="#contact"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs select-none cursor-pointer min-h-9 outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                @click.prevent="handleNavClick({ label: 'ទំនាក់ទំនង', href: '#contact' })"
              >
                <span>ពិភាក្សាការងារ</span>
                <ArrowUpRight class="w-3.5 h-3.5" />
              </a>
            </div>

            <!-- Mobile Menu Hamburger Button (Min 44x44px for accessibility) -->
            <div class="flex md:hidden">
              <button
                type="button"
                class="w-10 h-10 rounded-lg bg-white border border-slate-200/90 text-slate-900 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 shadow-2xs cursor-pointer transition-colors hover:bg-slate-50"
                :aria-expanded="isMobileMenuOpen"
                aria-label="បើកបិទម៉ឺនុយរុករក"
                @click="toggleMobileMenu"
              >
                <Menu v-if="!isMobileMenuOpen" class="w-5 h-5 text-slate-700" />
                <X v-else class="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Overlay Menu -->
    <Transition name="mobile-drawer">
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden w-full pointer-events-auto"
        :class="[
          props.isScrolled ? 'bg-white border-b border-slate-200/90 shadow-lg' : 'px-3 sm:px-4 pt-1',
        ]"
      >
        <div
          class="w-full"
          :class="[
            props.isScrolled
              ? 'w-full px-4 sm:px-6 py-3'
              : 'max-w-6xl mx-auto bg-white border border-slate-200/90 rounded-xl shadow-lg p-4 sm:p-5',
          ]"
        >
          <nav class="flex flex-col space-y-1">
            <a
              v-for="item in NAVIGATION_ITEMS"
              :key="item.href"
              :href="item.href"
              class="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors min-h-11"
              :class="[
                props.activeSection === item.href.replace('#', '')
                  ? 'bg-slate-100 text-slate-950 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950',
              ]"
              @click.prevent="handleNavClick(item)"
            >
              <span>{{ item.label }}</span>
              <span
                v-if="props.activeSection === item.href.replace('#', '')"
                class="w-1.5 h-3 bg-slate-900 rounded-xs shrink-0"
                aria-hidden="true"
              />
            </a>

            <div class="pt-3 mt-2 border-t border-slate-200/80">
              <a
                href="#contact"
                class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs min-h-11 cursor-pointer transition-colors"
                @click.prevent="handleNavClick({ label: 'ទំនាក់ទំនង', href: '#contact' })"
              >
                <span>ពិភាក្សាការងារ</span>
                <ArrowUpRight class="w-4 h-4" />
              </a>
            </div>
          </nav>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.mobile-drawer-enter-active,
.mobile-drawer-leave-active {
  transition:
    opacity 0.22s ease-out,
    transform 0.22s ease-out;
}

.mobile-drawer-enter-from,
.mobile-drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
