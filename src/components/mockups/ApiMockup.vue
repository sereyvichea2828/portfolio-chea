<script setup lang="ts">
// Developer API Gateway & Telemetry Streaming Mockup (Dark Tech Glass theme)
</script>

<template>
  <div
    class="w-full h-full bg-slate-950 text-slate-100 p-3.5 sm:p-4 font-mono text-xs select-none relative overflow-hidden flex flex-col justify-between"
  >
    <!-- Background Ambient Radial Glow -->
    <div
      class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-600/20 blur-2xl pointer-events-none"
      aria-hidden="true"
    />
    <div
      class="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-teal-600/15 blur-2xl pointer-events-none"
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
        <span class="font-bold text-slate-200 tracking-tight text-xs whitespace-nowrap">NEXUS // GATEWAY</span>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <span
          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-xs whitespace-nowrap"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>99.99% UP</span>
        </span>
      </div>
    </div>

    <!-- Active Endpoint Logs Visual -->
    <div class="relative z-10 py-2 sm:py-3 space-y-2 my-auto">
      <div
        class="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md text-xs"
      >
        <div class="flex items-center gap-2 min-w-0">
          <span class="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 shrink-0"
            >GET 200</span
          >
          <span class="text-slate-200 truncate">/api/v1/telemetry/stream</span>
        </div>
        <div class="flex items-center gap-2 shrink-0 ml-2">
          <span class="text-slate-500 hidden sm:inline">gzip</span>
          <span class="text-emerald-400 font-semibold">1.2ms</span>
        </div>
      </div>

      <div
        class="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md text-xs"
      >
        <div class="flex items-center gap-2 min-w-0">
          <span class="px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 shrink-0"
            >POST 201</span
          >
          <span class="text-slate-200 truncate">/api/v1/auth/token/sign</span>
        </div>
        <div class="flex items-center gap-2 shrink-0 ml-2">
          <span class="text-slate-500 hidden sm:inline">jwt</span>
          <span class="text-blue-400 font-semibold">2.1ms</span>
        </div>
      </div>

      <div
        class="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md text-xs"
      >
        <div class="flex items-center gap-2 min-w-0">
          <span class="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30 shrink-0"
            >WS 101</span
          >
          <span class="text-slate-200 truncate">/v1/channels/broadcast</span>
        </div>
        <div class="flex items-center gap-2 shrink-0 ml-2">
          <span class="text-purple-400 font-semibold">ACTIVE</span>
        </div>
      </div>
    </div>

    <!-- Bottom Status Chips -->
    <div class="relative z-10 grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
      <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
        <span class="text-slate-400 text-xs block truncate">Median Latency</span>
        <span class="text-emerald-400 font-bold block mt-0.5">&lt; 1.8ms</span>
      </div>
      <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
        <span class="text-slate-400 text-xs block truncate">Active Sockets</span>
        <span class="text-cyan-400 font-bold block mt-0.5">10,482</span>
      </div>
      <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
        <span class="text-slate-400 text-xs block truncate">Memory Heap</span>
        <span class="text-white font-bold block mt-0.5">48 MB</span>
      </div>
    </div>
  </div>
</template>
