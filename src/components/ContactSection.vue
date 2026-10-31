<script setup lang="ts">
import { ref, reactive } from 'vue';
import { CONTACT_INFO } from '@/data/portfolioData';
import type { ContactFormData, ContactFormErrors } from '@/types/portfolio';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { ArrowUpRight, Send } from 'lucide-vue-next';

defineEmits<{
  (e: 'navigate', sectionId: string): void;
}>();

const sectionRef = ref<HTMLElement | null>(null);
const { isReducedMotion } = useReducedMotion();

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  if (isReducedMotion.value) {
    const all = container.querySelectorAll('.contact-header, .contact-content');
    all.forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
    return;
  }

  const header = container.querySelector('.contact-header');
  const content = container.querySelector('.contact-content');

  if (header) {
    tl.fromTo(
      header,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', clearProps: 'transform,willChange' },
    );
  }
  if (content) {
    tl.fromTo(
      content,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', clearProps: 'transform,willChange' },
      '-=0.35',
    );
  }
});

const formState = reactive<ContactFormData>({
  name: '',
  email: '',
  projectType: CONTACT_INFO.projectTypes[0] || 'កម្មវិធីគេហទំព័រពេញលេញ',
  message: '',
});

const errors = reactive<ContactFormErrors>({});
const isDraftPrepared = ref<boolean>(false);

const validateForm = (): boolean => {
  errors.name = undefined;
  errors.email = undefined;
  errors.projectType = undefined;
  errors.message = undefined;

  let isValid = true;

  if (!formState.name.trim()) {
    errors.name = 'សូមបញ្ចូលឈ្មោះរបស់អ្នក។';
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formState.email.trim()) {
    errors.email = 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក។';
    isValid = false;
  } else if (!emailRegex.test(formState.email.trim())) {
    errors.email = 'សូមបញ្ចូលទម្រង់អ៊ីមែលឱ្យបានត្រឹមត្រូវ។';
    isValid = false;
  }

  if (!formState.message.trim() || formState.message.trim().length < 10) {
    errors.message = 'សូមបញ្ចូលសារយ៉ាងហោចណាស់ ១០ តួអក្សរ។';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = (): void => {
  if (!validateForm()) return;

  const targetEmail = CONTACT_INFO.email;
  const subject = encodeURIComponent(
    `[${formState.projectType}] សំណើគម្រោងពី ${formState.name.trim()}`,
  );
  const body = encodeURIComponent(
    `ឈ្មោះ: ${formState.name.trim()}\n` +
      `អ៊ីមែល: ${formState.email.trim()}\n` +
      `ប្រភេទគម្រោង: ${formState.projectType}\n\n` +
      `សារ:\n${formState.message.trim()}`,
  );

  const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

  // Direct honest dispatch to user's default email client
  if (typeof window !== 'undefined') {
    window.location.href = mailtoUrl;
    isDraftPrepared.value = true;
  }
};
</script>

<template>
  <section id="contact" ref="sectionRef" class="py-14 sm:py-20 relative z-10 scroll-mt-28">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 1. Section Header -->
      <div class="contact-header max-w-3xl mb-12 sm:mb-16 space-y-2.5">
        <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
          {{ CONTACT_INFO.eyebrow }}
        </p>
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-extrabold text-slate-900 leading-[1.3] font-heading tracking-normal"
        >
          {{ CONTACT_INFO.headline }}
        </h2>
        <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal text-pretty">
          {{ CONTACT_INFO.supportingText }}
        </p>
      </div>

      <!-- 2. Clean Editorial Two-Column Composition -->
      <div class="contact-content grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <!-- Left Column: Personal Contact Information (5 cols on Desktop) -->
        <div class="lg:col-span-5 flex flex-col justify-start space-y-6">
          <div>
            <h3
              class="text-xl sm:text-2xl font-bold text-slate-900 font-heading leading-tight tracking-normal"
            >
              តោះចាប់ផ្តើមការសន្ទនា
            </h3>
            <p
              class="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed font-normal text-pretty"
            >
              មិនថាអ្នកមានគម្រោងនាពេលខាងមុខ កំពុងស្វែងរកអ្នកអភិវឌ្ឍន៍កម្មវិធីពេញលេញដែលមានបទពិសោធន៍
              ឬចង់ពិភាក្សាអំពីស្ថាបត្យកម្មប្រព័ន្ធនោះទេ ប្រអប់សាររបស់ខ្ញុំស្វាគមន៍ជានិច្ច។
            </p>
          </div>

          <!-- Direct Working Email -->
          <div class="pt-2">
            <span
              class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
            >
              អាសយដ្ឋានអ៊ីមែលផ្ទាល់
            </span>
            <a
              :href="'mailto:' + CONTACT_INFO.email"
              class="text-base sm:text-lg font-bold text-slate-900 hover:text-slate-600 transition-colors break-all no-underline"
            >
              {{ CONTACT_INFO.email }}
            </a>
          </div>

          <!-- Location -->
          <div>
            <span
              class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
            >
              ទីតាំងបច្ចុប្បន្ន
            </span>
            <p class="text-sm sm:text-base font-semibold text-slate-800">
              {{ CONTACT_INFO.location }}
            </p>
          </div>

          <!-- Social Links as Authentic Navigation Items -->
          <div class="pt-6 border-t border-slate-200/80">
            <span class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              បណ្តាញសង្គម & ប្រភពកូដ
            </span>
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm">
              <a
                v-for="social in CONTACT_INFO.socials"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-slate-700 hover:text-slate-950 transition-colors inline-flex items-center gap-1 group py-1"
              >
                <span>{{ social.name }}</span>
                <ArrowUpRight
                  class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>

        <!-- Right Column: Clean, Unboxed Contact Form (7 cols on Desktop) -->
        <div class="lg:col-span-7">
          <form class="space-y-5" @submit.prevent="handleSubmit">
            <!-- Name & Email Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <!-- Name Field -->
              <div>
                <label for="contact-name" class="block text-xs font-semibold text-slate-900 mb-1.5">
                  ឈ្មោះរបស់អ្នក <span class="text-rose-500">*</span>
                </label>
                <input
                  id="contact-name"
                  v-model="formState.name"
                  type="text"
                  placeholder="ឧ. សុខ ចិន្តា"
                  class="w-full px-3.5 py-2.5 rounded-lg bg-white border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-slate-400 transition-colors min-h-11"
                  :class="[errors.name ? 'border-rose-400' : 'border-slate-200']"
                  :aria-invalid="Boolean(errors.name)"
                  :aria-describedby="errors.name ? 'contact-name-error' : undefined"
                />
                <Transition name="field-error">
                  <p
                    v-if="errors.name"
                    id="contact-name-error"
                    class="text-xs text-rose-500 mt-1"
                    role="alert"
                  >
                    {{ errors.name }}
                  </p>
                </Transition>
              </div>

              <!-- Email Field -->
              <div>
                <label
                  for="contact-email"
                  class="block text-xs font-semibold text-slate-900 mb-1.5"
                >
                  អាសយដ្ឋានអ៊ីមែល <span class="text-rose-500">*</span>
                </label>
                <input
                  id="contact-email"
                  v-model="formState.email"
                  type="email"
                  placeholder="sok.chenda@example.com"
                  class="w-full px-3.5 py-2.5 rounded-lg bg-white border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-slate-400 transition-colors min-h-11"
                  :class="[errors.email ? 'border-rose-400' : 'border-slate-200']"
                  :aria-invalid="Boolean(errors.email)"
                  :aria-describedby="errors.email ? 'contact-email-error' : undefined"
                />
                <Transition name="field-error">
                  <p
                    v-if="errors.email"
                    id="contact-email-error"
                    class="text-xs text-rose-500 mt-1"
                    role="alert"
                  >
                    {{ errors.email }}
                  </p>
                </Transition>
              </div>
            </div>

            <!-- Project Type Selection (Native Select Control) -->
            <div>
              <label
                for="contact-project-type"
                class="block text-xs font-semibold text-slate-900 mb-1.5"
              >
                ប្រភេទគម្រោង
              </label>
              <select
                id="contact-project-type"
                v-model="formState.projectType"
                class="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-400 transition-colors min-h-11 cursor-pointer"
              >
                <option v-for="type in CONTACT_INFO.projectTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <!-- Message Field -->
            <div>
              <label
                for="contact-message"
                class="block text-xs font-semibold text-slate-900 mb-1.5"
              >
                សាររបស់អ្នក <span class="text-rose-500">*</span>
              </label>
              <textarea
                id="contact-message"
                v-model="formState.message"
                rows="5"
                placeholder="ប្រាប់ខ្ញុំអំពីតម្រូវការផលិតផល ទំហំការងារ ឬកាលវិភាគដែលអ្នករំពឹងទុក..."
                class="w-full px-3.5 py-2.5 rounded-lg bg-white border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-slate-400 transition-colors resize-y min-h-30"
                :class="[errors.message ? 'border-rose-400' : 'border-slate-200']"
                :aria-invalid="Boolean(errors.message)"
                :aria-describedby="errors.message ? 'contact-message-error' : undefined"
              />
              <Transition name="field-error">
                <p
                  v-if="errors.message"
                  id="contact-message-error"
                  class="text-xs text-rose-500 mt-1"
                  role="alert"
                >
                  {{ errors.message }}
                </p>
              </Transition>
            </div>

            <!-- Action & Clear Context Notice -->
            <div class="pt-2 space-y-3">
              <button
                type="submit"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer min-h-11"
              >
                <Send class="w-4 h-4" />
                <span>ផ្ញើសារតាមរយៈអ៊ីមែល</span>
              </button>

              <!-- Honest delivery explanation -->
              <p class="text-xs text-slate-500 leading-relaxed font-normal">
                ការចុចផ្ញើសារនឹងរៀបចំសារក្នុងកម្មវិធីអ៊ីមែលរបស់អ្នកដើម្បីផ្ញើទៅកាន់
                <span class="font-medium text-slate-700">{{ CONTACT_INFO.email }}</span>
                ដោយផ្ទាល់។ ព័ត៌មានដែលអ្នកបានបញ្ចូលនឹងមិនត្រូវបានលុបឡើយ។
              </p>

              <!-- Confirmation feedback when mailto was triggered -->
              <Transition name="contact-feedback">
                <div
                  v-if="isDraftPrepared"
                  class="p-3 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 leading-relaxed"
                  role="status"
                >
                  កម្មវិធីអ៊ីមែលរបស់អ្នកត្រូវបានបើកជាមួយនឹងសារដែលបានរៀបចំរួចរាល់។
                  ប្រសិនបើកម្មវិធីមិនបើកដោយស្វ័យប្រវត្តិទេ លោកអ្នកអាចផ្ញើអ៊ីមែលដោយផ្ទាល់ទៅកាន់
                  <a
                    :href="'mailto:' + CONTACT_INFO.email"
                    class="font-semibold text-slate-900 hover:text-slate-700 transition-colors no-underline"
                    >{{ CONTACT_INFO.email }}</a
                  >។
                </div>
              </Transition>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.field-error-enter-active,
.field-error-leave-active {
  transition:
    opacity 0.18s ease-out,
    transform 0.18s ease-out;
}

.field-error-enter-from,
.field-error-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}

.contact-feedback-enter-active,
.contact-feedback-leave-active {
  transition:
    opacity 0.22s ease-out,
    transform 0.22s ease-out;
}

.contact-feedback-enter-from,
.contact-feedback-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .field-error-enter-active,
  .field-error-leave-active,
  .contact-feedback-enter-active,
  .contact-feedback-leave-active {
    transition: none !important;
  }
}
</style>
