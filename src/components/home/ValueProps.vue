<script setup>
const props = [
  { icon: 'agriculture', label: '产地直发', color: 'text-primary-container' },
  { icon: 'eco', label: '有机认证', color: 'text-secondary' },
  { icon: 'verified', label: '品质严选', color: 'text-tertiary' },
  { icon: 'local_shipping', label: '极速冷链', color: 'text-primary-container' }
]
</script>

<template>
  <section class="px-5 md:px-0 grid grid-cols-4 gap-4">
    <div v-for="item in props" :key="item.label" class="flex flex-col items-center gap-2">
      <div class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center" :class="item.color">
        <span class="material-symbols-outlined" :style="{ fontVariationSettings: `'FILL' 1` }">{{ item.icon }}</span>
      </div>
      <span class="text-xs text-on-surface-variant font-medium">{{ item.label }}</span>
    </div>
  </section>
</template>
