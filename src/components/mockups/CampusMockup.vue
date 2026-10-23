<script setup lang="ts">
import { GraduationCap, MapPin, CheckCircle2 } from 'lucide-vue-next';
</script>

<template>
  <div
    class="w-full h-full bg-slate-950 text-slate-100 p-3 select-none flex flex-col font-sans text-xs box-border overflow-hidden"
  >
    <!-- Compact Header: ITE A3 & Attendance -->
    <div
      class="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800/80 gap-2 shrink-0"
    >
      <div class="flex items-center gap-2 min-w-0">
        <div
          class="w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0"
        >
          <GraduationCap class="w-3.5 h-3.5" />
        </div>
        <div class="min-w-0">
          <span class="font-bold text-white text-xs tracking-tight block">ITE A3</span>
          <span class="text-slate-400 text-xs block leading-none">Attendance</span>
        </div>
      </div>

      <span
        class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs shrink-0 whitespace-nowrap"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span class="font-mono text-xs">LIVE</span>
      </span>
    </div>

    <!-- 2 Balanced Miniature Panels -->
    <div class="grid grid-cols-2 gap-2.5 flex-1 min-h-0">
      <!-- Panel 1: Attendance Statistic & Geofence -->
      <div
        class="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between min-w-0 shadow-lg shadow-black/20"
      >
        <div class="flex items-center justify-between min-w-0 gap-1">
          <span class="text-xs text-slate-300 font-semibold uppercase tracking-wider whitespace-nowrap">
            ATTENDANCE
          </span>
          <span
            class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap"
          >
            95.5%
          </span>
        </div>

        <div class="my-auto min-w-0 py-1">
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-black text-white tracking-tight leading-none">42</span>
            <span class="text-xs font-bold text-purple-400">/ 44</span>
            <span class="text-xs text-slate-400 font-medium ml-auto">Present</span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
            <div
              class="h-full bg-linear-to-r from-purple-500 to-emerald-400 rounded-full"
              style="width: 95.5%"
            />
          </div>
        </div>

        <div
          class="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/60 min-w-0 gap-1"
        >
          <div class="flex items-center gap-1 min-w-0">
            <MapPin class="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span class="text-slate-300 font-medium">Geofence</span>
          </div>
          <span class="font-mono text-cyan-400 font-semibold shrink-0">±50m GPS</span>
        </div>
      </div>

      <!-- Panel 2: QR Attendance & Student Check-ins -->
      <div
        class="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between min-w-0 shadow-lg shadow-black/20"
      >
        <div class="flex items-center justify-between min-w-0 gap-1">
          <span class="text-xs text-slate-300 font-semibold uppercase tracking-wider whitespace-nowrap">
            QR TOKEN
          </span>
          <span
            class="text-xs font-mono font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap"
          >
            15s
          </span>
        </div>

        <!-- Student Check-in Status Area -->
        <div class="space-y-2 my-auto min-w-0 py-1.5">
          <div
            class="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800/60 min-w-0 gap-1"
          >
            <span class="text-slate-200 font-medium truncate">Dara K.</span>
            <span class="inline-flex items-center gap-1 text-emerald-400 font-semibold shrink-0">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span class="text-xs">OK</span>
            </span>
          </div>

          <div
            class="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800/60 min-w-0 gap-1"
          >
            <span class="text-slate-200 font-medium truncate">Socheat P.</span>
            <span class="inline-flex items-center gap-1 text-emerald-400 font-semibold shrink-0">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span class="text-xs">OK</span>
            </span>
          </div>
        </div>

        <div
          class="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/60 min-w-0 gap-1"
        >
          <span class="text-slate-300 font-medium">Security</span>
          <span class="font-mono text-emerald-400 font-semibold shrink-0">VERIFIED</span>
        </div>
      </div>
    </div>
  </div>
</template>
