<script setup>
defineProps({
  updatedAt: { type: String, required: true },
  intro: { type: String, default: '' },
  sections: { type: Array, required: true }
})
</script>

<template>
  <article class="space-y-4">
    <div class="theme-card rounded-2xl border theme-border p-4">
      <p v-if="intro" class="text-sm leading-7 theme-text">{{ intro }}</p>
      <p class="text-[11px] theme-text-secondary mt-3">更新日期：{{ updatedAt }}</p>
    </div>

    <section
      v-for="section in sections"
      :key="section.title"
      class="theme-card rounded-2xl border theme-border p-4"
    >
      <h2 class="font-headline text-lg font-bold theme-text mb-2">{{ section.title }}</h2>
      <p class="text-sm leading-7 theme-text-secondary whitespace-pre-line">{{ section.body }}</p>
    </section>
  </article>
</template>
