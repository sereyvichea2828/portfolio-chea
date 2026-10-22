import { ref, computed, type ComputedRef } from 'vue'

const activeModals = ref<Set<string>>(new Set())

export interface ModalStateController {
  isAnyModalOpen: ComputedRef<boolean>
  activeModalIds: ComputedRef<string[]>
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  registerModal: (modalId: string, isOpen: boolean) => void
}

export function useModalState(): ModalStateController {
  const isAnyModalOpen = computed<boolean>(() => activeModals.value.size > 0)
  const activeModalIds = computed<string[]>(() => Array.from(activeModals.value))

  const openModal = (modalId: string): void => {
    activeModals.value.add(modalId)
  }

  const closeModal = (modalId: string): void => {
    activeModals.value.delete(modalId)
  }

  const registerModal = (modalId: string, isOpen: boolean): void => {
    if (isOpen) {
      activeModals.value.add(modalId)
    } else {
      activeModals.value.delete(modalId)
    }
  }

  return {
    isAnyModalOpen,
    activeModalIds,
    openModal,
    closeModal,
    registerModal,
  }
}
