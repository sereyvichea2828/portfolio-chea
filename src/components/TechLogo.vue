<script setup lang="ts">
import TechnologyLogo from '@/components/TechnologyLogo.vue'

interface Props {
  name: string
  sizeClass?: string
}

withDefaults(defineProps<Props>(), {
  sizeClass: 'w-6 h-6',
})
</script>

<template>
  <TechnologyLogo :name="name" :size-class="sizeClass" />
</template>
