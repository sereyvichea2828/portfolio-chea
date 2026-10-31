<script setup lang="ts">
import { computed } from 'vue'
import {
  siTailwindcss,
  siThreedotjs,
  siNodedotjs,
  siExpress,
  siMongodb,
  siRedis,
  siPrisma,
  siGit,
  siGithub,
  siDocker,
  siPostman,
  siLinux,
  siGnubash,
} from 'simple-icons'
import { resolveTechnologyId, TECHNOLOGY_REGISTRY, type TechnologyMetadata } from '@/data/technologyIcons'

interface Props {
  name: string
  sizeClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  sizeClass: 'w-6 h-6',
})

const techId = computed<string>(() => resolveTechnologyId(props.name))
const techMeta = computed<TechnologyMetadata | undefined>(() => TECHNOLOGY_REGISTRY[techId.value])
</script>

<template>
  <div
    :class="[
      techMeta?.isDual && (sizeClass === 'w-6 h-6' || sizeClass === 'w-7 h-7')
        ? 'w-8 h-6'
        : sizeClass,
      'inline-flex items-center justify-center shrink-0 select-none overflow-visible',
    ]"
    :title="techMeta?.title || props.name"
    aria-hidden="true"
  >
    <!-- 1. Vue.js (Official Two-Tone Brand Logo) -->
    <svg
      v-if="techId === 'vue'"
      viewBox="0 0 256 221"
      class="w-full h-full"
    >
      <path fill="#42B883" d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36z" />
      <path fill="#35495E" d="M0 0l128 220.8L256 0h-51.2L128 132.48 49.92 0H0z" />
    </svg>

    <!-- 2. TypeScript (Official Brand Tile) -->
    <svg
      v-else-if="techId === 'typescript'"
      viewBox="0 0 128 128"
      class="w-full h-full rounded-xs overflow-hidden"
    >
      <rect width="128" height="128" fill="#3178C6" rx="14" />
      <path
        fill="#FFFFFF"
        d="M68.5 86.8c1.8 3.1 4.7 5.2 8.7 5.2 4.1 0 6.7-2 6.7-4.8 0-3.3-2.6-4.5-8.5-7.1-8.5-3.6-14-7.4-14-16.7 0-9.2 7.1-16.2 18.2-16.2 7.8 0 13.5 2.8 17.4 9.6l-8.5 5.4c-2.1-3.6-4.7-4.9-8.7-4.9-3.9 0-6.1 1.9-6.1 4.4 0 2.9 2.4 4.1 8 6.5 9.4 4 14.7 7.7 14.7 17.3 0 10.7-8.3 17-19.3 17-9.4 0-16.2-3.8-20.1-10.7l8.7-5zm-39.7 19.4V58.7H13.6v-10h41.4v10H39.8v47.5h-11z"
      />
    </svg>

    <!-- 3. JavaScript (Official Brand Tile) -->
    <svg
      v-else-if="techId === 'javascript'"
      viewBox="0 0 128 128"
      class="w-full h-full rounded-xs overflow-hidden"
    >
      <rect width="128" height="128" fill="#F7DF1E" rx="14" />
      <path
        fill="#000000"
        d="M67.3 100c0 9-5.3 13.3-13.2 13.3-6.5 0-10.3-3.2-12.7-7.6l8.8-5.3c1.4 2.4 2.8 4.2 5.1 4.2 2.4 0 3.7-1 3.7-4.7V57.6h8.3V100zm23.6-3.8c3.2 5.5 7.6 9.1 14.8 9.1 6.2 0 10.2-3.1 10.2-7.3 0-5.1-4.1-6.9-10.9-9.9-9.9-4.3-16.3-9.7-16.3-20.9 0-10.4 8.1-18.4 20.9-18.4 9 0 15.4 3.2 19.9 11.2l-8.5 5.5c-2.4-4.2-5.1-6-11.4-6-4.5 0-7.3 2.1-7.3 5.3 0 3.8 2.6 5.3 8.7 8 11.4 4.9 18.5 9.8 18.5 21.6 0 12.3-9.7 19-22.7 19-12.6 0-20.3-5.9-24.5-14.8l8.6-5.4z"
      />
    </svg>

    <!-- 4. Tailwind CSS (Official Cyan Wind Wave) -->
    <svg
      v-else-if="techId === 'tailwind'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#06B6D4" :d="siTailwindcss.path" />
    </svg>

    <!-- 5. HTML5 & CSS3 (Dual Official Shields Side-by-Side) -->
    <div
      v-else-if="techId === 'html5-css3'"
      class="flex items-center justify-center gap-1 w-full h-full"
    >
      <!-- HTML5 Shield -->
      <svg viewBox="0 0 128 128" class="w-1/2 h-full">
        <path fill="#E34F26" d="M19 116L9 4h110l-10 112-45 12z" />
        <path fill="#EF652A" d="M64 118l37-10 8-94H64z" />
        <path fill="#ECECEC" d="M64 48H44l-2-20h44l2-20H22l5 60h37zm0 43l-20-5-1-15H23l2 25 39 11z" />
        <path fill="#FFF" d="M64 48h20l-2 20H64v20l19-5 2-19h20l-3 34-38 10z" />
      </svg>
      <!-- CSS3 Shield -->
      <svg viewBox="0 0 128 128" class="w-1/2 h-full">
        <path fill="#1572B6" d="M19 116L9 4h110l-10 112-45 12z" />
        <path fill="#33A9DC" d="M64 118l37-10 8-94H64z" />
        <path fill="#ECECEC" d="M64 48H44l-2-20h44l2-20H22l5 60h37zm0 43l-20-5-1-15H23l2 25 39 11z" />
        <path fill="#FFF" d="M64 48h20l-2 20H64v20l19-5 2-19h20l-3 34-38 10z" />
      </svg>
    </div>

    <!-- 5b. HTML5 Single -->
    <svg
      v-else-if="techId === 'html5'"
      viewBox="0 0 128 128"
      class="w-full h-full"
    >
      <path fill="#E34F26" d="M19 116L9 4h110l-10 112-45 12z" />
      <path fill="#EF652A" d="M64 118l37-10 8-94H64z" />
      <path fill="#ECECEC" d="M64 48H44l-2-20h44l2-20H22l5 60h37zm0 43l-20-5-1-15H23l2 25 39 11z" />
      <path fill="#FFF" d="M64 48h20l-2 20H64v20l19-5 2-19h20l-3 34-38 10z" />
    </svg>

    <!-- 5c. CSS3 Single -->
    <svg
      v-else-if="techId === 'css3'"
      viewBox="0 0 128 128"
      class="w-full h-full"
    >
      <path fill="#1572B6" d="M19 116L9 4h110l-10 112-45 12z" />
      <path fill="#33A9DC" d="M64 118l37-10 8-94H64z" />
      <path fill="#ECECEC" d="M64 48H44l-2-20h44l2-20H22l5 60h37zm0 43l-20-5-1-15H23l2 25 39 11z" />
      <path fill="#FFF" d="M64 48h20l-2 20H64v20l19-5 2-19h20l-3 34-38 10z" />
    </svg>

    <!-- 6. Three.js & Canvas (Official Three.js Logo + Distinct Neutral Canvas Symbol) -->
    <div
      v-else-if="techId === 'three-canvas'"
      class="flex items-center justify-center gap-1 w-full h-full"
    >
      <!-- Three.js Official Mark -->
      <svg viewBox="0 0 24 24" class="w-1/2 h-full">
        <path fill="#0F172A" :d="siThreedotjs.path" />
      </svg>
      <!-- Neutral Canvas Drafting Grid Mark -->
      <svg
        viewBox="0 0 24 24"
        class="w-1/2 h-full text-indigo-500"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="3.5" fill="#EEF2FF" stroke="#6366F1" stroke-width="1.6" />
        <circle cx="8" cy="8" r="1.75" fill="#6366F1" stroke="none" />
        <path d="M21 15l-5-5L5 21" stroke="#4F46E5" stroke-width="1.8" />
      </svg>
    </div>

    <!-- 6b. Three.js Single -->
    <svg
      v-else-if="techId === 'three'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#0F172A" :d="siThreedotjs.path" />
    </svg>

    <!-- 7. Node.js (Official Green Hexagon) -->
    <svg
      v-else-if="techId === 'node'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#5FA04E" :d="siNodedotjs.path" />
    </svg>

    <!-- 8. Express.js (Official Project Mark) -->
    <svg
      v-else-if="techId === 'express'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#0F172A" :d="siExpress.path" />
    </svg>

    <!-- 9. REST APIs (Neutral Concept: Clean API Endpoints / Gateway) -->
    <svg
      v-else-if="techId === 'rest'"
      viewBox="0 0 24 24"
      class="w-full h-full"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="2" y="3" width="20" height="18" rx="4" fill="#EEF2FF" stroke="#6366F1" stroke-width="1.6" />
      <path d="M7 9l-2 3 2 3" stroke="#4F46E5" stroke-width="2" />
      <path d="M17 9l2 3-2 3" stroke="#4F46E5" stroke-width="2" />
      <path d="M13 8l-2 8" stroke="#818CF8" stroke-width="2" />
    </svg>

    <!-- 10. JWT & OAuth2 (Neutral Concept: Cryptographic Token & Auth Key) -->
    <svg
      v-else-if="techId === 'jwt-oauth'"
      viewBox="0 0 24 24"
      class="w-full h-full"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="2" y="3" width="20" height="18" rx="4" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.6" />
      <circle cx="9" cy="12" r="3" stroke="#D97706" stroke-width="2" />
      <path d="M12 12h6m-2-2v4m-2-2v2" stroke="#D97706" stroke-width="1.8" />
    </svg>

    <!-- 11. WebSocket & SSE (Neutral Concept: Real-Time Duplex Streaming Waves) -->
    <svg
      v-else-if="techId === 'websocket-sse'"
      viewBox="0 0 24 24"
      class="w-full h-full"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="2" y="3" width="20" height="18" rx="4" fill="#ECFDF5" stroke="#10B981" stroke-width="1.6" />
      <path d="M6 10l3-3 3 3M9 7v10" stroke="#059669" stroke-width="2" />
      <path d="M18 14l-3 3-3-3M15 17V7" stroke="#0D9488" stroke-width="2" />
    </svg>

    <!-- 12. Security Middleware (Neutral Concept: Shield & Defensive Lock) -->
    <svg
      v-else-if="techId === 'security-middleware'"
      viewBox="0 0 24 24"
      class="w-full h-full"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M12 2l8 4v6c0 5.25-3.5 10.15-8 11.5-4.5-1.35-8-6.25-8-11.5V6l8-4z"
        fill="#EEF2FF"
        stroke="#4F46E5"
        stroke-width="1.8"
      />
      <rect x="9.5" y="11" width="5" height="4" rx="1" fill="#4F46E5" />
      <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" stroke="#4F46E5" stroke-width="1.5" />
    </svg>

    <!-- 13. PostgreSQL (Official Blue Slonik Elephant) -->
    <svg
      viewBox="0 0 128 128"
      v-else-if="techId === 'postgresql'"
      class="w-full h-full"
    >
      <path fill="#336791" d="M115.731 77.44c-13.925 2.873-14.882-1.842-14.882-1.842 14.703-21.816 20.849-49.51 15.545-56.287C101.924.823 76.875 9.566 76.457 9.793l-.135.024c-2.751-.571-5.83-.911-9.291-.967-6.301-.103-11.08 1.652-14.707 4.402 0 0-44.684-18.408-42.606 23.151.442 8.842 12.672 66.899 27.26 49.363 5.332-6.412 10.483-11.834 10.483-11.834 2.559 1.699 5.622 2.567 8.833 2.255l.25-.212c-.078.796-.042 1.575.1 2.497-3.758 4.199-2.654 4.936-10.167 6.482-7.602 1.566-3.136 4.355-.22 5.084 3.534.884 11.712 2.136 17.237-5.598l-.221.882c1.473 1.18 2.507 7.672 2.334 13.557-.174 5.885-.29 9.926.871 13.082 1.16 3.156 2.316 10.256 12.192 8.14 8.252-1.768 12.528-6.351 13.124-13.995.422-5.435 1.377-4.631 1.438-9.49l.767-2.3c.884-7.367.14-9.743 5.225-8.638l1.235.108c3.742.17 8.639-.602 11.514-1.938 6.19-2.871 9.861-7.667 3.758-6.408z" />
      <path fill="#FFFFFF" d="M75.957 122.307c-8.232 0-10.84-6.519-11.907-9.185-1.562-3.907-1.899-19.069-1.551-31.503a1.59 1.59 0 011.64-1.55 1.594 1.594 0 011.55 1.639c-.401 14.341.168 27.337 1.324 30.229 1.804 4.509 4.54 8.453 12.275 6.796 7.343-1.575 10.093-4.359 11.318-11.46.94-5.449 2.799-20.951 3.028-24.01a1.593 1.593 0 011.71-1.472 1.597 1.597 0 011.472 1.71c-.239 3.185-2.089 18.657-3.065 24.315-1.446 8.387-5.185 12.191-13.794 14.037-1.463.313-2.792.453-4 .454zM31.321 90.466a6.71 6.71 0 01-2.116-.35c-5.347-1.784-10.44-10.492-15.138-25.885-3.576-11.717-5.842-23.947-6.041-27.922-.589-11.784 2.445-20.121 9.02-24.778 13.007-9.216 34.888-.44 35.813-.062a1.596 1.596 0 01-1.207 2.955c-.211-.086-21.193-8.492-32.768-.285-5.622 3.986-8.203 11.392-7.672 22.011.167 3.349 2.284 15.285 5.906 27.149 4.194 13.742 8.967 22.413 13.096 23.79.648.216 2.62.873 5.439-2.517A245.272 245.272 0 0145.88 73.046a1.596 1.596 0 012.304 2.208c-.048.05-4.847 5.067-10.077 11.359-2.477 2.979-4.851 3.853-6.786 3.853z" />
    </svg>

    <!-- 14. MongoDB (Official Green Leaf) -->
    <svg
      v-else-if="techId === 'mongodb'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#47A248" :d="siMongodb.path" />
    </svg>

    <!-- 15. MySQL (Official Sakila Dolphin) -->
    <svg
      v-else-if="techId === 'mysql'"
      viewBox="0 0 128 128"
      class="w-full h-full"
    >
      <path
        fill="#00758F"
        d="M117.688 98.242c-6.973-.191-12.297.461-16.852 2.379-1.293.547-3.355.559-3.566 2.18.711.746.82 1.859 1.387 2.777 1.086 1.754 2.922 4.113 4.559 5.352 1.789 1.348 3.633 2.793 5.551 3.961 3.414 2.082 7.223 3.27 10.504 5.352 1.938 1.23 3.859 2.777 5.75 4.164.934.684 1.563 1.75 2.773 2.18v-.195c-.637-.812-.801-1.93-1.387-2.777l-2.578-2.578c-2.52-3.344-5.719-6.281-9.117-8.719-2.711-1.949-8.781-4.578-9.91-7.73l-.199-.199c1.922-.219 4.172-.914 5.949-1.391 2.98-.797 5.645-.59 8.719-1.387l4.164-1.187v-.793c-1.555-1.594-2.664-3.707-4.359-5.152-4.441-3.781-9.285-7.555-14.273-10.703-2.766-1.746-6.184-2.883-9.117-4.363-.988-.496-2.719-.758-3.371-1.586-1.539-1.961-2.379-4.449-3.566-6.738-2.488-4.793-4.93-10.023-7.137-15.066-1.504-3.437-2.484-6.828-4.359-9.91-9-14.797-18.687-23.73-33.695-32.508-3.195-1.867-7.039-2.605-11.102-3.57l-6.543-.395c-1.332-.555-2.715-2.184-3.965-2.977C16.977 3.52 4.223-3.312.539 5.672-1.785 11.34 4.016 16.871 6.09 19.746c1.457 2.012 3.32 4.273 4.359 6.539.688 1.492.805 2.984 1.391 4.559 1.438 3.883 2.695 8.109 4.559 11.695.941 1.816 1.98 3.727 3.172 5.352.727.996 1.98 1.438 2.18 2.973-1.227 1.715-1.297 4.375-1.984 6.543-3.098 9.77-1.926 21.91 2.578 29.137 1.383 2.223 4.641 6.98 9.117 5.156 3.918-1.598 3.043-6.539 4.164-10.902.254-.988.098-1.715.594-2.379v.199l3.57 7.133c2.641 4.254 7.324 8.699 11.297 11.699 2.059 1.555 3.68 4.242 6.344 5.152v-.199h-.199c-.516-.805-1.324-1.137-1.98-1.781-1.551-1.523-3.277-3.414-4.559-5.156-3.613-4.902-6.805-10.27-9.711-15.855-1.391-2.668-2.598-5.609-3.77-8.324-.453-1.047-.445-2.633-1.387-3.172-1.281 1.988-3.172 3.598-4.164 5.945-1.582 3.754-1.789 8.336-2.375 13.082-.348.125-.195.039-.398.199-2.762-.668-3.73-3.508-4.758-5.949-2.594-6.164-3.078-16.09-.793-23.191.59-1.836 3.262-7.617 2.18-9.316-.516-1.691-2.219-2.672-3.172-3.965-1.18-1.598-2.355-3.703-3.172-5.551-2.125-4.805-3.113-10.203-5.352-15.062-1.07-2.324-2.875-4.676-4.359-6.738-1.645-2.289-3.484-3.977-4.758-6.742-.453-.984-1.066-2.559-.398-3.566.215-.684.516-.969 1.191-1.191 1.148-.887 4.352.297 5.547.793 3.18 1.32 5.832 2.578 8.527 4.363 1.289.855 2.598 2.512 4.16 2.973h1.785c2.789.641 5.914.195 8.523.988 4.609 1.402 8.738 3.582 12.488 5.949 11.422 7.215 20.766 17.48 27.156 29.734 1.027 1.973 1.473 3.852 2.379 5.945 1.824 4.219 4.125 8.559 5.941 12.688 1.816 4.113 3.582 8.27 6.148 11.695 1.348 1.801 6.551 2.766 8.918 3.766 1.66.699 4.379 1.43 5.949 2.379 3 1.809 5.906 3.965 8.723 5.945 1.402.992 5.73 3.168 5.945 4.957zm-88.605-75.52c-1.453-.027-2.48.156-3.566.395v.199h.195c.695 1.422 1.918 2.34 2.777 3.566l1.98 4.164.199-.195c1.227-.867 1.789-2.25 1.781-4.363-.492-.52-.562-1.164-.992-1.785-.562-.824-1.66-1.289-2.375-1.98zm0 0"
      />
    </svg>

    <!-- 16. Redis (Official Red Stacked Layers) -->
    <svg
      v-else-if="techId === 'redis'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#DC382D" :d="siRedis.path" />
    </svg>

    <!-- 17. Database Migrations (Neutral Concept: Dual DB Sync / Migration Arrows) -->
    <svg
      v-else-if="techId === 'database-migrations'"
      viewBox="0 0 24 24"
      class="w-full h-full"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <ellipse cx="12" cy="5" rx="8" ry="3" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.6" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="#0284C7" stroke-width="1.6" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="#0284C7" stroke-width="1.6" />
      <path d="M12 9l2 2-2 2M14 11H9" stroke="#6366F1" stroke-width="2" />
    </svg>

    <!-- 18. Prisma ORM (Official Isometric Prism) -->
    <svg
      v-else-if="techId === 'prisma'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#2D3748" :d="siPrisma.path" />
    </svg>

    <!-- 19. Git & GitHub (Dual Official Brands Side-by-Side) -->
    <div
      v-else-if="techId === 'git-github'"
      class="flex items-center justify-center gap-1 w-full h-full"
    >
      <!-- Git Branch Diamond -->
      <svg viewBox="0 0 24 24" class="w-1/2 h-full">
        <path fill="#F05032" :d="siGit.path" />
      </svg>
      <!-- GitHub Octocat Mark -->
      <svg viewBox="0 0 24 24" class="w-1/2 h-full">
        <path fill="#181717" :d="siGithub.path" />
      </svg>
    </div>

    <!-- 19b. Git Single -->
    <svg
      v-else-if="techId === 'git'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#F05032" :d="siGit.path" />
    </svg>

    <!-- 19c. GitHub Single -->
    <svg
      v-else-if="techId === 'github'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#181717" :d="siGithub.path" />
    </svg>

    <!-- 20. Docker (Official Shipping Whale) -->
    <svg
      v-else-if="techId === 'docker'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#2496ED" :d="siDocker.path" />
    </svg>

    <!-- 21. Vite (Official Gradient Shield + Bolt) -->
    <svg
      v-else-if="techId === 'vite'"
      viewBox="0 0 410 404"
      class="w-full h-full"
    >
      <path
        fill="url(#vite-grad-shield)"
        d="M399.6 59.4L215.7 388.7c-3.6 6.5-12.9 6.6-16.7.2L6.8 59.4c-4.4-7.4 1.3-16.7 9.8-16.1l185.3 12.6c1.6.1 3.2-.5 4.3-1.6l176.4-53.1c8.4-2.5 16 4.9 13.8 13.4l.2 4.8z"
      />
      <path
        fill="url(#vite-grad-bolt)"
        d="M283.8 24.3L146.4 75.9c-2.2.8-3.4 3.1-2.9 5.3l15.9 74.3c.5 2.3 2.9 3.6 5 2.8l38.8-14.6c2.4-.9 4.9 1 4.5 3.6l-10.3 64.9c-.4 2.7 2.4 4.8 4.8 3.6l101.4-51.1c2.5-1.3 2.8-4.7.7-6.4l-37-29.2c-2.1-1.7-1.7-5.1.7-6.2l34.4-15.6c2.5-1.1 3-4.5.9-6.3L283.8 24.3z"
      />
      <defs>
        <linearGradient id="vite-grad-shield" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
          <stop stop-color="#41D1FF" />
          <stop offset="1" stop-color="#BD34FE" />
        </linearGradient>
        <linearGradient id="vite-grad-bolt" x1="150" y1="20" x2="280" y2="220" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFEA83" />
          <stop offset=".08" stop-color="#FFDD35" />
          <stop offset="1" stop-color="#FFA800" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 22. Postman (Official Flying Spaceman) -->
    <svg
      v-else-if="techId === 'postman'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#FF6C37" :d="siPostman.path" />
    </svg>

    <!-- 23. Visual Studio Code (Official Microsoft Multi-Tone Folded Ribbon) -->
    <svg
      v-else-if="techId === 'vscode'"
      viewBox="0 0 100 100"
      class="w-full h-full"
    >
      <path
        d="M96.46 10.8L75.86.88C73.47-.27 70.62.21 68.75 2.08L1.3 63.58c-1.81 1.65-1.81 4.51 0 6.16l5.51 5.01c1.49 1.35 3.72 1.45 5.32.24L93.36 13.37c2.73-2.07 6.64-.12 6.64 3.3V16.43c0-2.4-1.38-4.59-3.54-5.63z"
        fill="#0065A9"
      />
      <path
        d="M96.46 89.2L75.86 99.12c-2.38 1.15-5.23.67-7.11-1.2L1.3 36.42c-1.81-1.65-1.81-4.51 0-6.16l5.51-5.01c1.49-1.35 3.72-1.45 5.32-.24L93.36 86.63c2.73 2.07 6.64.12 6.64-3.3V83.57c0 2.4-1.38 4.59-3.54 5.63z"
        fill="#007ACC"
      />
      <path
        d="M75.86 99.13c-2.39 1.15-5.24.66-7.11-1.21 2.31 2.31 6.25.67 6.25-2.59V4.67c0-3.26-3.94-4.89-6.25-2.59 1.87-1.87 4.72-2.36 7.11-1.21l20.6 9.91c2.16 1.04 3.54 3.23 3.54 5.63v67.18c0 2.4-1.38 4.59-3.54 5.63l-20.6 9.91z"
        fill="#1F9CF0"
      />
    </svg>

    <!-- 24. Linux / Bash (Dual Official Marks: Linux Tux + GNU Bash Terminal Box) -->
    <div
      v-else-if="techId === 'linux-bash'"
      class="flex items-center justify-center gap-1 w-full h-full"
    >
      <!-- Linux Tux -->
      <svg viewBox="0 0 24 24" class="w-1/2 h-full">
        <path fill="#FCC624" :d="siLinux.path" />
      </svg>
      <!-- GNU Bash -->
      <svg viewBox="0 0 24 24" class="w-1/2 h-full">
        <path fill="#4EAA25" :d="siGnubash.path" />
      </svg>
    </div>

    <!-- 24b. Linux Single -->
    <svg
      v-else-if="techId === 'linux'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#FCC624" :d="siLinux.path" />
    </svg>

    <!-- 24c. Bash Single -->
    <svg
      v-else-if="techId === 'bash'"
      viewBox="0 0 24 24"
      class="w-full h-full"
    >
      <path fill="#4EAA25" :d="siGnubash.path" />
    </svg>

    <!-- 25. Fallback Semantic Technical Symbol (Never fake an unrelated brand) -->
    <svg
      v-else
      viewBox="0 0 24 24"
      class="w-full h-full text-slate-500"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.6" />
      <path d="M8 10l-2 2 2 2" stroke="#64748B" stroke-width="2" />
      <path d="M16 10l2 2-2 2" stroke="#64748B" stroke-width="2" />
      <path d="M13 8l-2 8" stroke="#94A3B8" stroke-width="1.8" />
    </svg>
  </div>
</template>
