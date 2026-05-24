<script setup>
defineProps({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: [Number, String], required: true },
  originalPrice: { type: [Number, String], default: '' },
  badge: { type: String, default: '' }
})

defineEmits(['add'])
</script>

<template>
  <div class="col-span-2 row-span-2 relative rounded-2xl overflow-hidden bg-surface shadow-[0_4px_20px_rgba(242,140,40,0.05)] border border-surface-variant group cursor-pointer">
    <div v-if="badge" class="absolute top-3 left-3 z-10 bg-error text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{{ badge }}</div>
    <div class="block w-full h-[240px] md:h-[320px]">
      <img :alt="title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" :src="image" />
    </div>
    <div class="p-4 bg-surface relative z-20">
      <h4 class="text-base font-semibold text-on-surface mb-1">{{ title }}</h4>
      <p v-if="description" class="text-sm text-on-surface-variant line-clamp-1 mb-2">{{ description }}</p>
      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-1">
          <span class="text-error font-bold text-sm">¥</span>
          <span class="font-display text-3xl font-bold text-error">{{ price }}</span>
          <span v-if="originalPrice" class="text-outline text-xs line-through ml-1">¥{{ originalPrice }}</span>
        </div>
        <button
          class="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
          @click.stop="$emit('add')"
        >
          <span class="material-symbols-outlined" style="font-size: 18px;">add</span>
        </button>
      </div>
    </div>
  </div>
</template>
