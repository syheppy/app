<script setup>
defineProps({
  icon: { type: String, default: '' },
  label: { type: String, required: true },
  description: { type: String, default: '' },
  value: { type: String, default: '' },
  clickable: { type: Boolean, default: false },
  danger: { type: Boolean, default: false },
  showChevron: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 bg-transparent border-none text-left transition-colors"
    :class="clickable ? 'cursor-pointer active:bg-black/5' : 'cursor-default'"
    :disabled="!clickable"
    @click="clickable && emit('click')"
  >
    <span
      v-if="icon"
      class="material-symbols-outlined shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[20px]"
      :class="danger ? 'text-error bg-error-container' : 'text-primary bg-primary/10'"
      style="font-variation-settings: 'FILL' 1;"
    >
      {{ icon }}
    </span>
    <span class="min-w-0 flex-1">
      <span class="block text-sm font-semibold" :class="danger ? 'text-error' : 'theme-text'">{{ label }}</span>
      <span v-if="description" class="block text-xs leading-relaxed theme-text-secondary mt-0.5">{{ description }}</span>
    </span>
    <span v-if="value" class="text-xs font-medium theme-text-secondary shrink-0">{{ value }}</span>
    <span v-if="showChevron" class="material-symbols-outlined text-[18px] theme-text-secondary shrink-0">chevron_right</span>
  </button>
</template>
