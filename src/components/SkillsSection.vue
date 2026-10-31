<script setup lang="ts">
import { ref } from 'vue';
import { SKILL_GROUPS } from '@/data/portfolioData';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';
import TechnologyLogo from '@/components/TechnologyLogo.vue';
import { ArrowRight } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'navigate', sectionId: string): void;
}>();

const handleNavigate = (targetId: string): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  emit('navigate', targetId);
};

interface PrimaryTool {
  name: string;
  role: string;
}

const sectionRef = ref<HTMLElement | null>(null);
const activeTab = ref<string>('all');
const { isReducedMotion } = useReducedMotion();

// Primary production stack data
const primaryStack: readonly PrimaryTool[] = [
  { name: 'Vue 3', role: 'ស្ថាបត្យកម្មចំណុចប្រទាក់' },
  { name: 'TypeScript', role: 'សុវត្ថិភាពប្រភេទកូដ' },
  { name: 'Tailwind CSS', role: 'រចនាបថទំនើប' },
  { name: 'Node.js', role: 'ប្រព័ន្ធដំណើរការខាងក្រោយ' },
  { name: 'Vite', role: 'ឧបករណ៍ចងក្រងល្បឿនលឿន' },
] as const;

const tabs = [
  { id: 'all', label: 'បច្ចេកវិទ្យាទាំងអស់' },
  { id: 'frontend', label: 'ផ្នែកខាងមុខ' },
  { id: 'backend', label: 'ផ្នែកខាងក្រោយ' },
  { id: 'database', label: 'មូលដ្ឋានទិន្នន័យ' },
  { id: 'tools', label: 'ឧបករណ៍វិស្វកម្ម' },
] as const;

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  if (isReducedMotion.value) {
    const all = container.querySelectorAll('.skills-header, .primary-stack-strip, .category-group');
    all.forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
    return;
  }

  const header = container.querySelector('.skills-header');
  const strip = container.querySelector('.primary-stack-strip');
  const groups = container.querySelectorAll('.category-group');

  if (header) {
    tl.fromTo(
      header,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'transform,opacity,willChange',
      },
    );
  }

  if (strip) {
    tl.fromTo(
      strip,
      { y: 12, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        clearProps: 'transform,opacity,willChange',
      },
      '-=0.35',
    );
  }

  if (groups.length > 0) {
    tl.fromTo(
      groups,
      { y: 12, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity,willChange',
      },
      '-=0.3',
    );
  }
});
</script>

<template>
  <section id="skills" ref="sectionRef" class="py-14 sm:py-20 relative z-10 scroll-mt-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 1. Section Header -->
      <div class="skills-header max-w-3xl mb-10 sm:mb-12 space-y-2.5">
        <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
          ប្រវត្តិបច្ចេកវិទ្យា & ឧបករណ៍ប្រើប្រាស់
        </p>
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-extrabold text-slate-900 leading-[1.3] font-heading tracking-normal"
        >
          កសាងឡើងដោយបច្ចេកវិទ្យាទំនើប
        </h2>
        <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal text-pretty">
          ឧបករណ៍ ភាសាសរសេរកូដ និងគ្រោងការងារកម្មវិធី
          ដែលខ្ញុំប្រើប្រាស់ក្នុងការបង្កើតប្រព័ន្ធឌីជីថលកម្រិតខ្ពស់។
        </p>
      </div>

      <!-- 2. Primary Production Stack Strip (Clean horizontal strip, no boxes, no cards) -->
      <div class="primary-stack-strip mb-12 sm:mb-14 py-6 sm:py-7 border-y border-slate-200/80">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-4">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">
            បច្ចេកវិទ្យាស្នូលសម្រាប់ការអភិវឌ្ឍ
          </span>
          <span class="text-xs font-mono text-slate-400"> Core Production Stack </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 pt-1">
          <div v-for="tool in primaryStack" :key="tool.name" class="group flex items-start gap-3">
            <div
              class="w-6 h-6 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200"
            >
              <TechnologyLogo :name="tool.name" size-class="w-6 h-6" />
            </div>
            <div class="flex flex-col min-w-0">
              <span
                class="text-sm font-bold text-slate-900 group-hover:text-slate-950 transition-colors font-heading truncate"
              >
                {{ tool.name }}
              </span>
              <span class="text-xs font-sans text-slate-500 leading-normal mt-0.5">
                {{ tool.role }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Category Filter Tabs (Pill Style — No Underlines) -->
      <div
        role="tablist"
        aria-label="Category Filters"
        class="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 mb-10 sm:mb-12 no-scrollbar"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          role="tab"
          :aria-selected="activeTab === tab.id"
          type="button"
          class="text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shrink-0 px-3.5 py-1.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 select-none"
          :class="[
            activeTab === tab.id
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80',
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 4. Clean Technical Category Lists -->
      <div class="space-y-12 sm:space-y-14">
        <div
          v-for="group in SKILL_GROUPS"
          :key="group.id"
          v-show="activeTab === 'all' || activeTab === group.id"
          class="category-group pb-10 sm:pb-12 border-b border-slate-200/80 last:border-b-0 space-y-6"
        >
          <!-- Category Header (Title, Subtitle, Count) -->
          <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="w-1 h-3.5 bg-slate-900 rounded-xs shrink-0" aria-hidden="true" />
                <h3 class="text-lg sm:text-xl font-bold text-slate-900 font-heading tracking-tight">
                  {{ group.title }}
                </h3>
              </div>
              <p class="text-xs sm:text-sm text-slate-500 font-normal pl-3">
                {{ group.subtitle }}
              </p>
            </div>

            <span class="text-xs font-sans text-slate-500 shrink-0 self-start sm:self-auto">
              <span class="font-mono font-bold">{{ group.skills.length }}</span> បច្ចេកវិទ្យា
            </span>
          </div>

          <!-- Technical Grid Entries (3 cols desktop, 2 cols tablet, 1 col mobile) -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 sm:gap-x-10 gap-y-6 sm:gap-y-7"
          >
            <div
              v-for="skill in group.skills"
              :key="skill.name"
              class="skill-item flex items-start gap-3.5 group"
            >
              <!-- Authentic Brand Logo (No box container) -->
              <div
                class="w-6 h-6 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200"
              >
                <TechnologyLogo :name="skill.name" size-class="w-6 h-6" />
              </div>

              <!-- Content Column -->
              <div class="flex-1 min-w-0">
                <!-- Name and Experience Level -->
                <div class="flex items-baseline justify-between gap-2">
                  <h4
                    class="text-sm sm:text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors font-heading truncate"
                  >
                    {{ skill.name }}
                  </h4>
                  <span
                    v-if="skill.experience"
                    class="text-[11px] font-sans font-medium text-slate-500 shrink-0 select-none whitespace-nowrap"
                  >
                    {{ skill.experience }}
                  </span>
                </div>

                <!-- Highlight / Description -->
                <p
                  class="text-xs sm:text-sm font-sans font-normal text-slate-600 leading-relaxed text-pretty mt-1"
                >
                  {{ skill.highlight }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Link to Projects Showcase -->
      <div
        class="pt-10 sm:pt-14 mt-12 sm:mt-16 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm"
      >
        <button
          type="button"
          class="font-semibold text-slate-900 hover:text-slate-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          @click="handleNavigate('#projects')"
        >
          <span>មើលគម្រោងជាក់ស្តែងដែលបានបង្កើតឡើងដោយបច្ចេកវិទ្យាទាំងនេះ</span>
          <ArrowRight class="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
