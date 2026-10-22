<script setup lang="ts">
// High-frequency financial risk & analytics terminal mockup (Dark Pearl Glass theme)
</script>

<template>
  <div
    class="w-full h-full bg-slate-950 text-slate-100 p-3.5 sm:p-4 font-mono text-xs select-none relative overflow-hidden flex flex-col justify-between"
  >
    <!-- Background Ambient Radial Glow -->
    <div
      class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple-600/20 blur-2xl pointer-events-none"
      aria-hidden="true"
    />
    <div
      class="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-cyan-600/15 blur-2xl pointer-events-none"
      aria-hidden="true"
    />

    <!-- Top Window Chrome & Status Header -->
    <div
      class="relative z-10 flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80 flex-nowrap min-w-0"
    >
      <div class="flex items-center gap-2 min-w-0 shrink">
        <div class="flex items-center gap-1.5 shrink-0">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-xs inline-block" />
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-xs inline-block" />
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/90 shadow-xs inline-block" />
        </div>
        <span class="font-bold text-slate-200 tracking-tight text-xs whitespace-nowrap"
          >APEX // RISK.SIM</span
        >
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <span
          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-xs whitespace-nowrap"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>2.5k ticks/s</span>
        </span>
      </div>
    </div>

    <!-- Center Chart Visualization (SVG) -->
    <div class="relative z-10 py-2 sm:py-3 my-auto">
      <div class="flex items-baseline justify-between mb-2">
        <div>
          <span class="text-slate-400 uppercase tracking-wider block text-xs">PORTFOLIO NAV</span>
          <p class="text-xl sm:text-2xl font-extrabold text-white font-sans tracking-tight">
            $24,892,140<span class="text-purple-400 text-base">.00</span>
          </p>
        </div>
        <div class="text-right">
          <span
            class="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"
          >
            ▲ +14.28%
          </span>
          <span class="text-xs text-slate-400 block mt-1">Sharpe: 2.84</span>
        </div>
      </div>

      <!-- Trend line chart with guide lines and volume bars -->
      <div class="relative">
        <svg
          class="w-full h-24 sm:h-28 overflow-visible"
          viewBox="0 0 400 110"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="apexSplineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#a855f7" stop-opacity="0.45" />
              <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0" />
            </linearGradient>
            <linearGradient id="apexSplineStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#c084fc" />
              <stop offset="60%" stop-color="#a855f7" />
              <stop offset="100%" stop-color="#38bdf8" />
            </linearGradient>
          </defs>

          <!-- Subtle Horizontal Grid Lines -->
          <line
            x1="0"
            y1="25"
            x2="400"
            y2="25"
            stroke="#334155"
            stroke-opacity="0.5"
            stroke-dasharray="4,4"
          />
          <line
            x1="0"
            y1="65"
            x2="400"
            y2="65"
            stroke="#334155"
            stroke-opacity="0.4"
            stroke-dasharray="4,4"
          />
          <line x1="0" y1="100" x2="400" y2="100" stroke="#334155" stroke-opacity="0.3" />

          <!-- Shaded Area Under Curve -->
          <path
            d="M0,85 C60,80 90,50 140,55 C190,60 220,30 270,35 C320,40 350,15 400,10 L400,105 L0,105 Z"
            fill="url(#apexSplineFill)"
          />

          <!-- Primary Glow Curve -->
          <path
            d="M0,85 C60,80 90,50 140,55 C190,60 220,30 270,35 C320,40 350,10 400,10"
            stroke="url(#apexSplineStroke)"
            stroke-width="2.5"
            stroke-linecap="round"
          />

          <!-- Peak Crosshair & Glowing Pulse Point -->
          <circle cx="400" cy="10" r="5" fill="#38bdf8" class="animate-ping opacity-75" />
          <circle cx="400" cy="10" r="4" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5" />
        </svg>

        <!-- Mini Volume Bars Underneath -->
        <div class="flex items-end justify-between gap-1 h-4 mt-1 px-1 opacity-70">
          <div class="w-full bg-purple-500/30 rounded-xs h-2" />
          <div class="w-full bg-purple-500/40 rounded-xs h-3" />
          <div class="w-full bg-purple-500/25 rounded-xs h-1.5" />
          <div class="w-full bg-purple-500/50 rounded-xs h-3.5" />
          <div class="w-full bg-cyan-500/40 rounded-xs h-2" />
          <div class="w-full bg-cyan-500/60 rounded-xs h-4" />
          <div class="w-full bg-cyan-500/45 rounded-xs h-2.5" />
          <div class="w-full bg-cyan-500/70 rounded-xs h-4" />
          <div class="w-full bg-emerald-500/80 rounded-xs h-4" />
        </div>
      </div>
    </div>

    <!-- Bottom Metric Chips -->
    <div class="relative z-10 grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
      <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
        <span class="text-slate-400 text-xs block truncate">Max Drawdown</span>
        <span class="text-rose-400 font-bold block mt-0.5">-3.12%</span>
      </div>
      <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
        <span class="text-slate-400 text-xs block truncate">Value at Risk</span>
        <span class="text-cyan-400 font-bold block mt-0.5">$142.5K</span>
      </div>
      <div class="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
        <span class="text-slate-400 text-xs block truncate">Engine State</span>
        <span class="text-emerald-400 font-bold block mt-0.5">60 FPS</span>
      </div>
    </div>
  </div>
</template>
