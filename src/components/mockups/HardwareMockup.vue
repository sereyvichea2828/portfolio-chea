<script setup lang="ts">
import { ref } from 'vue';
import {
  Cpu,
  Lock,
  Unlock,
  Fingerprint,
  Radio,
  KeyRound,
  Bluetooth,
  Activity,
  ShieldCheck,
} from 'lucide-vue-next';

const isLocked = ref<boolean>(true);

const toggleLock = (): void => {
  isLocked.value = !isLocked.value;
};
</script>

<template>
  <div
    class="w-full h-full bg-slate-950 text-slate-100 p-2.5 sm:p-3.5 select-none flex flex-col font-sans text-xs box-border overflow-hidden justify-between"
  >
    <!-- 1. Hardware System Header -->
    <div class="flex items-center justify-between pb-2 border-b border-slate-800/80 gap-2 shrink-0">
      <div class="flex items-center gap-2 min-w-0">
        <div
          class="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 font-mono font-bold"
        >
          <Cpu class="w-3.5 h-3.5" />
        </div>
        <div class="flex items-center gap-2 min-w-0">
          <span class="font-bold text-white text-xs tracking-tight">Digital Door Lock</span>
          <span class="text-slate-500 text-xs hidden sm:inline">/</span>
          <span class="text-slate-400 text-xs truncate hidden sm:inline">Dual-MCU Telemetry</span>
        </div>
      </div>

      <!-- Live Microcontroller Sync Indicator -->
      <div class="flex items-center gap-2 shrink-0">
        <div
          class="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
          <span>Uno + Nano I2C Synced</span>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer"
          :class="
            isLocked
              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20'
              : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
          "
          @click="toggleLock"
        >
          <component :is="isLocked ? Lock : Unlock" class="w-3 h-3 shrink-0" />
          <span class="font-mono">{{ isLocked ? 'LOCKED' : 'UNLOCKED' }}</span>
        </button>
      </div>
    </div>

    <!-- 2. Dual-MCU Architecture Telemetry Ribbon -->
    <div
      class="flex items-center justify-between py-1.5 px-2 rounded bg-slate-900/80 border border-slate-800/80 text-[11px] shrink-0"
    >
      <div class="flex items-center gap-2 font-mono text-[10px] text-slate-300">
        <span class="text-slate-400">Master:</span>
        <span class="font-bold text-white">Arduino Uno</span>
        <span class="text-slate-600">|</span>
        <span class="text-slate-400">Slave:</span>
        <span class="text-cyan-300">Arduino Nano</span>
        <span class="text-slate-600 hidden sm:inline">|</span>
        <span class="text-slate-400 hidden sm:inline">Protocol:</span>
        <span class="text-emerald-300 hidden sm:inline">UART &amp; I2C Bus</span>
      </div>

      <div class="flex items-center gap-1 shrink-0 text-[10px]">
        <span class="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
        <span class="font-mono text-emerald-400">Online</span>
      </div>
    </div>

    <!-- 3. Apple HomeKit-Style Dual Door Nodes Grid -->
    <div class="grid grid-cols-2 gap-2 my-1 shrink-0">
      <!-- Outdoor Master Node -->
      <div
        class="p-2 sm:p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Outdoor Node</span>
          <span
            class="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium"
            :class="
              isLocked
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            "
          >
            {{ isLocked ? 'Secured' : 'Open' }}
          </span>
        </div>
        <div class="mt-2 flex items-center justify-between">
          <div>
            <div class="font-bold text-white text-xs">Master Uno</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Keypad &amp; Biometrics</div>
          </div>
          <div
            class="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            :class="isLocked ? 'bg-blue-500/15 text-blue-400' : 'bg-emerald-500/15 text-emerald-400'"
          >
            <component :is="isLocked ? Lock : Unlock" class="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <!-- Indoor Slave Node -->
      <div
        class="p-2 sm:p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Indoor Node</span>
          <span
            class="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700"
          >
            Channel 2
          </span>
        </div>
        <div class="mt-2 flex items-center justify-between">
          <div>
            <div class="font-bold text-white text-xs">Slave Nano</div>
            <div class="text-[10px] text-slate-400 mt-0.5">RFID &amp; Push Button</div>
          </div>
          <div class="w-7 h-7 rounded-md bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
            <Radio class="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Four Authentication Modules Row -->
    <div class="grid grid-cols-4 gap-1.5 shrink-0">
      <div
        class="p-1.5 rounded bg-slate-900/90 border border-slate-800/80 flex flex-col items-center text-center"
      >
        <Fingerprint class="w-3.5 h-3.5 text-purple-400 mb-1" />
        <span class="text-[10px] font-bold text-slate-200">AS608</span>
        <span class="text-[9px] text-slate-500">Biometrics</span>
      </div>
      <div
        class="p-1.5 rounded bg-slate-900/90 border border-slate-800/80 flex flex-col items-center text-center"
      >
        <Radio class="w-3.5 h-3.5 text-cyan-400 mb-1" />
        <span class="text-[10px] font-bold text-slate-200">RC522</span>
        <span class="text-[9px] text-slate-500">RFID 13.56M</span>
      </div>
      <div
        class="p-1.5 rounded bg-slate-900/90 border border-slate-800/80 flex flex-col items-center text-center"
      >
        <KeyRound class="w-3.5 h-3.5 text-amber-400 mb-1" />
        <span class="text-[10px] font-bold text-slate-200">4x4 Matrix</span>
        <span class="text-[9px] text-slate-500">PIN Keypad</span>
      </div>
      <div
        class="p-1.5 rounded bg-slate-900/90 border border-slate-800/80 flex flex-col items-center text-center"
      >
        <Bluetooth class="w-3.5 h-3.5 text-blue-400 mb-1" />
        <span class="text-[10px] font-bold text-slate-200">Web BLE</span>
        <span class="text-[9px] text-slate-500">Telemetry</span>
      </div>
    </div>

    <!-- 5. Technical Footnote & Hardware Status -->
    <div
      class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono shrink-0"
    >
      <div class="flex items-center gap-1.5">
        <Activity class="w-3 h-3 text-emerald-400" />
        <span>Solenoid 12V Driver Active</span>
        <span class="text-slate-600 hidden sm:inline">·</span>
        <span class="text-slate-500 hidden sm:inline">Latency: &lt; 50ms</span>
      </div>
      <div class="flex items-center gap-1 text-slate-400">
        <ShieldCheck class="w-3 h-3 text-emerald-400" />
        <span>Fail-Safe Secured</span>
      </div>
    </div>
  </div>
</template>

