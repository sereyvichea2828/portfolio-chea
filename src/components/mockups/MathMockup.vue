<script setup lang="ts">
import { Sigma, CheckCircle2, Play, RefreshCw } from 'lucide-vue-next';
</script>

<template>
  <div
    class="w-full h-full bg-slate-950 text-slate-100 p-2.5 sm:p-3.5 select-none flex flex-col font-sans text-xs box-border overflow-hidden justify-between"
  >
    <!-- 1. Authentic Scientific Solver Header -->
    <div class="flex items-center justify-between pb-2 border-b border-slate-800/80 gap-2 shrink-0">
      <div class="flex items-center gap-2 min-w-0">
        <div
          class="w-6 h-6 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 font-mono font-bold"
        >
          <Sigma class="w-3.5 h-3.5" />
        </div>
        <div class="flex items-center gap-2 min-w-0">
          <span class="font-bold text-white text-xs tracking-tight">Linear Systems Optimizer</span>
          <span class="text-slate-500 text-xs hidden sm:inline">/</span>
          <span class="text-slate-400 text-xs truncate hidden sm:inline"
            >Healthcare Allocation</span
          >
        </div>
      </div>

      <!-- Solver Controls & Method -->
      <div class="flex items-center gap-2 shrink-0">
        <div
          class="hidden sm:flex items-center gap-1 font-mono text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded"
        >
          <span>O(n³) Gaussian</span>
        </div>
        <span
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold"
        >
          <CheckCircle2 class="w-3 h-3 text-emerald-400 shrink-0" />
          <span class="font-mono">ដោះស្រាយរួចរាល់</span>
        </span>
      </div>
    </div>

    <!-- 2. Solver Parameters & Algorithm Switcher -->
    <div
      class="flex items-center justify-between py-1.5 px-2 rounded bg-slate-900/80 border border-slate-800/80 text-[11px] shrink-0"
    >
      <div class="flex items-center gap-2 font-mono text-[10px] text-slate-300">
        <span class="text-slate-400">សមីការ:</span>
        <span class="font-bold text-white">AᵀAx = Aᵀb</span>
        <span class="text-slate-600">|</span>
        <span class="text-slate-400">Epsilon:</span>
        <span class="text-cyan-300">1.0e-10</span>
        <span class="text-slate-600 hidden sm:inline">|</span>
        <span class="text-slate-400 hidden sm:inline">Pivoting:</span>
        <span class="text-emerald-300 hidden sm:inline">Partial (Row Interchange)</span>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          class="inline-flex items-center gap-1 text-[10px] font-medium bg-cyan-600 hover:bg-cyan-500 text-white px-2 py-0.5 rounded transition-colors"
        >
          <Play class="w-2.5 h-2.5 fill-current" />
          <span>គណនាឡើងវិញ</span>
        </button>
        <button
          type="button"
          class="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
          title="កំណត់ឡើងវិញ"
        >
          <RefreshCw class="w-2.5 h-2.5" />
        </button>
      </div>
    </div>

    <!-- 3. Mathematical Matrix Workspace Split -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-2 my-1.5 flex-1 min-h-0">
      <!-- Left: Augmented Matrix Input [A | b] (7 cols) -->
      <div
        class="md:col-span-7 rounded border border-slate-800/80 bg-slate-900/60 p-2 sm:p-2.5 flex flex-col justify-between"
      >
        <div
          class="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider"
        >
          <span>ម៉ាទ្រីសធនធាន [A | b]</span>
          <span class="font-mono text-cyan-400 text-[10px]">Matrix 3×3 / Rank: 3</span>
        </div>

        <!-- Augmented Matrix Display -->
        <div class="my-auto font-mono text-[11px] sm:text-xs space-y-1.5 py-1">
          <!-- Row 1: ICU Beds -->
          <div
            class="flex items-center justify-between bg-slate-950 px-2 py-1 rounded border border-slate-800/80"
          >
            <span class="text-slate-500 text-[10px] w-14 truncate">ICU Beds</span>
            <div class="flex items-center gap-3 text-slate-200">
              <span class="w-7 text-right">2.0</span>
              <span class="w-7 text-right">1.0</span>
              <span class="w-7 text-right">1.0</span>
            </div>
            <span class="text-slate-600 px-1">|</span>
            <span class="font-bold text-cyan-400 w-10 text-right">24.0</span>
          </div>

          <!-- Row 2: Ventilator Units -->
          <div
            class="flex items-center justify-between bg-slate-950 px-2 py-1 rounded border border-slate-800/80"
          >
            <span class="text-slate-500 text-[10px] w-14 truncate">Ventilators</span>
            <div class="flex items-center gap-3 text-slate-200">
              <span class="w-7 text-right">1.0</span>
              <span class="w-7 text-right">3.0</span>
              <span class="w-7 text-right">2.0</span>
            </div>
            <span class="text-slate-600 px-1">|</span>
            <span class="font-bold text-cyan-400 w-10 text-right">38.0</span>
          </div>

          <!-- Row 3: Staff Hours -->
          <div
            class="flex items-center justify-between bg-slate-950 px-2 py-1 rounded border border-slate-800/80"
          >
            <span class="text-slate-500 text-[10px] w-14 truncate">Staff (h)</span>
            <div class="flex items-center gap-3 text-slate-200">
              <span class="w-7 text-right">1.0</span>
              <span class="w-7 text-right">1.0</span>
              <span class="w-7 text-right">2.0</span>
            </div>
            <span class="text-slate-600 px-1">|</span>
            <span class="font-bold text-cyan-400 w-10 text-right">26.0</span>
          </div>
        </div>

        <div
          class="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60 flex items-center justify-between"
        >
          <span>Row Operations: R₂ &larr; R₂ - 0.5R₁</span>
          <span>det(A) = 6.00</span>
        </div>
      </div>

      <!-- Right: Computed Optimal Solution Vector x* (5 cols) -->
      <div
        class="md:col-span-5 rounded border border-slate-800/80 bg-slate-900/60 p-2 sm:p-2.5 flex flex-col justify-between"
      >
        <div
          class="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider"
        >
          <span>លទ្ធផលវ៉ិចទ័រ x*</span>
          <span class="font-mono text-emerald-400 text-[10px]">Optimal</span>
        </div>

        <!-- Vector Values -->
        <div class="space-y-1.5 my-auto py-1 font-mono text-[11px]">
          <div
            class="flex items-center justify-between bg-slate-950 px-2 py-1 rounded border border-slate-800"
          >
            <span class="text-slate-400 text-[10px]">Ward Alpha (x₁)</span>
            <span class="font-bold text-white">6.0000</span>
          </div>
          <div
            class="flex items-center justify-between bg-slate-950 px-2 py-1 rounded border border-slate-800"
          >
            <span class="text-slate-400 text-[10px]">Ward Beta (x₂)</span>
            <span class="font-bold text-white">8.0000</span>
          </div>
          <div
            class="flex items-center justify-between bg-slate-950 px-2 py-1 rounded border border-slate-800"
          >
            <span class="text-slate-400 text-[10px]">Ward Gamma (x₃)</span>
            <span class="font-bold text-white">4.0000</span>
          </div>
        </div>

        <!-- Residual Error Check -->
        <div
          class="bg-slate-950 p-1.5 rounded border border-slate-800/80 text-[10px] font-mono flex items-center justify-between"
        >
          <span class="text-slate-400">កម្រិតលម្អៀង ||Ax - b||:</span>
          <span class="font-bold text-emerald-400">3.55e-15</span>
        </div>
      </div>
    </div>

    <!-- 4. Scientific Engine Footer -->
    <div
      class="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-400 shrink-0 font-mono"
    >
      <div class="flex items-center gap-2">
        <span>Numerical Engine: <strong class="text-slate-200">IEEE 754 Float64</strong></span>
        <span class="text-slate-600">|</span>
        <span>Convergence: <strong class="text-emerald-400">Exact Direct Solution</strong></span>
      </div>
      <div class="text-slate-500 hidden sm:block">Client-Side WebAssembly Solver</div>
    </div>
  </div>
</template>
