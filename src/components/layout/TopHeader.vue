<script setup>
defineProps({
  city: { type: String, default: '北京市' }
})
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

  <!-- Mobile Header -->
  <div class="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-md px-5 py-3 md:hidden flex items-center justify-between">
    <a class="flex items-center gap-1 text-primary-container text-xs font-medium whitespace-nowrap active:opacity-70 transition-opacity">
      <span class="material-symbols-outlined" style="font-size: 18px;">location_on</span>
      <span>{{ city }}</span>
    </a>
    <h2 class="font-headline text-sm font-bold text-on-surface">薯鲜生</h2>
    <div class="w-12"></div>
  </div>
</template>
