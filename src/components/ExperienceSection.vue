<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { EXPERIENCES } from '@/data/portfolioData';
import type { ExperienceCertificate } from '@/types/portfolio';
import { useGsapScrollTrigger } from '@/composables/useGsapScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { useModalState } from '@/composables/useModalState';
import { useCertificateModal } from '@/composables/useCertificateModal';
import {
  Calendar,
  Check,
  FileText,
  ExternalLink,
  Eye,
  Download,
  Globe,
  X,
  Maximize2,
  Minimize2,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'navigate', sectionId: string): void;
}>();

const handleNavigate = (targetId: string): void => {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  emit('navigate', targetId);
};

const sectionRef = ref<HTMLElement | null>(null);
const { isReducedMotion } = useReducedMotion();
const { registerModal } = useModalState();

// Certificate Lightbox State (shared via useCertificateModal singleton)
const {
  isCertificateModalOpen: isModalOpen,
  selectedCertificate: selectedCert,
  openCertificate,
  closeCertificate,
} = useCertificateModal();
const isZoomed = ref<boolean>(false);
const modalRef = ref<HTMLDivElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);
let lastFocusedElement: HTMLElement | null = null;

// Track failed images to fallback to clean document placeholder
const failedImages = ref<Set<string>>(new Set());

const onImageError = (certId: string): void => {
  failedImages.value.add(certId);
};

const getCertificateImage = (cert?: ExperienceCertificate | null): string | null => {
  if (!cert) return null;
  const url = cert.imageUrl || cert.image;
  if (!url || typeof url !== 'string' || url.trim() === '' || failedImages.value.has(cert.id)) {
    return null;
  }
  return url;
};

const getCertificateVerifyUrl = (cert?: ExperienceCertificate | null): string | null => {
  if (!cert) return null;
  const url = cert.verifyUrl || cert.verificationUrl;
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return null;
  }
  return url;
};

const getCertificateLecturerUrl = (cert?: ExperienceCertificate | null): string | null => {
  if (!cert) return null;
  const url = cert.lecturerUrl || cert.lecturerWebsiteUrl;
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return null;
  }
  return url;
};

const getCertificatePdfUrl = (cert?: ExperienceCertificate | null): string | null => {
  if (!cert) return null;
  const url = cert.pdfUrl;
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return null;
  }
  return url;
};

const getPdfDownloadName = (cert?: ExperienceCertificate | null): string => {
  if (!cert) return 'certificate.pdf';
  if (cert.credentialId) {
    return `certificate-${cert.credentialId}.pdf`;
  }
  return `${cert.id || 'certificate'}.pdf`;
};

const toggleZoom = (): void => {
  isZoomed.value = !isZoomed.value;
};

const openCertificateModal = async (cert: ExperienceCertificate): Promise<void> => {
  lastFocusedElement =
    typeof document !== 'undefined' ? (document.activeElement as HTMLElement) : null;
  isZoomed.value = false;
  openCertificate(cert);
  await nextTick();
  closeButtonRef.value?.focus();
};

const closeCertificateModal = (): void => {
  closeCertificate();
  isZoomed.value = false;
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
};

const handleKeyDown = (e: KeyboardEvent): void => {
  if (!isModalOpen.value) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    closeCertificateModal();
    return;
  }

  // Keyboard accessibility: trap focus inside modal
  if (e.key === 'Tab' && modalRef.value) {
    const focusableEls = modalRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (focusableEls.length === 0) return;

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }
};

watch(isModalOpen, async (isOpen) => {
  registerModal('certificate-lightbox', isOpen);
  if (isOpen) {
    if (!lastFocusedElement && typeof document !== 'undefined') {
      lastFocusedElement = document.activeElement as HTMLElement;
    }
    await nextTick();
    closeButtonRef.value?.focus();
  }
});

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  closeCertificate();
  registerModal('certificate-lightbox', false);
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown);
  }
});

useGsapScrollTrigger(sectionRef, ({ tl, container }) => {
  if (isReducedMotion.value) {
    const all = container.querySelectorAll('.experience-header, .experience-entry');
    all.forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
    return;
  }

  const header = container.querySelector('.experience-header');
  const entries = container.querySelectorAll('.experience-entry');

  if (header) {
    tl.fromTo(
      header,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', clearProps: 'transform,willChange' },
    );
  }

  if (entries.length > 0) {
    tl.fromTo(
      entries,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,willChange',
      },
      '-=0.35',
    );
  }
});
</script>

<template>
  <section
    id="experience"
    ref="sectionRef"
    class="py-14 sm:py-20 relative z-10 scroll-mt-24 bg-transparent"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 1. Section Header -->
      <div class="experience-header max-w-3xl mb-10 sm:mb-14 space-y-2.5">
        <div class="flex items-center gap-2">
          <p class="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
            ដំណើរវិវត្តន៍ & បទពិសោធន៍វិស្វកម្ម
          </p>
        </div>
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-extrabold text-slate-900 leading-[1.3] font-heading tracking-normal"
        >
          ដំណើរចាប់ផ្តើមពីសូន្យ រហូតដល់កម្មវិធីពេញលេញ
        </h2>
        <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal text-pretty">
          ដំណើររៀនសូត្រ ការកសាងស្ថាបត្យកម្មកូដជាក់ស្តែង
          និងការទទួលស្គាល់តាមរយៈវិញ្ញាបនបត្របញ្ជាក់ការបញ្ចប់វគ្គសិក្សាផ្សេងៗ។
        </p>
      </div>

      <!-- 2. Vertical Chronological Timeline (From Scratch to Now) -->
      <div class="relative space-y-8 sm:space-y-12">
        <!-- Mathematically Centered Timeline Vertical Spine -->
        <div
          class="absolute left-3.5 sm:left-5 top-7 bottom-6 w-0.5 -translate-x-1/2 bg-slate-200 pointer-events-none"
          aria-hidden="true"
        />

        <article
          v-for="exp in EXPERIENCES"
          :key="exp.id"
          class="experience-entry relative pl-9 sm:pl-14 group"
        >
          <!-- Timeline Node Glyph -->
          <div
            class="absolute left-3.5 sm:left-5 -translate-x-1/2 top-7 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <!-- Current Stage (Solid Dark Pill / Dot) -->
            <div
              v-if="exp.isCurrent"
              class="w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white ring-2 ring-slate-900/10 shadow-2xs"
            />
            <!-- Past Stages (Clean Solid Dot) -->
            <div
              v-else
              class="w-3 h-3 rounded-full bg-slate-400 border-2 border-white shadow-2xs group-hover:bg-slate-900 transition-colors"
            />
          </div>

          <!-- Card Content Wrapper (Strict main.css Surface) -->
          <div
            class="bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-xs hover:border-slate-300 transition-all duration-200 space-y-4"
          >
            <!-- Era Meta Header -->
            <div
              class="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 pb-3.5"
            >
              <div class="flex flex-wrap items-center gap-2">
                <!-- Current / Era Badge (Only if current or badge specified) -->
                <span
                  v-if="exp.isCurrent"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200"
                >
                  បច្ចុប្បន្ន
                </span>
                <span
                  v-else-if="exp.eraBadge"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {{ exp.eraBadge }}
                </span>

                <!-- Period -->
                <span
                  class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 font-sans"
                >
                  <Calendar class="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                  <span>{{ exp.period }}</span>
                </span>
              </div>
            </div>

            <!-- Role & Organization -->
            <div class="space-y-1">
              <h3
                class="text-lg sm:text-xl font-bold text-slate-900 font-heading leading-snug tracking-normal"
              >
                {{ exp.role }}
              </h3>
              <div
                v-if="exp.company || exp.subtitle"
                class="flex flex-wrap items-center gap-2 pt-0.5"
              >
                <p v-if="exp.company" class="text-xs sm:text-sm font-medium text-slate-600">
                  {{ exp.company }}
                </p>
                <span
                  v-if="exp.company && exp.subtitle"
                  class="text-slate-300 hidden sm:inline"
                  aria-hidden="true"
                >
                  •
                </span>
                <p v-if="exp.subtitle" class="text-xs sm:text-sm font-semibold text-indigo-600">
                  {{ exp.subtitle }}
                </p>
              </div>
            </div>

            <!-- Narrative Description -->
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-normal text-pretty">
              {{ exp.description }}
            </p>

            <!-- Production Achievements -->
            <div v-if="exp.achievements && exp.achievements.length > 0" class="space-y-2 pt-1">
              <div
                v-for="(achieve, idx) in exp.achievements"
                :key="idx"
                class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
              >
                <Check class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                <span class="text-pretty">{{ achieve }}</span>
              </div>
            </div>

            <!-- Dedicated Certificate Presentation Area (Rendered ONLY if exp.certificate exists) -->
            <div v-if="exp.certificate" class="mt-4 pt-4 border-t border-slate-200/80 space-y-2.5">
              <div
                class="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase"
              >
                <span class="inline-flex items-center gap-1.5">
                  <FileText class="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>វិញ្ញាបនបត្របញ្ជាក់សមត្ថភាព</span>
                </span>
                <span
                  v-if="exp.certificate.issueDate"
                  class="text-slate-400 font-mono text-[11px] font-normal"
                >
                  {{ exp.certificate.issueDate }}
                </span>
              </div>

              <!-- Document Preview Card (Clickable to open Lightbox) -->
              <div
                class="rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm transition-all duration-200 overflow-hidden cursor-pointer group/cert"
                role="button"
                tabindex="0"
                :aria-label="`ពិនិត្យមើលវិញ្ញាបនបត្រដើម ${exp.certificate.title}`"
                @click="openCertificateModal(exp.certificate)"
                @keydown.enter="openCertificateModal(exp.certificate)"
                @keydown.space.prevent="openCertificateModal(exp.certificate)"
              >
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 p-3.5 sm:p-4 items-center">
                  <!-- Thumbnail / Document Preview Container -->
                  <div
                    class="sm:col-span-5 md:col-span-4 aspect-4/3 sm:aspect-16/11 w-full rounded-lg border border-slate-200/90 bg-slate-50 flex items-center justify-center overflow-hidden relative shadow-2xs group-hover/cert:border-slate-300"
                  >
                    <!-- Actual Certificate Image (Preserving original proportions) -->
                    <img
                      v-if="getCertificateImage(exp.certificate)"
                      :src="getCertificateImage(exp.certificate)!"
                      :alt="`វិញ្ញាបនបត្រ ${exp.certificate.title}`"
                      class="w-full h-full object-contain p-1 transition-transform duration-300 group-hover/cert:scale-[1.03]"
                      loading="lazy"
                      @error="onImageError(exp.certificate.id)"
                    />
                    <!-- Restrained, Honest Document Placeholder if no image file uploaded yet -->
                    <div
                      v-else
                      class="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-slate-50 space-y-2 select-none"
                    >
                      <div
                        class="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs"
                      >
                        <FileText class="w-4.5 h-4.5" aria-hidden="true" />
                      </div>
                      <div class="space-y-0.5">
                        <span class="text-[11px] font-semibold text-slate-700 block"
                          >ឯកសារវិញ្ញាបនបត្រ</span
                        >
                        <span class="text-[10px] text-slate-400 block"
                          >ចុចដើម្បីមើលព័ត៌មានលម្អិត</span
                        >
                      </div>
                    </div>

                    <!-- Subtle Hover Action Pill -->
                    <div
                      class="absolute inset-0 bg-slate-900/5 opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
                      aria-hidden="true"
                    >
                      <span
                        class="px-2.5 py-1 rounded-md bg-white/95 text-slate-900 text-xs font-semibold shadow-xs inline-flex items-center gap-1"
                      >
                        <Eye class="w-3.5 h-3.5" />
                        <span>មើលពេញទំហំ</span>
                      </span>
                    </div>
                  </div>

                  <!-- Certificate Metadata & Actions -->
                  <div class="sm:col-span-7 md:col-span-8 flex flex-col justify-between space-y-3">
                    <div class="space-y-1.5">
                      <!-- Optional Category & Date -->
                      <div class="flex flex-wrap items-center gap-2">
                        <span
                          v-if="exp.certificate.category"
                          class="inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wide"
                        >
                          {{ exp.certificate.category }}
                        </span>
                        <span
                          v-if="exp.certificate.issueDate"
                          class="text-xs text-slate-500 font-sans"
                        >
                          ចេញឆ្នាំ៖ {{ exp.certificate.issueDate }}
                        </span>
                      </div>

                      <!-- Certificate Title -->
                      <h4
                        class="text-sm sm:text-base font-bold text-slate-900 font-heading leading-snug group-hover/cert:text-indigo-600 transition-colors"
                      >
                        {{ exp.certificate.title }}
                      </h4>

                      <!-- Issuing Organization -->
                      <p class="text-xs sm:text-sm text-slate-600 font-medium">
                        ចេញដោយ៖ {{ exp.certificate.issuer }}
                      </p>

                      <!-- Credential ID (Only rendered when available) -->
                      <p
                        v-if="exp.certificate.credentialId"
                        class="text-xs font-mono text-slate-500"
                      >
                        លេខសម្គាល់៖ {{ exp.certificate.credentialId }}
                      </p>

                      <!-- Lecturer's Website Link (Subtle external reference, safe new tab) -->
                      <div v-if="getCertificateLecturerUrl(exp.certificate)" class="pt-1">
                        <a
                          :href="getCertificateLecturerUrl(exp.certificate)!"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors"
                          :aria-label="`ចូលទៅកាន់គេហទំព័រគ្រូបង្រៀន Mr. Chau Dara`"
                          @click.stop
                        >
                          <Globe class="w-3.5 h-3.5 text-indigo-500 shrink-0" aria-hidden="true" />
                          <span>គេហទំព័រគ្រូបង្រៀន — TFDevs</span>
                          <ExternalLink
                            class="w-3 h-3 text-indigo-400 shrink-0"
                            aria-hidden="true"
                          />
                        </a>
                      </div>
                    </div>

                    <!-- Clear Actions: View Certificate & Download PDF -->
                    <div class="pt-1 flex flex-wrap items-center gap-2.5">
                      <!-- View Certificate Action -->
                      <button
                        type="button"
                        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-2xs min-h-11 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                        @click.stop="openCertificateModal(exp.certificate)"
                      >
                        <Eye class="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
                        <span>មើលវិញ្ញាបនបត្រ</span>
                      </button>

                      <!-- Download PDF Action (Separate Action, Only if real PDF exists) -->
                      <a
                        v-if="getCertificatePdfUrl(exp.certificate)"
                        :href="getCertificatePdfUrl(exp.certificate)!"
                        :download="getPdfDownloadName(exp.certificate)"
                        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors min-h-11 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                        @click.stop
                      >
                        <Download class="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                        <span>ទាញយក PDF</span>
                      </a>

                      <!-- External Verification Link (Rendered ONLY if real verification URL exists) -->
                      <a
                        v-if="getCertificateVerifyUrl(exp.certificate)"
                        :href="getCertificateVerifyUrl(exp.certificate)!"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 text-xs font-semibold transition-colors min-h-11 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                        @click.stop
                      >
                        <span>ផ្ទៀងផ្ទាត់ផ្លូវការ</span>
                        <ExternalLink class="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Technology Tags -->
            <div
              v-if="exp.technologies && exp.technologies.length > 0"
              class="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100"
            >
              <span class="text-xs font-medium text-slate-500 mr-1 select-none">បច្ចេកវិទ្យា៖</span>
              <span
                v-for="tech in exp.technologies"
                :key="tech"
                class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors duration-150"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Navigation to Next Section (Process) -->
      <div
        class="pt-10 sm:pt-14 mt-12 sm:mt-16 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm"
      >
        <button
          type="button"
          class="font-semibold text-slate-900 hover:text-slate-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          @click="handleNavigate('#process')"
        >
          <span>ស្វែងយល់ពីដំណើរការ និងរបៀបដែលខ្ញុំធ្វើការ</span>
          <ArrowRight class="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>

    <!-- 3. Accessible Certificate Lightbox Modal (Clean, Neutral, Document-Focused) -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="isModalOpen && selectedCert"
          data-lenis-prevent
          class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-hidden"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`cert-modal-title-${selectedCert.id}`"
          @click.self="closeCertificateModal"
        >
          <!-- Modal Shell: Fitted to viewport so full certificate is visible without scrolling -->
          <div
            ref="modalRef"
            data-lenis-prevent
            class="relative w-full max-w-5xl h-[94vh] max-h-[94vh] bg-white border border-slate-200/90 rounded-2xl shadow-xl flex flex-col overflow-hidden text-left my-auto modal-card"
          >
            <!-- Modal Header: Compact metadata & accessible close button (shrink-0) -->
            <div
              class="px-4 py-2.5 sm:px-5 sm:py-3 border-b border-slate-200/80 bg-white flex items-center justify-between gap-3 shrink-0"
            >
              <div class="space-y-0.5 min-w-0 pr-2">
                <!-- Metadata tags -->
                <div class="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    v-if="selectedCert.category"
                    class="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wide leading-none"
                  >
                    {{ selectedCert.category }}
                  </span>
                  <span class="text-slate-500 font-sans text-xs">
                    {{ selectedCert.issueDate }}
                  </span>
                  <span
                    v-if="selectedCert.credentialId"
                    class="font-mono text-slate-600 text-xs font-semibold"
                  >
                    • No. {{ selectedCert.credentialId }}
                  </span>
                </div>

                <!-- Document Title & Issuer -->
                <div class="flex flex-wrap items-baseline gap-2 pt-0.5">
                  <h3
                    :id="`cert-modal-title-${selectedCert.id}`"
                    class="text-sm sm:text-base font-bold text-slate-900 font-heading leading-snug truncate"
                  >
                    {{ selectedCert.title }}
                  </h3>
                  <span class="text-xs text-slate-300 hidden sm:inline">•</span>
                  <p class="text-xs text-slate-600">ចេញដោយ៖ {{ selectedCert.issuer }}</p>
                </div>
              </div>

              <!-- Accessible Close Button (>= 44x44px touch target) -->
              <button
                ref="closeButtonRef"
                type="button"
                class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center border border-slate-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer transition-colors shadow-2xs shrink-0"
                aria-label="បិទផ្ទាំងវិញ្ញាបនបត្រ"
                @click="closeCertificateModal"
              >
                <X class="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <!-- Modal Body (Document Viewer: Scales 100% of certificate to fit without scrolling) -->
            <div
              data-lenis-prevent
              class="flex-1 min-h-0 p-2 sm:p-3 md:p-4 bg-slate-100/70 flex items-center justify-center"
              :class="isZoomed ? 'overflow-auto' : 'overflow-hidden'"
            >
              <!-- Actual Certificate Image (Fits complete document in viewport cleanly) -->
              <div
                v-if="getCertificateImage(selectedCert)"
                class="w-full h-full flex items-center justify-center"
              >
                <img
                  :src="getCertificateImage(selectedCert)!"
                  :alt="`វិញ្ញាបនបត្រ ${selectedCert.title} ចេញដោយ ${selectedCert.issuer}`"
                  class="max-w-full max-h-full object-contain rounded-lg border border-slate-200/90 shadow-xs bg-white transition-transform duration-200 select-none"
                  :class="{ 'scale-125 cursor-zoom-out': isZoomed, 'cursor-zoom-in': !isZoomed }"
                  @click="toggleZoom"
                />
              </div>

              <!-- Dignified, Restrained Document Placeholder when image is not yet uploaded -->
              <div
                v-else
                class="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 sm:p-8 text-center space-y-4 shadow-xs"
              >
                <div
                  class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-slate-500 shadow-2xs"
                >
                  <FileText class="w-6 h-6" aria-hidden="true" />
                </div>

                <div class="space-y-1">
                  <h4 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
                    {{ selectedCert.title }}
                  </h4>
                  <p class="text-xs sm:text-sm text-slate-600 font-medium">
                    {{ selectedCert.issuer }}
                  </p>
                </div>

                <!-- Factual metadata overview without artificial stamps -->
                <div
                  class="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 text-xs text-left space-y-2"
                >
                  <div class="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span class="text-slate-500 font-medium">កាលបរិច្ឆេទចេញ៖</span>
                    <span class="text-slate-800 font-semibold font-sans">{{
                      selectedCert.issueDate
                    }}</span>
                  </div>
                  <div
                    v-if="selectedCert.category"
                    class="flex justify-between items-center py-1 border-b border-slate-200/60"
                  >
                    <span class="text-slate-500 font-medium">ប្រភេទឯកសារ៖</span>
                    <span class="text-slate-800 font-semibold">{{ selectedCert.category }}</span>
                  </div>
                  <div
                    v-if="selectedCert.credentialId"
                    class="flex justify-between items-center py-1 border-b border-slate-200/60"
                  >
                    <span class="text-slate-500 font-medium">លេខសម្គាល់ (ID)៖</span>
                    <span class="text-slate-800 font-mono">{{ selectedCert.credentialId }}</span>
                  </div>
                  <div class="flex justify-between items-center py-1">
                    <span class="text-slate-500 font-medium">ឯកសាររូបភាពដើម៖</span>
                    <span class="text-slate-600">កំពុងរង់ចាំការបញ្ចូលរូបភាពដើម</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer (Compact actions, shrink-0) -->
            <div
              class="px-4 py-2.5 sm:px-5 sm:py-3 border-t border-slate-200/80 bg-white flex flex-wrap items-center justify-between gap-2.5 shrink-0"
            >
              <!-- Left: Lecturer's Website reference & External Verification Link -->
              <div class="flex flex-wrap items-center gap-2">
                <a
                  v-if="getCertificateLecturerUrl(selectedCert)"
                  :href="getCertificateLecturerUrl(selectedCert)!"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/90 text-xs font-semibold transition-colors min-h-10 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  :aria-label="`គេហទំព័រគ្រូបង្រៀន (TFDevs)`"
                >
                  <Globe class="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
                  <span>គេហទំព័រគ្រូបង្រៀន (TFDevs)</span>
                  <ExternalLink class="w-3 h-3 text-slate-400" aria-hidden="true" />
                </a>

                <a
                  v-if="getCertificateVerifyUrl(selectedCert)"
                  :href="getCertificateVerifyUrl(selectedCert)!"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors min-h-10 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <span>ផ្ទៀងផ្ទាត់ផ្លូវការ</span>
                  <ExternalLink class="w-3.5 h-3.5" aria-hidden="true" />
                </a>

                <span
                  v-if="
                    !getCertificateLecturerUrl(selectedCert) &&
                    !getCertificateVerifyUrl(selectedCert)
                  "
                  class="text-xs text-slate-500"
                >
                  ឯកសារបញ្ជាក់សមត្ថភាព និងការបញ្ចប់វគ្គបណ្តុះបណ្តាលជាក់ស្តែង
                </span>
              </div>

              <!-- Right: Utility Actions (Download PDF, Zoom, Open original, Close) -->
              <div class="flex flex-wrap items-center gap-2">
                <!-- Download PDF Action (Direct file download of actual PDF document) -->
                <a
                  v-if="getCertificatePdfUrl(selectedCert)"
                  :href="getCertificatePdfUrl(selectedCert)!"
                  :download="getPdfDownloadName(selectedCert)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors min-h-10 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  <Download class="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  <span>ទាញយក PDF</span>
                </a>

                <button
                  v-if="getCertificateImage(selectedCert)"
                  type="button"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors min-h-10 shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  :title="isZoomed ? 'បង្រួមទំហំធម្មតា' : 'ពង្រីកទំហំ'"
                  @click="toggleZoom"
                >
                  <component
                    :is="isZoomed ? Minimize2 : Maximize2"
                    class="w-3.5 h-3.5 text-slate-500"
                    aria-hidden="true"
                  />
                  <span>{{ isZoomed ? 'បង្រួម' : 'ពង្រីក' }}</span>
                </button>

                <a
                  v-if="getCertificateImage(selectedCert)"
                  :href="getCertificateImage(selectedCert)!"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors min-h-10 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  <span>បើកទំហំដើម</span>
                  <ExternalLink class="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  class="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer min-h-10 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  @click="closeCertificateModal"
                >
                  បិទផ្ទាំង
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease-out;
}

.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition:
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.22s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-card {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}

.modal-fade-leave-to .modal-card {
  transform: scale(0.97) translateY(4px);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active,
  .modal-fade-leave-active,
  .modal-fade-enter-active .modal-card,
  .modal-fade-leave-active .modal-card {
    transition: none !important;
  }
}
</style>
