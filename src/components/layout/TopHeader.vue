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
  <div class="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-md px-5 py-3 md:hidden flex items-center gap-4">
    <a class="flex items-center gap-1 text-primary-container text-xs font-medium whitespace-nowrap active:opacity-70 transition-opacity">
      <span class="material-symbols-outlined" style="font-size: 18px;">location_on</span>
      <span>{{ city }}</span>
    </a>
    <div class="flex-1 relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="material-symbols-outlined text-outline" style="font-size: 20px;">search</span>
      </div>
      <input
        class="w-full bg-surface-container rounded-lg py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline border-none focus:ring-2 focus:ring-primary-container transition-all"
        placeholder="搜索新鲜红薯、紫薯..."
        type="text"
      />
    </div>
  </div>
</template>
