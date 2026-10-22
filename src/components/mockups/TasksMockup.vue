<script setup lang="ts">
// Interactive DAG Pipeline & Task Orchestrator Visual Mockup (Dark Tech Glass theme)
</script>

<template>
  <div
    class="w-full h-full bg-slate-950 text-slate-100 p-3.5 sm:p-4 font-mono text-xs select-none relative overflow-hidden flex flex-col justify-between"
  >
    <!-- Background Ambient Radial Glow -->
    <div
      class="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-indigo-600/20 blur-2xl pointer-events-none"
      aria-hidden="true"
    />
    <div
      class="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-cyan-600/15 blur-2xl pointer-events-none"
      aria-hidden="true"
    />

    <!-- Top Window Chrome & Status Header -->
    <div class="relative z-10 flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80 flex-nowrap min-w-0">
      <div class="flex items-center gap-2 min-w-0 shrink">
        <div class="flex items-center gap-1.5 shrink-0">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-xs inline-block" />
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-xs inline-block" />
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/90 shadow-xs inline-block" />
        </div>
        <span class="font-bold text-slate-200 tracking-tight text-xs whitespace-nowrap">FLOWSTATE // DAG.v2</span>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <span
          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-semibold text-xs whitespace-nowrap"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span>12 NODES</span>
        </span>
      </div>
    </div>

    <!-- Node Canvas Visual: 3 Spacious Pipeline Nodes with connection line -->
    <div class="relative z-10 py-2 sm:py-3 my-auto">
      <div class="relative grid grid-cols-3 gap-2.5 items-center">
        <!-- Connecting Line Behind Nodes -->
        <div class="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0">
          <div class="h-full bg-linear-to-r from-purple-500 via-indigo-500 to-cyan-500 w-3/4 animate-pulse" />
        </div>

        <!-- Node 1: Ingest -->
        <div
          class="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-purple-500/40 text-center relative z-10 shadow-lg shadow-purple-950/20 backdrop-blur-md"
        >
          <span class="text-xs text-purple-400 font-bold block truncate">01_INGEST</span>
          <span class="text-slate-400 text-xs block truncate mt-0.5">Kafka Stream</span>
          <div class="flex items-center justify-center gap-1 mt-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span class="text-xs text-emerald-400 font-semibold">Ready</span>
          </div>
        </div>

        <!-- Node 2: Transform -->
        <div
          class="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/40 text-center relative z-10 shadow-lg shadow-indigo-950/20 backdrop-blur-md"
        >
          <span class="text-xs text-indigo-400 font-bold block truncate">02_PROCESS</span>
          <span class="text-slate-400 text-xs block truncate mt-0.5">Wasm JIT</span>
          <div class="flex items-center justify-center gap-1 mt-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span class="text-xs text-indigo-400 font-semibold">Active</span>
          </div>
        </div>

        <!-- Node 3: Deploy -->
        <div
          class="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-center relative z-10 shadow-lg shadow-cyan-950/20 backdrop-blur-md"
        >
          <span class="text-xs text-cyan-400 font-bold block truncate">03_DEPLOY</span>
          <span class="text-slate-400 text-xs block truncate mt-0.5">Cluster Sync</span>
          <div class="flex items-center justify-center gap-1 mt-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span class="text-xs text-emerald-400 font-semibold">Synced</span>
          </div>
        </div>
      </div>

      <!-- Connecting pipeline progress bar -->
      <div class="mt-3 sm:mt-4 px-1">
        <div class="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>Pipeline Throughput</span>
          <span class="text-indigo-400 font-bold">88.4% completed</span>
        </div>
        <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-linear-to-r from-purple-500 via-indigo-500 to-cyan-400 w-11/12 rounded-full" />
        </div>
      </div>
    </div>

    <!-- Bottom Status Chips -->
    <div class="relative z-10 grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
      <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
        <span class="text-slate-400 text-xs block truncate">Queue</span>
        <span class="text-white font-bold block mt-0.5">0 pending</span>
      </div>
      <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
        <span class="text-slate-400 text-xs block truncate">Latency</span>
        <span class="text-indigo-400 font-bold block mt-0.5">18ms</span>
      </div>
      <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
        <span class="text-slate-400 text-xs block truncate">Health</span>
        <span class="text-emerald-400 font-bold block mt-0.5">100% OK</span>
      </div>
    </div>
  </div>
</template>
