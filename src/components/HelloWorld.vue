<script setup>
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-8">
    <div class="text-center max-w-md">
      <!-- Logo -->
      <h1 class="font-display text-5xl font-bold text-primary mb-4">薯鲜生</h1>
      <p class="font-body text-lg text-on-surface-variant mb-8">
        新鲜薯类，从田间直达餐桌
      </p>

      <!-- Design System Preview -->
      <div class="space-y-4">
        <div class="flex gap-4 justify-center">
          <div class="w-16 h-16 rounded-lg bg-primary"></div>
          <div class="w-16 h-16 rounded-lg bg-primary-container"></div>
          <div class="w-16 h-16 rounded-lg bg-secondary"></div>
          <div class="w-16 h-16 rounded-lg bg-tertiary"></div>
        </div>

        <div class="flex gap-4 justify-center">
          <div class="w-16 h-16 rounded-lg bg-surface-container border border-outline-variant"></div>
          <div class="w-16 h-16 rounded-lg bg-surface-container-high border border-outline-variant"></div>
          <div class="w-16 h-16 rounded-lg bg-surface-container-highest border border-outline-variant"></div>
          <div class="w-16 h-16 rounded-lg bg-background border border-outline-variant"></div>
        </div>
      </div>

      <!-- Typography Preview -->
      <div class="mt-8 space-y-2">
        <p class="font-display text-display-lg text-on-surface">Display Large</p>
        <p class="font-headline text-headline-md text-on-surface">Headline Medium</p>
        <p class="font-body text-body-lg text-on-surface">Body Large</p>
        <p class="font-body text-body-md text-on-surface-variant">Body Medium</p>
        <p class="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">Label Small</p>
      </div>

      <!-- Button Preview -->
      <div class="mt-8 flex gap-4 justify-center">
        <button class="px-6 py-3 bg-primary text-on-primary rounded-lg font-label font-semibold hover:bg-primary/90 transition-colors">
          主要按钮
        </button>
        <button class="px-6 py-3 border border-primary text-primary rounded-lg font-label font-semibold hover:bg-primary/10 transition-colors">
          次要按钮
        </button>
      </div>

      <!-- Icon Preview -->
      <div class="mt-8 flex gap-4 justify-center">
        <span class="material-symbols-outlined text-primary" style="font-size: 32px;">shopping_cart</span>
        <span class="material-symbols-outlined text-primary" style="font-size: 32px;">favorite</span>
        <span class="material-symbols-outlined text-primary" style="font-size: 32px;">home</span>
        <span class="material-symbols-outlined text-primary" style="font-size: 32px;">person</span>
      </div>
    </div>
  </div>
</template>
