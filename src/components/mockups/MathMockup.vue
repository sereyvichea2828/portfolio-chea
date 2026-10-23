<script setup lang="ts">
import { Sigma } from 'lucide-vue-next';
</script>

<template>
  <div
    class="w-full h-full bg-slate-950 text-slate-100 p-3 select-none flex flex-col font-sans text-xs box-border overflow-hidden"
  >
    <!-- Compact Header: Linear Solver & Status -->
    <div
      class="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800/80 gap-2 shrink-0"
    >
      <div class="flex items-center gap-2 min-w-0">
        <div
          class="w-6 h-6 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0"
        >
          <Sigma class="w-3.5 h-3.5" />
        </div>
        <div class="min-w-0">
          <span class="font-bold text-white text-xs tracking-tight block">Linear Solver</span>
          <span class="text-slate-400 text-xs block leading-none">Gauss-Jordan</span>
        </div>
      </div>

      <span
        class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold text-xs shrink-0 whitespace-nowrap"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span class="font-mono text-xs">CONVERGED</span>
      </span>
    </div>

    <!-- 2 Balanced Miniature Panels -->
    <div class="grid grid-cols-2 gap-2.5 flex-1 min-h-0">
      <!-- Panel 1: Clearly Labeled Matrix Panel -->
      <div
        class="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between min-w-0 shadow-lg shadow-black/20"
      >
        <div class="flex items-center justify-between min-w-0 gap-1">
          <span class="text-xs text-slate-300 font-semibold uppercase tracking-wider whitespace-nowrap">
            MATRIX [A|b]
          </span>
          <span
            class="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap"
          >
            ECHELON
          </span>
        </div>

        <div class="space-y-2 my-auto min-w-0 py-1.5 font-mono text-xs">
          <div
            class="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800/60 min-w-0"
          >
            <span class="text-white font-bold tracking-tight">1.0 0.0</span>
            <span class="text-emerald-400 font-bold shrink-0 ml-1">20.0</span>
          </div>
          <div
            class="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800/60 min-w-0"
          >
            <span class="text-white font-bold tracking-tight">0.0 1.0</span>
            <span class="text-cyan-400 font-bold shrink-0 ml-1">15.0</span>
          </div>
        </div>

        <div
          class="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/60 min-w-0 gap-1"
        >
          <span class="text-slate-300 font-medium">LU Pivot</span>
          <span class="font-mono text-cyan-400 font-semibold shrink-0">RANK 3</span>
        </div>
      </div>

      <!-- Panel 2: Separate Solution Panel -->
      <div
        class="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between min-w-0 shadow-lg shadow-black/20"
      >
        <div class="flex items-center justify-between min-w-0 gap-1">
          <span class="text-xs text-slate-300 font-semibold uppercase tracking-wider whitespace-nowrap">
            SOLUTION
          </span>
          <span
            class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap"
          >
            OPTIMAL
          </span>
        </div>

        <!-- Numerical Result & Tolerance -->
        <div class="my-auto min-w-0 py-1.5 space-y-2">
          <div
            class="bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800/60 flex items-center justify-between min-w-0 gap-1"
          >
            <span class="text-xs text-slate-300 font-medium">Vector</span>
            <span class="font-mono text-xs font-bold text-purple-300 shrink-0">[20, 15, 25]</span>
          </div>

          <div
            class="bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800/60 flex items-center justify-between min-w-0 gap-1"
          >
            <span class="text-xs text-slate-300 font-medium">Residual</span>
            <span class="font-mono text-xs font-bold text-emerald-400 shrink-0">&lt; 1e-10</span>
          </div>
        </div>

        <div
          class="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/60 min-w-0 gap-1"
        >
          <span class="text-slate-300 font-medium whitespace-nowrap">Method</span>
          <span class="font-mono text-purple-300 font-semibold shrink-0 whitespace-nowrap">AᵀAx=Aᵀb</span>
        </div>
      </div>
    </div>
  </div>
</template>
