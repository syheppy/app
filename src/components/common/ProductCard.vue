<script setup>
defineProps({
  image: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: [Number, String], required: true },
  originalPrice: { type: [Number, String], default: '' },
  tag: { type: String, default: '' },
  tagColor: { type: String, default: 'bg-secondary-container text-on-secondary-container' }
})

defineEmits(['add'])
</script>

<template>
  <div class="rounded-2xl overflow-hidden bg-surface shadow-[0_4px_20px_rgba(242,140,40,0.05)] border border-surface-variant flex flex-col group cursor-pointer">
    <img :alt="title" class="w-full h-[120px] md:h-[160px] object-cover transition-transform duration-500 group-hover:scale-105" :src="image" />
    <div class="p-3 flex flex-col flex-1 justify-between">
      <div>
        <h4 class="text-sm font-medium text-on-surface line-clamp-1 mb-1">{{ title }}</h4>
        <div v-if="tag" class="flex gap-1 mb-2">
          <span class="text-[10px] px-1.5 rounded" :class="tagColor">{{ tag }}</span>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="text-lg font-semibold text-error">¥{{ price }}</div>
        <button
          class="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center active:scale-95 transition-transform hover:bg-primary-container hover:text-white"
          @click.stop="$emit('add')"
        >
          <span class="material-symbols-outlined" style="font-size: 14px;">add</span>
        </button>
      </div>
    </div>
  </div>
</template>
