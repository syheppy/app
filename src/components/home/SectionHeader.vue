<script setup>
defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: '' },
  iconColor: { type: String, default: 'text-primary-container' },
  showMore: { type: Boolean, default: true }
})

defineEmits(['more'])
</script>

<template>
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold text-on-background flex items-center gap-2">
      <span v-if="icon" class="material-symbols-outlined" :class="iconColor" :style="{ fontVariationSettings: `'FILL' 1` }">{{ icon }}</span>
      {{ title }}
    </h3>
    <button v-if="showMore" class="text-xs text-primary-container flex items-center" @click="$emit('more')">
      查看全部 <span class="material-symbols-outlined" style="font-size: 16px;">chevron_right</span>
    </button>
  </div>
</template>
