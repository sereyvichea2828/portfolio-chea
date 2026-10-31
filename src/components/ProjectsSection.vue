<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { PROJECTS } from '@/data/portfolioData';
import type { Project } from '@/types/portfolio';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';
import router from '@/router';
import ProjectPreview from '@/components/ProjectPreview.vue';
import { ArrowUpRight, ArrowRight, Github, ChevronDown, Check } from 'lucide-vue-next';

const ProjectModal = defineAsyncComponent(() => import('@/components/ProjectModal.vue'));

const emit = defineEmits<{
  (e: 'navigate', sectionId: string): void;
}>();

const sectionRef = ref<HTMLElement | null>(null);
const { isReducedMotion } = useReducedMotion();

const handleNavigate = (targetId: string): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  emit('navigate', targetId);
};

// Active Selected Project (defaults to the first or featured project)
const selectedProjectId = ref<string>(
  PROJECTS.find((p) => p.featured)?.id || PROJECTS[0]?.id || '',
);

const currentProject = computed<Project>(() => {
  return PROJECTS.find((p) => p.id === selectedProjectId.value) || PROJECTS[0];
});

const currentProjectIndex = computed<number>(() => {
  const idx = PROJECTS.findIndex((p) => p.id === currentProject.value.id);
  return idx >= 0 ? idx : 0;
});

const selectProject = (id: string): void => {
  selectedProjectId.value = id;
};

// Custom Dropdown State & Interactivity
const isDropdownOpen = ref<boolean>(false);
const dropdownRef = ref<HTMLElement | null>(null);
const focusedOptionIndex = ref<number>(-1);

const toggleDropdown = (): void => {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    focusedOptionIndex.value = currentProjectIndex.value;
  }
};

const closeDropdown = (): void => {
  isDropdownOpen.value = false;
  focusedOptionIndex.value = -1;
};

const handleSelect = (id: string): void => {
  selectProject(id);
  closeDropdown();
};

const onTriggerKeydown = (event: KeyboardEvent): void => {
  if (
    event.key === 'ArrowDown' ||
    event.key === 'ArrowUp' ||
    event.key === 'Enter' ||
    event.key === ' '
  ) {
    event.preventDefault();
    if (!isDropdownOpen.value) {
      isDropdownOpen.value = true;
      focusedOptionIndex.value = currentProjectIndex.value;
    } else {
      if (event.key === 'ArrowDown') {
        focusedOptionIndex.value = (focusedOptionIndex.value + 1) % PROJECTS.length;
      } else if (event.key === 'ArrowUp') {
        focusedOptionIndex.value =
          (focusedOptionIndex.value - 1 + PROJECTS.length) % PROJECTS.length;
      } else if (event.key === 'Enter' || event.key === ' ') {
        if (focusedOptionIndex.value >= 0 && PROJECTS[focusedOptionIndex.value]) {
          handleSelect(PROJECTS[focusedOptionIndex.value].id);
        }
      }
    }
  } else if (event.key === 'Escape' && isDropdownOpen.value) {
    event.preventDefault();
    closeDropdown();
  }
};

const onListboxKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    focusedOptionIndex.value = (focusedOptionIndex.value + 1) % PROJECTS.length;
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    focusedOptionIndex.value = (focusedOptionIndex.value - 1 + PROJECTS.length) % PROJECTS.length;
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (focusedOptionIndex.value >= 0 && PROJECTS[focusedOptionIndex.value]) {
      handleSelect(PROJECTS[focusedOptionIndex.value].id);
    }
  } else if (event.key === 'Escape') {
    event.preventDefault();
    closeDropdown();
  } else if (event.key === 'Tab') {
    closeDropdown();
  }
};

const handleClickOutside = (event: MouseEvent): void => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('click', handleClickOutside);
  }
});

// GSAP Scroll Animations
useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  if (isReducedMotion.value) {
    const all = container.querySelectorAll(
      '.projects-header, .projects-showcase, .projects-footer',
    );
    all.forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
    return;
  }

  const header = container.querySelector('.projects-header');
  const showcase = container.querySelector('.projects-showcase');
  const footer = container.querySelector('.projects-footer');

  if (header) {
    tl.fromTo(
      header,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', clearProps: 'transform,willChange' },
    );
  }

  if (showcase) {
    tl.fromTo(
      showcase,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', clearProps: 'transform,willChange' },
      '-=0.35',
    );
  }

  if (footer) {
    tl.fromTo(
      footer,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', clearProps: 'transform,willChange' },
      '-=0.25',
    );
  }
});

// Technical Case Study Modal Handling
const selectedCaseStudy = ref<Project | null>(null);
const isModalOpen = ref<boolean>(false);

// Automatically close case study modal if route changes
router.afterEach((to, from) => {
  if (to.path !== from.path && isModalOpen.value) {
    closeCaseStudy();
  }
});

const openCaseStudy = (project: Project): void => {
  selectedCaseStudy.value = project;
  isModalOpen.value = true;
};

const closeCaseStudy = (): void => {
  isModalOpen.value = false;
  selectedCaseStudy.value = null;
};
</script>

<template>
  <section
    id="projects"
    ref="sectionRef"
    class="py-12 sm:py-16 lg:py-20 relative z-10 scroll-mt-24"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 1. Section Header (Standardized Editorial Hierarchy) -->
      <div class="projects-header max-w-3xl mb-10 sm:mb-12 lg:mb-16 space-y-2.5">
        <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
          ស្នាដៃដែលខ្ញុំបានបង្កើតឡើង
        </p>
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-extrabold text-slate-900 leading-[1.3] font-heading tracking-normal"
        >
          គម្រោងដែលខ្ញុំបានបង្កើត
        </h2>
        <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal text-pretty">
          កម្មវិធីដែលបានដាក់ឱ្យប្រើប្រាស់ជាក់ស្តែង និងដំណោះស្រាយបច្ចេកវិទ្យាដែលដោះស្រាយបញ្ហាពិត។
        </p>
      </div>

      <!-- 2. Full-Width Project Showcase Container -->
      <div class="projects-showcase w-full flex flex-col">
        <!-- 3. Custom Project Dropdown Selector (Placed directly above the preview) -->
        <div ref="dropdownRef" class="relative w-full mb-6 z-20">
          <!-- Dropdown Trigger Button (Closed State) -->
          <button
            type="button"
            class="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between text-left transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 select-none min-h-13"
            :class="
              isDropdownOpen ? 'shadow-md border-slate-400 ring-1 ring-slate-900/5' : 'shadow-2xs'
            "
            aria-haspopup="listbox"
            :aria-expanded="isDropdownOpen"
            aria-label="ជ្រើសរើសគម្រោង"
            @click="toggleDropdown"
            @keydown="onTriggerKeydown"
          >
            <div class="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
              <!-- Sequential Number -->
              <span class="font-mono text-xs sm:text-sm font-bold text-slate-400 shrink-0">
                0{{ currentProjectIndex + 1 }}
              </span>

              <div class="h-5 w-px bg-slate-200 shrink-0" aria-hidden="true" />

              <div class="flex flex-col min-w-0">
                <span
                  class="text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-400 uppercase leading-none mb-1"
                >
                  ជ្រើសរើសគម្រោង
                </span>
                <div class="flex items-baseline gap-2 truncate">
                  <span class="text-sm sm:text-base font-bold text-slate-900 font-heading truncate">
                    {{ currentProject.title }}
                  </span>
                  <span class="hidden sm:inline text-xs text-slate-500 shrink-0">
                    • {{ currentProject.category }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2.5 shrink-0 text-slate-500">
              <span class="sm:hidden text-xs text-slate-500 font-medium">
                {{ currentProject.category }}
              </span>
              <ChevronDown
                class="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 text-slate-500"
                :class="{ 'rotate-180 text-slate-900': isDropdownOpen }"
                aria-hidden="true"
              />
            </div>
          </button>

          <!-- Dropdown Panel (Open State) -->
          <Transition name="dropdown-fade">
            <div
              v-if="isDropdownOpen"
              class="absolute left-0 right-0 top-full mt-2 z-30 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden divide-y divide-slate-100"
              role="listbox"
              tabindex="-1"
              aria-label="បញ្ជីគម្រោង"
              @keydown="onListboxKeydown"
            >
              <button
                v-for="(project, index) in PROJECTS"
                :key="project.id"
                type="button"
                role="option"
                :aria-selected="currentProject.id === project.id"
                class="w-full text-left px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between transition-colors duration-150 cursor-pointer select-none group min-h-12"
                :class="[
                  currentProject.id === project.id
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                  focusedOptionIndex === index && currentProject.id !== project.id
                    ? 'bg-slate-50'
                    : '',
                ]"
                @click="handleSelect(project.id)"
                @mouseenter="focusedOptionIndex = index"
              >
                <div class="flex items-center gap-3 sm:gap-4 min-w-0 pr-3">
                  <span
                    class="font-mono text-xs sm:text-sm font-bold shrink-0 transition-colors"
                    :class="
                      currentProject.id === project.id
                        ? 'text-slate-900'
                        : 'text-slate-400 group-hover:text-slate-600'
                    "
                  >
                    0{{ index + 1 }}
                  </span>

                  <div class="flex flex-col min-w-0">
                    <span
                      class="text-sm sm:text-base font-bold font-heading truncate leading-snug"
                      :class="
                        currentProject.id === project.id
                          ? 'text-slate-900'
                          : 'text-slate-800 group-hover:text-slate-900'
                      "
                    >
                      {{ project.title }}
                    </span>
                    <span class="text-xs text-slate-500 mt-0.5 truncate">
                      {{ project.category }}
                      <template v-if="project.tags?.length">
                        / {{ project.tags.join(', ') }}
                      </template>
                    </span>
                  </div>
                </div>

                <div class="shrink-0 pl-2">
                  <Check
                    v-if="currentProject.id === project.id"
                    class="w-4 h-4 text-slate-900"
                    aria-hidden="true"
                  />
                  <span
                    v-else
                    class="w-4 h-4 block opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  >
                    <ArrowRight class="w-3.5 h-3.5 text-slate-400" />
                  </span>
                </div>
              </button>
            </div>
          </Transition>
        </div>

        <!-- Animated Showcase Container with Smooth Keyed Transition -->
        <Transition name="project-crossfade" mode="out-in">
          <div :key="currentProject.id" class="w-full flex flex-col">
            <!-- 4. Large Full-Width Website Screenshot Preview Frame -->
            <div
              class="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 cursor-pointer select-none group shadow-md shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 isolate"
              role="button"
              tabindex="0"
              :aria-label="`បើកមើលករណីសិក្សាសម្រាប់ ${currentProject.title}`"
              @click="openCaseStudy(currentProject)"
              @keydown.enter="openCaseStudy(currentProject)"
            >
              <ProjectPreview :project="currentProject" />

              <!-- High-Definition Crisp Frame Border (Overlay ensures razor-sharp edge definition around photo on all screens) -->
              <div
                class="pointer-events-none absolute inset-0 rounded-2xl border border-slate-300 ring-1 ring-inset ring-slate-900/10 transition-colors duration-300 group-hover:border-slate-400"
                aria-hidden="true"
              />

              <!-- Subtle Click to Open Overlay Hint -->
              <div
                class="absolute bottom-3.5 right-3.5 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 shadow-xs z-10"
                aria-hidden="true"
              >
                <span>មើលករណីសិក្សា</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </div>
            </div>

            <!-- Editorial Project Narrative Below Preview -->
            <div class="pt-6 sm:pt-8 flex flex-col">
              <!-- 5. Metadata Line: Category / Tech Stack -->
              <div class="text-xs font-medium text-slate-500 mb-2 flex flex-wrap items-center">
                <span class="font-semibold text-slate-700">{{ currentProject.category }}</span>
                <span class="mx-2 text-slate-300" aria-hidden="true">/</span>
                <span class="text-slate-600">{{ currentProject.tags.join(', ') }}</span>
              </div>

              <!-- 6. Project Title -->
              <h3
                class="text-2xl sm:text-3xl font-bold text-slate-900 font-heading leading-tight tracking-normal"
              >
                <button
                  type="button"
                  class="text-left hover:text-slate-600 transition-colors cursor-pointer"
                  @click="openCaseStudy(currentProject)"
                >
                  {{ currentProject.title }}
                </button>
              </h3>

              <!-- 7. Project Description -->
              <p
                class="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed font-normal text-pretty max-w-3xl"
              >
                {{ currentProject.description }}
              </p>

              <!-- 8. Simple Text-Based Action Links (No bulky button pills, No underlines) -->
              <div class="flex flex-wrap items-center gap-6 pt-6 text-sm">
                <!-- Live Demo (only if demoUrl exists and is distinct from githubUrl) -->
                <a
                  v-if="
                    currentProject.demoUrl && currentProject.demoUrl !== currentProject.githubUrl
                  "
                  :href="currentProject.demoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-slate-900 hover:text-slate-600 transition-colors inline-flex items-center gap-1.5 py-1.5 no-underline"
                >
                  <span>សាកល្បងផ្ទាល់</span>
                  <ArrowUpRight class="w-4 h-4 text-slate-500" />
                </a>

                <!-- Case Study Trigger -->
                <button
                  type="button"
                  class="font-semibold text-slate-700 hover:text-slate-950 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1.5"
                  @click="openCaseStudy(currentProject)"
                >
                  <span>ករណីសិក្សា</span>
                  <ArrowRight class="w-3.5 h-3.5 text-slate-400" />
                </button>

                <!-- GitHub Repo (shown only when githubUrl is not empty) -->
                <a
                  v-if="currentProject.githubUrl"
                  :href="currentProject.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5 py-1.5 no-underline"
                >
                  <Github class="w-4 h-4 text-slate-400" />
                  <span>កូដប្រភព</span>
                </a>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 9. Quiet, Simple GitHub Link & Section Transition Footer -->
      <div
        class="projects-footer pt-12 sm:pt-16 mt-12 sm:mt-16 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm text-slate-500"
      >
        <div class="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            href="https://github.com/sereyvichea2828"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold text-slate-900 hover:text-slate-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <span>គម្រោងកូដចំហផ្សេងទៀតនៅលើ GitHub</span>
            <ArrowUpRight class="w-3.5 h-3.5 text-slate-400" />
          </a>
          <a
            href="https://github.com/sereyvichea2828"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <span>github.com/sereyvichea2828</span>
            <ArrowUpRight class="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 py-1.5"
          @click="handleNavigate('#experience')"
        >
          <span>បន្តទៅកាន់បទពិសោធន៍ការងារ</span>
          <ArrowRight class="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <!-- 10. Deep-Dive Case Study Modal (Lazy-loaded upon trigger) -->
      <ProjectModal
        v-if="isModalOpen && selectedCaseStudy"
        :project="selectedCaseStudy"
        :is-open="isModalOpen"
        @close="closeCaseStudy"
      />
    </div>
  </section>
</template>

<style scoped>
.project-crossfade-enter-active,
.project-crossfade-leave-active {
  transition:
    opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-crossfade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.project-crossfade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition:
    opacity 0.16s ease-out,
    transform 0.16s ease-out;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .project-crossfade-enter-active,
  .project-crossfade-leave-active,
  .dropdown-fade-enter-active,
  .dropdown-fade-leave-active {
    transition: none !important;
  }
}
</style>
