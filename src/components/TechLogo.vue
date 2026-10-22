<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  sizeClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  sizeClass: 'w-6 h-6',
})

const normalizedName = computed<string>(() => {
  const n = props.name.toLowerCase().trim()
  if (n.includes('vue')) return 'vue'
  if (n.includes('typescript') || n === 'ts') return 'typescript'
  if (n.includes('javascript') || n === 'js') return 'javascript'
  if (n.includes('tailwind')) return 'tailwind'
  if (n.includes('node')) return 'node'
  if (n.includes('express')) return 'express'
  if (n.includes('vite')) return 'vite'
  if (n.includes('three')) return 'three'
  if (n.includes('postgres')) return 'postgresql'
  if (n.includes('mongo')) return 'mongodb'
  if (n.includes('mysql')) return 'mysql'
  if (n.includes('redis')) return 'redis'
  if (n.includes('docker')) return 'docker'
  if (n.includes('github')) return 'github'
  if (n.includes('git')) return 'git'
  if (n.includes('html')) return 'html5'
  if (n.includes('css')) return 'css3'
  if (n.includes('rest') || n.includes('api')) return 'rest'
  return 'generic'
})
</script>

<template>
  <div :class="[sizeClass, 'inline-flex items-center justify-center shrink-0 select-none']" aria-hidden="true">
    <!-- Vue.js -->
    <svg v-if="normalizedName === 'vue'" viewBox="0 0 256 221" class="w-full h-full">
      <path fill="#42B883" d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36z" />
      <path fill="#35495E" d="M0 0l128 220.8L256 0h-51.2L128 132.48 49.92 0H0z" />
    </svg>

    <!-- TypeScript -->
    <svg v-else-if="normalizedName === 'typescript'" viewBox="0 0 128 128" class="w-full h-full rounded-md overflow-hidden">
      <rect width="128" height="128" fill="#3178C6" rx="16" />
      <path fill="#FFF" d="M68.5 86.8c1.8 3.1 4.7 5.2 8.7 5.2 4.1 0 6.7-2 6.7-4.8 0-3.3-2.6-4.5-8.5-7.1-8.5-3.6-14-7.4-14-16.7 0-9.2 7.1-16.2 18.2-16.2 7.8 0 13.5 2.8 17.4 9.6l-8.5 5.4c-2.1-3.6-4.7-4.9-8.7-4.9-3.9 0-6.1 1.9-6.1 4.4 0 2.9 2.4 4.1 8 6.5 9.4 4 14.7 7.7 14.7 17.3 0 10.7-8.3 17-19.3 17-9.4 0-16.2-3.8-20.1-10.7l8.7-5zm-39.7 19.4V58.7H13.6v-10h41.4v10H39.8v47.5h-11z" />
    </svg>

    <!-- Tailwind CSS -->
    <svg v-else-if="normalizedName === 'tailwind'" viewBox="0 0 54 33" class="w-full h-full">
      <path
        fill="#06B6D4"
        fill-rule="evenodd"
        d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.005-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
      />
    </svg>

    <!-- JavaScript -->
    <svg v-else-if="normalizedName === 'javascript'" viewBox="0 0 128 128" class="w-full h-full rounded-md overflow-hidden">
      <rect width="128" height="128" fill="#F7DF1E" rx="16" />
      <path fill="#000" d="M67.3 100c0 9-5.3 13.3-13.2 13.3-6.5 0-10.3-3.2-12.7-7.6l8.8-5.3c1.4 2.4 2.8 4.2 5.1 4.2 2.4 0 3.7-1 3.7-4.7V57.6h8.3V100zm23.6-3.8c3.2 5.5 7.6 9.1 14.8 9.1 6.2 0 10.2-3.1 10.2-7.3 0-5.1-4.1-6.9-10.9-9.9-9.9-4.3-16.3-9.7-16.3-20.9 0-10.4 8.1-18.4 20.9-18.4 9 0 15.4 3.2 19.9 11.2l-8.5 5.5c-2.4-4.2-5.1-6-11.4-6-4.5 0-7.3 2.1-7.3 5.3 0 3.8 2.6 5.3 8.7 8 11.4 4.9 18.5 9.8 18.5 21.6 0 12.3-9.7 19-22.7 19-12.6 0-20.3-5.9-24.5-14.8l8.6-5.4z" />
    </svg>

    <!-- Node.js -->
    <svg v-else-if="normalizedName === 'node'" viewBox="0 0 128 128" class="w-full h-full">
      <path fill="#5FA04E" d="M64 12.5L13.8 41.5v58L64 128.5l50.2-29V41.5L64 12.5zm0 13.6l37.2 21.5v42.9L64 112 26.8 90.5V47.6L64 26.1z" />
      <path fill="#5FA04E" d="M64 36.3L36 52.5v32.5L64 101.2l28-16.2V52.5L64 36.3z" />
    </svg>

    <!-- Vite -->
    <svg v-else-if="normalizedName === 'vite'" viewBox="0 0 410 404" class="w-full h-full">
      <path fill="url(#vite-a)" d="M399.6 59.4L215.7 388.7c-3.6 6.5-12.9 6.6-16.7.2L6.8 59.4c-4.4-7.4 1.3-16.7 9.8-16.1l185.3 12.6c1.6.1 3.2-.5 4.3-1.6l176.4-53.1c8.4-2.5 16 4.9 13.8 13.4l.2 4.8z" />
      <path fill="url(#vite-b)" d="M283.8 24.3L146.4 75.9c-2.2.8-3.4 3.1-2.9 5.3l15.9 74.3c.5 2.3 2.9 3.6 5 2.8l38.8-14.6c2.4-.9 4.9 1 4.5 3.6l-10.3 64.9c-.4 2.7 2.4 4.8 4.8 3.6l101.4-51.1c2.5-1.3 2.8-4.7.7-6.4l-37-29.2c-2.1-1.7-1.7-5.1.7-6.2l34.4-15.6c2.5-1.1 3-4.5.9-6.3L283.8 24.3z" />
      <defs>
        <linearGradient id="vite-a" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
          <stop stop-color="#41D1FF" />
          <stop offset="1" stop-color="#BD34FE" />
        </linearGradient>
        <linearGradient id="vite-b" x1="150" y1="20" x2="280" y2="220" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFEA83" />
          <stop offset=".08" stop-color="#FFDD35" />
          <stop offset="1" stop-color="#FFA800" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Three.js -->
    <svg v-else-if="normalizedName === 'three'" viewBox="0 0 128 128" class="w-full h-full">
      <path fill="#151827" d="M64 8l54 94H10L64 8zm0 27L28 90h72L64 35z" />
      <path fill="#9B87F5" d="M64 42l24 42H40l24-42z" />
    </svg>

    <!-- PostgreSQL -->
    <svg v-else-if="normalizedName === 'postgresql'" viewBox="0 0 128 128" class="w-full h-full">
      <path
        fill="#4169E1"
        d="M64.7 14c-19.8 0-33.8 13.4-36.5 26.6-4.5 2.5-8.8 6.5-10.4 12.3-2.6 9.4 1.4 17.6 6.5 23.3 1.2 11.8 11.2 31.7 29.8 37.8-1.5-6.8-2.3-15.4-2.1-23.7 3.3.6 6.7.9 10.2.9 4.3 0 8.5-.5 12.5-1.4.3 8.3-.4 16.9-1.9 23.7 18.6-6.1 28.6-26 29.8-37.8 5.1-5.7 9.1-13.9 6.5-23.3-1.6-5.8-5.9-9.8-10.4-12.3C86.5 27.4 72.5 14 64.7 14z"
      />
    </svg>

    <!-- MongoDB -->
    <svg v-else-if="normalizedName === 'mongodb'" viewBox="0 0 128 128" class="w-full h-full">
      <path
        fill="#47A248"
        d="M64 12C62 14 42 39 42 66c0 19 14 36 22 50 8-14 22-31 22-50 0-27-20-52-22-54zm0 88c-1.3 0-2.3-.9-2.6-2.2C59 87 52 76 52 66c0-18 10-34 12-40 2 6 12 22 12 40 0 10-7 21-9.4 31.8-.3 1.3-1.3 2.2-2.6 2.2z"
      />
    </svg>

    <!-- MySQL -->
    <svg v-else-if="normalizedName === 'mysql'" viewBox="0 0 128 128" class="w-full h-full">
      <path fill="#00758F" d="M64 16C37.5 16 16 37.5 16 64s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48zm-8 72c-13.3 0-24-10.7-24-24s10.7-24 24-24c6.6 0 12.6 2.7 17 7l-7 7c-2.6-2.6-6.1-4-10-4-7.7 0-14 6.3-14 14s6.3 14 14 14c4 0 7.5-1.7 10-4.3l7 7c-4.4 4.5-10.4 7.3-17 7.3zm32 0h-10V44h10v44z" />
    </svg>

    <!-- Redis -->
    <svg v-else-if="normalizedName === 'redis'" viewBox="0 0 128 128" class="w-full h-full">
      <path fill="#DC382D" d="M64 12L12 40l52 28 52-28-52-28zm0 40L12 80l52 28 52-28-52-28zm0 24L28 92l36 20 36-20-36-16z" />
    </svg>

    <!-- Docker -->
    <svg v-else-if="normalizedName === 'docker'" viewBox="0 0 128 128" class="w-full h-full">
      <path
        fill="#2496ED"
        d="M123.6 57.3c-1.4-.9-6.4-3.4-14.8-1.5-.7-4.9-3.9-9.3-8.8-12-1-.6-2-.3-2.5.6-.5.9-.2 2 .7 2.6 6.3 3.9 8.2 10.6 7.2 15.3-2.6 1.7-8.1 4.5-16.9 4.8H5.8c-2.4 0-4.3 1.9-4.3 4.3 0 20.3 12.5 37.4 39.4 37.4 34.6 0 54.4-17.7 60.8-37.8 8.6-.7 18.6-6.3 22.8-10.9.8-.9.4-2.1-.9-2.8zM24.7 42.2h12v12h-12zm15 0h12v12h-12zm15 0h12v12h-12zm15 0h12v12h-12zm-30-15h12v12h-12zm15 0h12v12h-12zm15 0h12v12h-12zm-15-15h12v12h-12z"
      />
    </svg>

    <!-- Git -->
    <svg v-else-if="normalizedName === 'git'" viewBox="0 0 128 128" class="w-full h-full">
      <path
        fill="#F05032"
        d="M125.7 57.8L70.2 2.3c-3.1-3.1-8.1-3.1-11.2 0L42.5 18.8l14.2 14.2c3.3-1.1 7.2-.4 9.8 2.3 2.7 2.7 3.4 6.6 2.3 9.9l13.7 13.7c3.3-1.1 7.2-.4 9.9 2.3 3.8 3.8 3.8 10 0 13.8-3.8 3.8-10 3.8-13.8 0-2.8-2.8-3.5-6.9-2.1-10.3L63.5 51.7v32.5c.8.4 1.5.9 2.2 1.6 3.8 3.8 3.8 10 0 13.8-3.8 3.8-10 3.8-13.8 0-3.8-3.8-3.8-10 0-13.8.9-.9 1.9-1.6 3.1-2.1V50.8c-1.2-.5-2.2-1.2-3.1-2.1-2.8-2.8-3.5-7-2-10.4L35.8 24.2 2.3 57.8c-3.1 3.1-3.1 8.1 0 11.2l55.5 55.5c3.1 3.1 8.1 3.1 11.2 0l56.7-56.7c3.1-3.1 3.1-8.1 0-11.2z"
      />
    </svg>

    <!-- GitHub -->
    <svg v-else-if="normalizedName === 'github'" viewBox="0 0 128 128" class="w-full h-full">
      <path
        fill="#181717"
        fill-rule="evenodd"
        d="M64 5.3C29.6 5.3 1.7 33.2 1.7 67.7c0 27.6 17.9 51 42.7 59.2 3.1.6 4.2-1.3 4.2-3 0-1.5-.1-6.4-.1-11.6-17.3 3.8-21-7.4-21-7.4-2.8-7.2-6.9-9.1-6.9-9.1-5.7-3.9.4-3.8.4-3.8 6.3.4 9.6 6.4 9.6 6.4 5.6 9.5 14.6 6.8 18.1 5.2.6-4 2.2-6.8 4-8.3-13.8-1.6-28.4-6.9-28.4-30.8 0-6.8 2.4-12.4 6.4-16.7-.6-1.6-2.8-7.9.6-16.5 0 0 5.2-1.7 17.1 6.4 5-1.4 10.3-2.1 15.6-2.1 5.3 0 10.6.7 15.6 2.1 11.9-8.1 17.1-6.4 17.1-6.4 3.4 8.6 1.2 14.9.6 16.5 4 4.3 6.4 9.9 6.4 16.7 0 24-14.6 29.2-28.5 30.7 2.2 1.9 4.3 5.7 4.3 11.6 0 8.4-.1 15.1-.1 17.2 0 1.7 1.1 3.7 4.3 3 24.8-8.3 42.6-31.7 42.6-59.2C126.3 33.2 98.4 5.3 64 5.3z"
      />
    </svg>

    <!-- Express.js -->
    <svg v-else-if="normalizedName === 'express'" viewBox="0 0 128 128" class="w-full h-full">
      <path fill="#151827" d="M24 72l8-24h10l-12 36h-8l-8-24h10zm36-24c6 0 10 4 10 10s-4 10-10 10h-6v14h-8V48h14zm-6 14h6c2.5 0 4-1.5 4-4s-1.5-4-4-4h-6v8zm32 10c0 7 5 12 12 12 5 0 9-3 11-7l-6-3c-1 2-3 3-5 3-3 0-5-2-5-5h23c.3-1 .5-2 .5-3 0-7-5-12-12-12s-12 5-12 12zm12-6c3 0 5 2 5 5h-10c0-3 2-5 5-5z" />
    </svg>

    <!-- HTML5 -->
    <svg v-else-if="normalizedName === 'html5'" viewBox="0 0 128 128" class="w-full h-full">
      <path fill="#E34F26" d="M19 116L9 4h110l-10 112-45 12z" />
      <path fill="#EF652A" d="M64 118l37-10 8-94H64z" />
      <path fill="#ECECEC" d="M64 48H44l-2-20h44l2-20H22l5 60h37zm0 43l-20-5-1-15H23l2 25 39 11z" />
      <path fill="#FFF" d="M64 48h20l-2 20H64v20l19-5 2-19h20l-3 34-38 10z" />
    </svg>

    <!-- CSS3 -->
    <svg v-else-if="normalizedName === 'css3'" viewBox="0 0 128 128" class="w-full h-full">
      <path fill="#1572B6" d="M19 116L9 4h110l-10 112-45 12z" />
      <path fill="#33A9DC" d="M64 118l37-10 8-94H64z" />
      <path fill="#ECECEC" d="M64 48H44l-2-20h44l2-20H22l5 60h37zm0 43l-20-5-1-15H23l2 25 39 11z" />
      <path fill="#FFF" d="M64 48h20l-2 20H64v20l19-5 2-19h20l-3 34-38 10z" />
    </svg>

    <!-- REST APIs / Network -->
    <svg v-else viewBox="0 0 128 128" class="w-full h-full">
      <circle cx="36" cy="64" r="16" fill="#8B5CF6" />
      <circle cx="92" cy="40" r="14" fill="#38BDF8" />
      <circle cx="92" cy="88" r="14" fill="#10B981" />
      <path stroke="#8B5CF6" stroke-width="6" stroke-linecap="round" d="M52 64h26m-6-16l14-8m-14 32l14 8" />
    </svg>
  </div>
</template>
