import { onUnmounted, type Ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/composables/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Editorial Motion Tokens: Calibrated easing curves, durations, and spatial distances
 * inspired by high-end design engineering (Linear, Apple, Vercel).
 */
export const MOTION_TOKENS = {
  ease: {
    editorial: 'expo.out',
    smooth: 'power3.out',
    gentle: 'power2.out',
    snappy: 'power4.out',
    ambient: 'sine.inOut',
    inOut: 'power2.inOut',
  },
  duration: {
    micro: 0.2,
    quick: 0.35,
    normal: 0.55,
    editorial: 0.75,
    dramatic: 0.95,
  },
  stagger: {
    tight: 0.04,
    normal: 0.07,
    editorial: 0.1,
  },
  distance: {
    subtle: 10,
    normal: 18,
    prominent: 28,
  },
} as const;

export interface ModalAnimationElements {
  backdrop: HTMLElement;
  card?: HTMLElement | null;
  header?: HTMLElement | null;
  sections?: NodeListOf<HTMLElement> | HTMLElement[];
  footer?: HTMLElement | null;
}

export function useMotionSystem() {
  const { isReducedMotion } = useReducedMotion();

  /**
   * Universal GSAP Modal Entrance Choreography
   */
  const animateModalEnter = (
    elements: ModalAnimationElements,
    done: () => void,
  ): gsap.core.Timeline | null => {
    if (isReducedMotion.value) {
      done();
      return null;
    }

    const { backdrop, card, header, sections, footer } = elements;
    const tl = gsap.timeline({ onComplete: done });

    // 1. Backdrop fade-in with blur
    tl.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: MOTION_TOKENS.duration.quick, ease: MOTION_TOKENS.ease.gentle },
      0,
    );

    // 2. Modal card zooms up with depth perspective
    if (card) {
      tl.fromTo(
        card,
        { opacity: 0, scale: 0.94, y: MOTION_TOKENS.distance.normal },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: MOTION_TOKENS.duration.normal,
          ease: MOTION_TOKENS.ease.smooth,
          clearProps: 'transform,willChange',
        },
        0.04,
      );
    }

    // 3. Staggered reveal of header
    if (header) {
      tl.fromTo(
        header,
        { opacity: 0, y: MOTION_TOKENS.distance.subtle },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_TOKENS.duration.quick,
          ease: MOTION_TOKENS.ease.gentle,
          clearProps: 'transform,willChange',
        },
        0.12,
      );
    }

    // 4. Staggered sections
    if (sections && sections.length > 0) {
      tl.fromTo(
        sections,
        { opacity: 0, y: MOTION_TOKENS.distance.subtle },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_TOKENS.duration.quick,
          stagger: MOTION_TOKENS.stagger.tight,
          ease: MOTION_TOKENS.ease.gentle,
          clearProps: 'transform,willChange',
        },
        0.16,
      );
    }

    // 5. Action Footer
    if (footer) {
      tl.fromTo(
        footer,
        { opacity: 0, y: MOTION_TOKENS.distance.subtle },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_TOKENS.duration.quick,
          ease: MOTION_TOKENS.ease.gentle,
          clearProps: 'transform,willChange',
        },
        0.24,
      );
    }

    return tl;
  };

  /**
   * Universal GSAP Modal Exit Choreography
   */
  const animateModalLeave = (
    elements: { backdrop: HTMLElement; card?: HTMLElement | null },
    done: () => void,
  ): gsap.core.Timeline | null => {
    if (isReducedMotion.value) {
      done();
      return null;
    }

    const { backdrop, card } = elements;
    const tl = gsap.timeline({ onComplete: done });

    if (card) {
      tl.to(
        card,
        {
          opacity: 0,
          scale: 0.96,
          y: MOTION_TOKENS.distance.subtle,
          duration: MOTION_TOKENS.duration.micro,
          ease: 'power2.in',
        },
        0,
      );
    }

    tl.to(
      backdrop,
      {
        opacity: 0,
        duration: MOTION_TOKENS.duration.micro,
        ease: 'power2.in',
      },
      0.03,
    );

    return tl;
  };

  /**
   * Magnetic Button Interaction Composable using gsap.quickTo
   * Creates a tactile physics pull toward the mouse cursor.
   */
  const registerMagnetic = (
    targetRef: Ref<HTMLElement | null>,
    options?: { strength?: number },
  ): (() => void) => {
    if (typeof window === 'undefined') return () => {};

    const strength = options?.strength ?? 0.28;
    const el = targetRef.value;
    if (!el || isReducedMotion.value) return () => {};

    // Only apply magnetic behavior on desktop pointers (hover: hover)
    if (window.matchMedia('(hover: none)').matches) return () => {};

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent): void => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      xTo(deltaX);
      yTo(deltaY);
    };

    const handleMouseLeave = (): void => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    const cleanup = (): void => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(el, { clearProps: 'x,y' });
    };

    onUnmounted(cleanup);
    return cleanup;
  };

  return {
    tokens: MOTION_TOKENS,
    isReducedMotion,
    animateModalEnter,
    animateModalLeave,
    registerMagnetic,
  };
}
