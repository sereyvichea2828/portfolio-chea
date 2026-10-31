import { ref, computed } from 'vue';
import { EXPERIENCES } from '@/data/portfolioData';
import type { ExperienceCertificate } from '@/types/portfolio';

const isCertificateModalOpen = ref<boolean>(false);
const selectedCertificate = ref<ExperienceCertificate | null>(null);

export function useCertificateModal() {
  const defaultCert = computed<ExperienceCertificate | null>(() => {
    const item = EXPERIENCES.find((e) => e.certificate);
    return item?.certificate || null;
  });

  const openCertificate = (cert?: ExperienceCertificate | null): void => {
    selectedCertificate.value = cert || defaultCert.value;
    if (selectedCertificate.value) {
      isCertificateModalOpen.value = true;
    }
  };

  const closeCertificate = (): void => {
    isCertificateModalOpen.value = false;
    selectedCertificate.value = null;
  };

  return {
    isCertificateModalOpen,
    selectedCertificate,
    openCertificate,
    closeCertificate,
  };
}
