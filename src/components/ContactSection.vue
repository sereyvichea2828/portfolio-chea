<script setup lang="ts">
import { ref, reactive } from 'vue';
import { CONTACT_INFO } from '@/data/portfolioData';
import type { ContactFormData, ContactFormErrors } from '@/types/portfolio';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';
import ThreePearlOrb from '@/components/ThreePearlOrb.vue';
import {
  Mail,
  Send,
  Github,
  Linkedin,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Loader2,
} from 'lucide-vue-next';

const sectionRef = ref<HTMLElement | null>(null);
const { isReducedMotion } = useReducedMotion();

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  const header = container.querySelector('.contact-header');
  const infoCol = container.querySelector('.contact-info-col');
  const formCol = container.querySelector('.contact-form-col');

  if (header) {
    tl.fromTo(header, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' });
  }
  if (infoCol) {
    tl.fromTo(infoCol, { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.4');
  }
  if (formCol) {
    tl.fromTo(formCol, { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5');
  }
});

const formState = reactive<ContactFormData>({
  name: '',
  email: '',
  projectType: CONTACT_INFO.projectTypes[0] || 'Full-Stack Web App',
  message: '',
});

const errors = reactive<ContactFormErrors>({});
const isSubmitting = ref<boolean>(false);
const isSubmitted = ref<boolean>(false);

const validateForm = (): boolean => {
  errors.name = undefined;
  errors.email = undefined;
  errors.projectType = undefined;
  errors.message = undefined;

  let isValid = true;

  if (!formState.name.trim()) {
    errors.name = 'Please provide your name.';
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formState.email.trim()) {
    errors.email = 'Please provide your email address.';
    isValid = false;
  } else if (!emailRegex.test(formState.email)) {
    errors.email = 'Please provide a valid email format.';
    isValid = false;
  }

  if (!formState.message.trim() || formState.message.trim().length < 10) {
    errors.message = 'Please provide a message with at least 10 characters.';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  // Simulate realistic client-side asynchronous dispatch
  setTimeout(() => {
    isSubmitting.value = false;
    isSubmitted.value = true;
    formState.name = '';
    formState.email = '';
    formState.message = '';
  }, 1000);
};

const resetSubmission = (): void => {
  isSubmitted.value = false;
};
</script>

<template>
  <section
    id="contact"
    ref="sectionRef"
    class="py-24 relative z-10 scroll-mt-24"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="contact-header max-w-3xl mb-16">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-8 h-0.5 bg-linear-to-r from-purple-400 to-indigo-400 rounded-full" />
          <p class="text-xs font-bold uppercase tracking-widest text-purple-600">
            {{ CONTACT_INFO.eyebrow }}
          </p>
        </div>
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider text-ink-primary leading-tight"
        >
          {{ CONTACT_INFO.headline }}
        </h2>
        <p class="mt-4 text-base sm:text-lg text-ink-secondary">
          {{ CONTACT_INFO.supportingText }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        <!-- Left: Direct Contact Information & Profiles -->
        <div class="contact-info-col lg:col-span-5 space-y-6 relative">
          <!-- Translucent 3D Sphere in Background -->
          <div class="absolute -bottom-12 -left-12 opacity-40 pointer-events-none hidden sm:block">
            <ThreePearlOrb size-class="w-48 h-48" />
          </div>

          <div
            class="relative z-10 bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-md shadow-purple-950/5 space-y-6"
          >
            <div>
              <h3 class="text-xl font-bold text-ink-primary tracking-tight">
                Let's start a conversation
              </h3>
              <p class="text-sm text-ink-secondary mt-2 leading-relaxed">
                Whether you have an upcoming project, are looking for an experienced full-stack
                engineer, or want to discuss architecture, my inbox is open.
              </p>
            </div>

            <!-- Direct Details -->
            <div class="space-y-4 pt-2">
              <a
                :href="'mailto:' + CONTACT_INFO.email"
                class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/80 border border-slate-100 hover:border-purple-300 group transition-all shadow-xs"
              >
                <div
                  class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"
                >
                  <Mail class="w-5 h-5" />
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="text-xs text-ink-secondary uppercase font-semibold"
                    >DIRECT INBOX</span
                  >
                  <span
                    class="text-sm font-semibold text-ink-primary group-hover:text-purple-600 transition-colors truncate"
                  >
                    {{ CONTACT_INFO.email }}
                  </span>
                </div>
              </a>

              <div
                class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/80 border border-slate-100 shadow-xs"
              >
                <div
                  class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"
                >
                  <Clock class="w-5 h-5" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-ink-secondary uppercase font-semibold">STATUS</span>
                  <span class="text-sm font-semibold text-ink-primary">
                    {{ CONTACT_INFO.availability }}
                  </span>
                </div>
              </div>

              <div
                class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/80 border border-slate-100 shadow-xs"
              >
                <div
                  class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"
                >
                  <MapPin class="w-5 h-5" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-ink-secondary uppercase font-semibold"
                    >BASE LOCATION</span
                  >
                  <span class="text-sm font-semibold text-ink-primary">
                    {{ CONTACT_INFO.location }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div class="pt-4 border-t border-slate-100 flex items-center gap-3">
              <a
                v-for="social in CONTACT_INFO.socials"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60 text-xs font-semibold transition-colors min-h-11"
              >
                <span>{{ social.name }}</span>
                <ArrowUpRight class="w-3.5 h-3.5 text-purple-600" />
              </a>
            </div>
          </div>
        </div>

        <!-- Right: Pearl Glass Contact Form -->
        <div class="contact-form-col lg:col-span-7">
          <div
            class="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-md shadow-purple-950/5"
          >
            <!-- Success Screen -->
            <div
              v-if="isSubmitted"
              class="py-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div
                class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"
              >
                <CheckCircle2 class="w-8 h-8" />
              </div>
              <h3 class="text-2xl font-bold text-ink-primary tracking-tight">Message Dispatched</h3>
              <p class="text-sm text-ink-secondary max-w-md leading-relaxed">
                Thank you for reaching out. Your message has been logged, and I will review and
                respond within 24 hours.
              </p>
              <div class="pt-4">
                <button
                  type="button"
                  class="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors cursor-pointer min-h-11 shadow-sm"
                  @click="resetSubmission"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            </div>

            <!-- Form -->
            <form v-else class="space-y-5" @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <!-- Name -->
                <div>
                  <label
                    for="contact-name"
                    class="block text-xs font-bold text-ink-primary uppercase tracking-wider mb-2"
                  >
                    Your Name <span class="text-purple-600">*</span>
                  </label>
                  <input
                    id="contact-name"
                    v-model="formState.name"
                    type="text"
                    placeholder="Alex Morgan"
                    class="w-full px-4 py-3 rounded-2xl bg-white border text-ink-primary placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all min-h-11 shadow-xs"
                    :class="[errors.name ? 'border-rose-400' : 'border-slate-200']"
                  />
                  <p v-if="errors.name" class="text-xs text-rose-500 mt-1">
                    {{ errors.name }}
                  </p>
                </div>

                <!-- Email -->
                <div>
                  <label
                    for="contact-email"
                    class="block text-xs font-bold text-ink-primary uppercase tracking-wider mb-2"
                  >
                    Email Address <span class="text-purple-600">*</span>
                  </label>
                  <input
                    id="contact-email"
                    v-model="formState.email"
                    type="email"
                    placeholder="alex@example.com"
                    class="w-full px-4 py-3 rounded-2xl bg-white border text-ink-primary placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all min-h-11 shadow-xs"
                    :class="[errors.email ? 'border-rose-400' : 'border-slate-200']"
                  />
                  <p v-if="errors.email" class="text-xs text-rose-500 mt-1">
                    {{ errors.email }}
                  </p>
                </div>
              </div>

              <!-- Project Type Selection -->
              <div>
                <label
                  class="block text-xs font-bold text-ink-primary uppercase tracking-wider mb-2"
                >
                  Project Type
                </label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="type in CONTACT_INFO.projectTypes"
                    :key="type"
                    type="button"
                    class="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer min-h-11 sm:min-h-0 flex items-center"
                    :class="[
                      formState.projectType === type
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-ink-secondary border-slate-200 hover:border-purple-300',
                    ]"
                    @click="formState.projectType = type"
                  >
                    {{ type }}
                  </button>
                </div>
              </div>

              <!-- Message -->
              <div>
                <label
                  for="contact-message"
                  class="block text-xs font-bold text-ink-primary uppercase tracking-wider mb-2"
                >
                  Your Message <span class="text-purple-600">*</span>
                </label>
                <textarea
                  id="contact-message"
                  v-model="formState.message"
                  rows="4"
                  placeholder="Tell me about your product requirements, scope, or timeline..."
                  class="w-full px-4 py-3 rounded-2xl bg-white border text-ink-primary placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none shadow-xs"
                  :class="[errors.message ? 'border-rose-400' : 'border-slate-200']"
                />
                <p v-if="errors.message" class="text-xs text-rose-500 mt-1">
                  {{ errors.message }}
                </p>
              </div>

              <!-- Submit Button -->
              <div class="pt-2">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-linear-to-r from-purple-500 via-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-purple-500/25 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 active:scale-98 disabled:opacity-60 cursor-pointer min-h-11"
                >
                  <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                  <Send v-else class="w-4 h-4" />
                  <span>{{ isSubmitting ? 'Transmitting...' : 'Send Message' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
