<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocation } from '../../composables/useLocation'

const router = useRouter()
const { city, locate } = useLocation()

onMounted(locate)

const keyword = ref('')
const doSearch = () => {
  const q = keyword.value.trim()
  if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
}
</script>

<template>
  <!-- Desktop Header -->
  <header class="fixed top-0 left-0 w-full z-50 items-center justify-between px-4 h-16 bg-[#FDFCFB]/90 backdrop-blur-md border-b border-stone-100 shadow-sm shadow-primary/5 hidden md:flex">
    <button class="p-2 hover:opacity-80 transition-opacity active:scale-95">
      <span class="material-symbols-outlined text-primary">location_on</span>
    </button>
    <h1 class="font-headline text-xl font-bold tracking-tight text-primary">薯鲜生</h1>
    <button class="p-2 hover:opacity-80 transition-opacity active:scale-95">
      <span class="material-symbols-outlined text-primary">notifications</span>
    </button>
  </header>

  <!-- Mobile Header: Gradient + Shadow Style -->
  <div class="fixed top-0 left-0 w-full z-50 px-4 pt-3 pb-4 md:hidden" style="background: linear-gradient(to bottom, var(--theme-bg), color-mix(in srgb, var(--theme-bg) 80%, transparent));">
    <!-- Top Row: Location + Notification -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-1.5 text-primary text-[12px] font-semibold cursor-pointer active:opacity-70 transition-opacity">
        <span class="material-symbols-outlined" style="font-size: 16px;">location_on</span>
        <span>{{ city }}</span>
        <span class="material-symbols-outlined text-[12px] text-on-surface-variant">expand_more</span>
      </div>
      <button class="relative p-2 rounded-full hover:bg-surface-container/50 transition-colors">
        <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 22px;">notifications</span>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
      </button>
    </div>

    <!-- Search Bar with Shadow -->
    <div class="flex items-center bg-surface rounded-full h-11 pl-4 pr-1.5 gap-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <span class="material-symbols-outlined text-outline text-[18px] shrink-0">search</span>
      <input
        v-model="keyword"
        @keyup.enter="doSearch"
        class="flex-1 bg-transparent border-none outline-none font-body text-[13px] text-on-surface placeholder:text-outline/60 min-w-0"
        placeholder="搜索红薯、紫薯..."
        type="text"
      />
      <button @click="doSearch" class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 border-none cursor-pointer active:scale-90 transition-transform shadow-sm shadow-primary/20">
        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
      </button>
    </div>
  </div>
</template>
