<script setup>
defineProps({
  modelValue: { type: Boolean, required: true },
  icon: { type: String, default: '' },
  label: { type: String, required: true },
  description: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="min-h-[64px] flex items-center gap-3 px-4 py-3">
    <span
      v-if="icon"
      class="material-symbols-outlined shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-primary bg-primary/10 text-[20px]"
      style="font-variation-settings: 'FILL' 1;"
    >
      {{ icon }}
    </span>
    <div class="min-w-0 flex-1">
      <span class="block text-sm font-semibold theme-text">{{ label }}</span>
      <span v-if="description" class="block text-xs leading-relaxed theme-text-secondary mt-0.5">{{ description }}</span>
    </div>
    <button
      type="button"
      class="relative w-12 h-7 rounded-full border-none cursor-pointer transition-colors shrink-0"
      :class="modelValue ? 'bg-primary' : 'bg-outline-variant'"
      :aria-pressed="modelValue"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span
        class="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
        :class="modelValue ? 'translate-x-[22px] left-0' : 'translate-x-1 left-0'"
      ></span>
    </button>
  </div>
</template>
