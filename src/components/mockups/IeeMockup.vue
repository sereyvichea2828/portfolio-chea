<script setup lang="ts">
import { Cpu, Fingerprint, Lock } from 'lucide-vue-next';
</script>

<template>
  <div
    class="w-full h-full bg-slate-950 text-slate-100 p-3 select-none flex flex-col font-sans text-xs box-border overflow-hidden"
  >
    <!-- Compact Header: Access Control & Status -->
    <div
      class="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800/80 gap-2 shrink-0"
    >
      <div class="flex items-center gap-2 min-w-0">
        <div
          class="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0"
        >
          <Cpu class="w-3.5 h-3.5" />
        </div>
        <div class="min-w-0">
          <span class="font-bold text-white text-xs tracking-tight block">Access Control</span>
          <span class="text-slate-400 text-xs block leading-none">Hardware Bridge</span>
        </div>
      </div>

      <span
        class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs shrink-0 whitespace-nowrap"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span class="font-mono text-xs">ONLINE</span>
      </span>
    </div>

    <!-- 2 Balanced Miniature Panels: Hardware vs Security -->
    <div class="grid grid-cols-2 gap-2.5 flex-1 min-h-0">
      <!-- Panel 1: Hardware Status Panel -->
      <div
        class="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between min-w-0 shadow-lg shadow-black/20"
      >
        <div class="flex items-center justify-between min-w-0 gap-1">
          <span
            class="text-xs text-slate-300 font-semibold uppercase tracking-wider whitespace-nowrap"
          >
            HARDWARE
          </span>
          <span
            class="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap"
          >
            9600 BAUD
          </span>
        </div>

        <div class="space-y-2 my-auto min-w-0 py-1.5 font-mono text-xs">
          <div
            class="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800/60 min-w-0 gap-1"
          >
            <span class="text-xs text-slate-300 font-sans font-medium">Primary</span>
            <span class="text-xs font-bold text-white shrink-0">Uno R3</span>
          </div>
          <div
            class="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800/60 min-w-0 gap-1"
          >
            <span class="text-xs text-slate-300 font-sans font-medium">Bridge</span>
            <span class="text-xs font-bold text-indigo-300 shrink-0">Nano</span>
          </div>
        </div>

        <div
          class="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/60 min-w-0 gap-1"
        >
          <span class="text-slate-300 font-medium">Latency</span>
          <span class="font-mono text-emerald-400 font-semibold shrink-0">&lt; 8ms</span>
        </div>
      </div>

      <!-- Panel 2: Security & Multi-Factor Auth Panel -->
      <div
        class="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between min-w-0 shadow-lg shadow-black/20"
      >
        <div class="flex items-center justify-between min-w-0 gap-1">
          <span
            class="text-xs text-slate-300 font-semibold uppercase tracking-wider whitespace-nowrap"
          >
            DOOR LOCK
          </span>
          <span
            class="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap"
          >
            <Lock class="w-3 h-3 text-emerald-400 shrink-0" />
            <span>LOCKED</span>
          </span>
        </div>

        <!-- Biometric Status & RFID Indicator -->
        <div class="space-y-2 my-auto min-w-0 py-1.5 text-xs">
          <div
            class="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800/60 min-w-0 gap-1"
          >
            <div class="flex items-center gap-1.5 text-slate-200 font-medium truncate">
              <Fingerprint class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Biometric</span>
            </div>
            <span class="font-mono text-emerald-400 font-bold shrink-0">PASSED</span>
          </div>

          <div
            class="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800/60 min-w-0 gap-1"
          >
            <span class="text-slate-200 font-medium truncate">RFID Card</span>
            <span class="font-mono text-purple-300 font-bold shrink-0">VERIFIED</span>
          </div>
        </div>

        <div
          class="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/60 min-w-0 gap-1"
        >
          <span class="text-slate-300 font-medium">Actuator</span>
          <span class="font-mono text-slate-300 font-semibold shrink-0">Servo 0°</span>
        </div>
      </div>
    </div>
  </div>
</template>
