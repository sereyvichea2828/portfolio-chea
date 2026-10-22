import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useReducedMotion(): { isReducedMotion: Ref<boolean> } {
  const isReducedMotion = ref<boolean>(false)
  let mediaQueryList: MediaQueryList | null = null

  const handleMotionPreferenceChange = (event: MediaQueryListEvent): void => {
    isReducedMotion.value = event.matches
  }

  onMounted(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)')
      isReducedMotion.value = mediaQueryList.matches
      mediaQueryList.addEventListener('change', handleMotionPreferenceChange)
    }
  })

  onUnmounted(() => {
    if (mediaQueryList) {
      mediaQueryList.removeEventListener('change', handleMotionPreferenceChange)
      mediaQueryList = null
    }
  })

  return { isReducedMotion }
}
