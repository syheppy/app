<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  city: { type: String, default: '北京市' }
})

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

  <!-- Mobile Header: location + capsule search bar -->
  <div class="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-outline-variant/20 px-3 py-1.5 md:hidden">
    <div class="flex items-center gap-2">
      <!-- Location -->
      <div class="flex items-center gap-0.5 text-primary-container text-[11px] font-medium whitespace-nowrap cursor-pointer shrink-0 active:opacity-70">
        <span class="material-symbols-outlined" style="font-size: 14px;">location_on</span>
        <span>{{ city }}</span>
      </div>
      <!-- Capsule Search Bar -->
      <div class="flex-1 flex items-center bg-surface-container rounded-full h-8 pl-3 pr-1 gap-1">
        <span class="material-symbols-outlined text-outline text-[16px] shrink-0">search</span>
        <input
          v-model="keyword"
          @keyup.enter="doSearch"
          class="flex-1 bg-transparent border-none outline-none font-body text-xs text-on-surface placeholder:text-outline min-w-0"
          placeholder="搜索新鲜红薯、紫薯..."
          type="text"
        />
        <button @click="doSearch" class="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 border-none cursor-pointer">
          <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
</template>
