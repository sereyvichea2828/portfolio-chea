<script setup lang="ts">
import { ref } from 'vue';
import { SERVICES } from '@/data/portfolioData';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { Layout, Server, Layers, Database, Check } from 'lucide-vue-next';

const sectionRef = ref<HTMLElement | null>(null);
const { isReducedMotion } = useReducedMotion();

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  if (isReducedMotion.value) {
    const all = container.querySelectorAll('.services-header, .service-item');
    all.forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
    return;
  }

  const header = container.querySelector('.services-header');
  const items = container.querySelectorAll('.service-item');

  if (header) {
    tl.fromTo(
      header,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
    );
  }
  if (items.length > 0) {
    tl.fromTo(
      items,
      { y: 14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
      '-=0.4',
    );
  }
});

const getServiceIcon = (name: string) => {
  switch (name) {
    case 'Layout':
      return Layout;
    case 'Server':
      return Server;
    case 'Layers':
      return Layers;
    default:
      return Database;
  }
};
</script>

<template>
  <section id="services" ref="sectionRef" class="py-14 sm:py-20 relative z-10 scroll-mt-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 1. Section Header -->
      <div class="services-header max-w-3xl mb-12 sm:mb-16 space-y-2.5">
        <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
          សេវាកម្ម & ជំនាញបច្ចេកវិទ្យា
        </p>
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-extrabold text-slate-900 leading-[1.3] font-heading tracking-normal"
        >
          សេវាកម្មដែលខ្ញុំផ្តល់ជូន
        </h2>
        <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          សមត្ថភាពអភិវឌ្ឍន៍ពេញលេញពីដើមដល់ចប់ ចាប់ពីចំណុចប្រទាក់អ្នកប្រើប្រាស់រលូន
          រហូតដល់ប្រព័ន្ធដំណើរការខាងក្រោយ និងទិន្នន័យរឹងមាំ។
        </p>
      </div>

      <!-- 2. Services 2x2 Editorial Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        <div
          v-for="(service, index) in SERVICES"
          :key="service.id"
          class="service-item group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xs p-6 sm:p-8 hover:border-slate-300 hover:bg-white/95 transition-all duration-300 shadow-2xs hover:shadow-xs"
        >
          <!-- Top Metadata Bar (Icon + Number + Category) -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <component
                :is="getServiceIcon(service.iconName)"
                class="w-5 h-5 text-slate-700 group-hover:text-slate-900 transition-colors shrink-0"
                aria-hidden="true"
              />
            </div>
            <span class="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {{ service.id }}
            </span>
          </div>

          <!-- Title & Description -->
          <div class="space-y-2 py-4">
            <h3
              class="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-slate-950 transition-colors font-heading leading-snug"
            >
              {{ service.title }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {{ service.description }}
            </p>
          </div>

          <!-- Included Capabilities List -->
          <div class="pt-4 mt-auto border-t border-slate-100 space-y-2.5">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
              សមត្ថភាពស្នូល
            </p>
            <ul class="space-y-2" role="list">
              <li
                v-for="(item, idx) in service.items"
                :key="idx"
                class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
              >
                <Check
                  class="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0 group-hover:text-slate-700 transition-colors"
                  aria-hidden="true"
                />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
