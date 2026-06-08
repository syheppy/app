<script setup>
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' }
})
</script>

<template>
  <section class="mb-6">
    <div v-if="title || description" class="mb-3 px-1">
      <h2 v-if="title" class="text-primary font-bold text-xs tracking-wider uppercase">{{ title }}</h2>
      <p v-if="description" class="text-xs leading-relaxed theme-text-secondary mt-1">{{ description }}</p>
    </div>
    <div class="theme-card rounded-2xl border theme-border shadow-sm overflow-hidden">
      <slot />
    </div>
  </section>
</template>
