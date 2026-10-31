import { ref, computed, onUnmounted, type ComputedRef } from 'vue'
import { getGlobalLenis, startGlobalLenis, stopGlobalLenis } from '@/composables/useSmoothScroll'

/**
 * Global Reference-Counted Scroll Lock & Modal State Manager
 * -----------------------------------------------------------
 * Single source of truth for all modal overlays, drawers, and lightboxes.
 * Prevents race conditions where one closing modal restarts Lenis or removes
 * overflow-hidden while another overlay is still open.
 */

const activeModals = ref<Set<string>>(new Set())
let isPhysicallyLocked = false

export interface ModalStateController {
  isAnyModalOpen: ComputedRef<boolean>
  activeModalIds: ComputedRef<string[]>
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  registerModal: (modalId: string, isOpen: boolean) => void
  forceReleaseAllLocks: () => void
  syncScrollState: () => void
}

function updatePhysicalScrollLock(): void {
  if (typeof document === 'undefined') return

  const shouldLock = activeModals.value.size > 0
  const lenis = getGlobalLenis()

  if (shouldLock) {
    if (!isPhysicallyLocked) {
      isPhysicallyLocked = true
      document.body.classList.add('overflow-hidden')
      document.documentElement.classList.add('lenis-stopped')
      stopGlobalLenis()

      if (import.meta.env.DEV) {
        console.log(
          `[ScrollLock] 🔒 LOCKED by: [${Array.from(activeModals.value).join(', ')}] | Active locks: ${activeModals.value.size} | Lenis: ${lenis ? 'stopped' : 'not initialized'}`
        )
      }
    }
  } else {
    // When all active locks are released (count drops to 0):
    if (
      isPhysicallyLocked ||
      document.body.classList.contains('overflow-hidden') ||
      document.documentElement.classList.contains('lenis-stopped')
    ) {
      isPhysicallyLocked = false
      document.body.classList.remove('overflow-hidden')
      document.documentElement.classList.remove('lenis-stopped')
      startGlobalLenis()

      if (import.meta.env.DEV) {
        console.log(`[ScrollLock] 🔓 UNLOCKED. All locks released. Lenis resumed naturally.`)
      }
    }
  }
}

export function useModalState(): ModalStateController {
  const isAnyModalOpen = computed<boolean>(() => activeModals.value.size > 0)
  const activeModalIds = computed<string[]>(() => Array.from(activeModals.value))

  const openModal = (modalId: string): void => {
    if (!modalId) return
    const next = new Set(activeModals.value)
    next.add(modalId)
    activeModals.value = next
    updatePhysicalScrollLock()
  }

  const closeModal = (modalId: string): void => {
    if (!modalId) return
    if (!activeModals.value.has(modalId)) return
    const next = new Set(activeModals.value)
    next.delete(modalId)
    activeModals.value = next
    updatePhysicalScrollLock()
  }

  const registerModal = (modalId: string, isOpen: boolean): void => {
    if (!modalId) return
    const hasModal = activeModals.value.has(modalId)
    if (isOpen && !hasModal) {
      const next = new Set(activeModals.value)
      next.add(modalId)
      activeModals.value = next
      updatePhysicalScrollLock()
    } else if (!isOpen && hasModal) {
      const next = new Set(activeModals.value)
      next.delete(modalId)
      activeModals.value = next
      updatePhysicalScrollLock()
    }
  }

  /**
   * Emergency reset mechanism: safely unblocks page scrolling upon interrupted
   * navigation, unmounted views, or broken modal lifecycles.
   */
  const forceReleaseAllLocks = (): void => {
    if (activeModals.value.size > 0 || isPhysicallyLocked) {
      if (import.meta.env.DEV) {
        console.warn(
          `[ScrollLock] ⚠️ Emergency release: clearing ${activeModals.value.size} active lock(s):`,
          Array.from(activeModals.value)
        )
      }
      activeModals.value = new Set()
      updatePhysicalScrollLock()
    }
  }

  const syncScrollState = (): void => {
    updatePhysicalScrollLock()
  }

  return {
    isAnyModalOpen,
    activeModalIds,
    openModal,
    closeModal,
    registerModal,
    forceReleaseAllLocks,
    syncScrollState,
  }
}

/**
 * Component Lifecycle-Safe Lock Composable
 * Automatically releases its registered lock when the host component unmounts!
 */
export function useScrollLock(lockId: string) {
  const modalState = useModalState()

  const lock = (): void => modalState.openModal(lockId)
  const unlock = (): void => modalState.closeModal(lockId)
  const setLocked = (locked: boolean): void => modalState.registerModal(lockId, locked)

  onUnmounted(() => {
    modalState.closeModal(lockId)
  })

  return {
    lock,
    unlock,
    setLocked,
    isLocked: modalState.isAnyModalOpen,
  }
}

// Development Diagnostic Support (window.__SCROLL_DEBUG__)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as unknown as { __SCROLL_DEBUG__: unknown }).__SCROLL_DEBUG__ = {
    getActiveLocks: () => Array.from(activeModals.value),
    isPhysicallyLocked: () => isPhysicallyLocked,
    isBodyOverflowHidden: () => document.body.classList.contains('overflow-hidden'),
    isHtmlLenisStopped: () => document.documentElement.classList.contains('lenis-stopped'),
    isLenisStopped: () => Boolean(getGlobalLenis()?.isStopped),
    forceUnlock: () => {
      const { forceReleaseAllLocks } = useModalState()
      forceReleaseAllLocks()
    },
  }
}
