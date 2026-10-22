<script setup lang="ts">
interface Props {
  sizeClass?: string;
  iconClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  sizeClass: 'w-10 h-10',
  iconClass: 'w-6 h-5',
});
</script>

<template>
  <div
    :class="[
      props.sizeClass,
      'relative rounded-xl bg-white/95 border border-purple-100/90 shadow-xs shadow-purple-950/5 flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover:border-purple-300/70 group-hover:shadow-md group-hover:shadow-purple-500/10 group-hover:scale-102',
    ]"
    aria-hidden="true"
  >
    <!-- Soft lavender ambient glow backdrop -->
    <div
      class="absolute inset-0 rounded-xl bg-linear-to-br from-purple-100/40 via-indigo-50/20 to-transparent pointer-events-none"
    />

    <!-- Geometric DT Monogram SVG (Dark navy-black) -->
    <svg
      :class="[props.iconClass, 'relative z-10 text-slate-900 transition-colors duration-200']"
      viewBox="0 0 80 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 4 4
           L 76 4
           L 76 14
           L 61 14
           L 61 54
           L 52 45
           L 52 14
           L 43.5 14
           C 45.8 16.5 47 20 47 25
           L 47 33
           C 47 43 41 54 29 54
           L 2 54
           L 2 20
           L 12 20
           L 12 44
           L 28 44
           C 34 44 37 39 37 32
           L 37 27
           C 37 20 34 15 28 14
           L 14 14
           Z"
        fill="currentColor"
      />
    </svg>
  </div>
</template>
