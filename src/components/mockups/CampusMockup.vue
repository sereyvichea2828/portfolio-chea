<script setup lang="ts">
import { GraduationCap, MapPin, CheckCircle2, Clock, AlertCircle, Search, FileSpreadsheet, UserCheck, Radio } from 'lucide-vue-next';
</script>

<template>
  <div
    class="w-full h-full bg-slate-950 text-slate-100 p-2.5 sm:p-3.5 select-none flex flex-col font-sans text-xs box-border overflow-hidden justify-between"
  >
    <!-- 1. Real Application Brand & Navigation Bar -->
    <div
      class="flex items-center justify-between pb-2 border-b border-slate-800/90 gap-2 shrink-0"
    >
      <!-- Brand & University Class Context -->
      <div class="flex items-center gap-2 min-w-0">
        <div
          class="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-2xs"
        >
          <GraduationCap class="w-4 h-4" />
        </div>
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="font-bold text-white text-xs sm:text-sm tracking-tight">ITE A3</span>
          <span class="text-slate-600 text-xs">/</span>
          <span class="text-slate-300 text-xs font-medium truncate">ប្រព័ន្ធគ្រប់គ្រងការសិក្សា</span>
        </div>
      </div>

      <!-- App Tabs & Live Status Indicator -->
      <div class="flex items-center gap-1.5 shrink-0">
        <!-- Live WebSocket Indicator -->
        <div
          class="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold"
        >
          <Radio class="w-3 h-3 text-emerald-400" />
          <span>WebSockets Live</span>
        </div>

        <!-- Verified GPS Geofence Badge -->
        <div
          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-medium"
        >
          <MapPin class="w-3 h-3 text-indigo-400 shrink-0" />
          <span>GPS Lab 302 (±50m)</span>
        </div>
      </div>
    </div>

    <!-- 2. Course Session Ribbon & Fast Actions -->
    <div
      class="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] shrink-0 gap-2"
    >
      <div class="flex items-center gap-2 min-w-0">
        <span class="font-bold text-white truncate">Web Architecture II</span>
        <span class="text-slate-600 hidden sm:inline">|</span>
        <span class="text-slate-400 hidden sm:inline">Lab 302 (07:30 - 10:45 AM)</span>
      </div>

      <!-- Search & Export Controls -->
      <div class="flex items-center gap-1.5 shrink-0">
        <div class="hidden sm:flex items-center gap-1 text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
          <Search class="w-3 h-3 text-slate-500" />
          <span>ស្វែងរកនិស្សិត...</span>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded border border-slate-700 transition-colors cursor-pointer"
        >
          <FileSpreadsheet class="w-3 h-3 text-emerald-400" />
          <span class="hidden sm:inline">Excel</span>
        </button>
      </div>
    </div>

    <!-- 3. Human KPI Attendance Summary Cards -->
    <div class="grid grid-cols-4 gap-1.5 shrink-0 my-0.5 text-[10px]">
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-md p-1.5 flex flex-col items-center justify-center">
        <span class="text-slate-400">វត្តមាន</span>
        <span class="font-bold text-emerald-400 font-mono text-xs">៤២ / ៤៤</span>
      </div>
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-md p-1.5 flex flex-col items-center justify-center">
        <span class="text-slate-400">មកយឺត</span>
        <span class="font-bold text-amber-400 font-mono text-xs">២ នាក់</span>
      </div>
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-md p-1.5 flex flex-col items-center justify-center">
        <span class="text-slate-400">អវត្តមាន</span>
        <span class="font-bold text-slate-400 font-mono text-xs">០ នាក់</span>
      </div>
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-md p-1.5 flex flex-col items-center justify-center">
        <span class="text-slate-400">អត្រាវត្តមាន</span>
        <span class="font-bold text-indigo-400 font-mono text-xs">95.5%</span>
      </div>
    </div>

    <!-- 4. Realistic Student Attendance Roster Table -->
    <div class="flex-1 my-1 overflow-hidden rounded-lg border border-slate-800/90 bg-slate-900/70 flex flex-col justify-between">
      <!-- Table Header -->
      <div class="grid grid-cols-12 gap-2 px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
        <div class="col-span-5 sm:col-span-4">និស្សិត & អត្តលេខ</div>
        <div class="col-span-3 sm:col-span-2 text-center">ម៉ោងស្កេន</div>
        <div class="hidden sm:block sm:col-span-3">ទីតាំងផ្ទៀងផ្ទាត់</div>
        <div class="col-span-4 sm:col-span-3 text-right">ស្ថានភាព</div>
      </div>

      <!-- Table Rows (Realistic Student Records) -->
      <div class="divide-y divide-slate-800/60 text-[11px] overflow-hidden flex-1 flex flex-col justify-around">
        <!-- Row 1: Student On Time -->
        <div class="grid grid-cols-12 gap-2 px-3 py-1 items-center hover:bg-slate-800/40 transition-colors">
          <div class="col-span-5 sm:col-span-4 flex items-center gap-2 min-w-0">
            <div class="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[9px] flex items-center justify-center shrink-0">
              សដ
            </div>
            <div class="min-w-0 truncate">
              <span class="font-medium text-slate-100 block truncate">ស៊ុន ដារ៉ា</span>
              <span class="font-mono text-slate-500 text-[9px] block">ITE-041</span>
            </div>
          </div>
          <div class="col-span-3 sm:col-span-2 text-center font-mono text-[10px] text-slate-300">
            07:28 AM
          </div>
          <div class="hidden sm:block sm:col-span-3 font-mono text-[10px] text-emerald-400 truncate">
            Lab 302 (ក្នុងកាំ 14m)
          </div>
          <div class="col-span-4 sm:col-span-3 text-right">
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 class="w-3 h-3" />
              <span>វត្តមាន</span>
            </span>
          </div>
        </div>

        <!-- Row 2: Student On Time -->
        <div class="grid grid-cols-12 gap-2 px-3 py-1 items-center hover:bg-slate-800/40 transition-colors">
          <div class="col-span-5 sm:col-span-4 flex items-center gap-2 min-w-0">
            <div class="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[9px] flex items-center justify-center shrink-0">
              ជស
            </div>
            <div class="min-w-0 truncate">
              <span class="font-medium text-slate-100 block truncate">ជា សុជាតិ</span>
              <span class="font-mono text-slate-500 text-[9px] block">ITE-018</span>
            </div>
          </div>
          <div class="col-span-3 sm:col-span-2 text-center font-mono text-[10px] text-slate-300">
            07:31 AM
          </div>
          <div class="hidden sm:block sm:col-span-3 font-mono text-[10px] text-emerald-400 truncate">
            Lab 302 (ក្នុងកាំ 22m)
          </div>
          <div class="col-span-4 sm:col-span-3 text-right">
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 class="w-3 h-3" />
              <span>វត្តមាន</span>
            </span>
          </div>
        </div>

        <!-- Row 3: Student Late -->
        <div class="grid grid-cols-12 gap-2 px-3 py-1 items-center hover:bg-slate-800/40 transition-colors">
          <div class="col-span-5 sm:col-span-4 flex items-center gap-2 min-w-0">
            <div class="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[9px] flex items-center justify-center shrink-0">
              វស
            </div>
            <div class="min-w-0 truncate">
              <span class="font-medium text-slate-100 block truncate">វ៉ាន់ សុខុម</span>
              <span class="font-mono text-slate-500 text-[9px] block">ITE-029</span>
            </div>
          </div>
          <div class="col-span-3 sm:col-span-2 text-center font-mono text-[10px] text-amber-400">
            07:48 AM
          </div>
          <div class="hidden sm:block sm:col-span-3 font-mono text-[10px] text-amber-300 truncate">
            ជណ្តើរយន្ត (ក្នុងកាំ 38m)
          </div>
          <div class="col-span-4 sm:col-span-3 text-right">
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              <Clock class="w-3 h-3" />
              <span>យឺត 18 នាទី</span>
            </span>
          </div>
        </div>

        <!-- Row 4: Student Outside Range / Warning -->
        <div class="grid grid-cols-12 gap-2 px-3 py-1 items-center hover:bg-slate-800/40 transition-colors">
          <div class="col-span-5 sm:col-span-4 flex items-center gap-2 min-w-0">
            <div class="w-5 h-5 rounded-md bg-rose-500/20 text-rose-300 font-bold text-[9px] flex items-center justify-center shrink-0">
              មវ
            </div>
            <div class="min-w-0 truncate">
              <span class="font-medium text-slate-300 block truncate">ម៉េង វិចិត្រ</span>
              <span class="font-mono text-slate-500 text-[9px] block">ITE-005</span>
            </div>
          </div>
          <div class="col-span-3 sm:col-span-2 text-center font-mono text-[10px] text-slate-500">
            —
          </div>
          <div class="hidden sm:block sm:col-span-3 font-mono text-[10px] text-rose-400 truncate">
            ក្រៅបរិវេណ (>50m • 120m)
          </div>
          <div class="col-span-4 sm:col-span-3 text-right">
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
              <AlertCircle class="w-3 h-3" />
              <span>អវត្តមាន</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Single Authentic System Status Footer (Zero Duplicates) -->
    <div
      class="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 shrink-0"
    >
      <div class="flex items-center gap-2 truncate">
        <UserCheck class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span class="truncate">សរុប ៤៤ នាក់ / ធ្វើបច្ចុប្បន្នភាពនៅ 08:12 AM</span>
      </div>
      <div class="font-mono text-[10px] text-slate-500 shrink-0 hidden sm:block">
        Node.js REST API / WebSockets Live
      </div>
    </div>
  </div>
</template>
