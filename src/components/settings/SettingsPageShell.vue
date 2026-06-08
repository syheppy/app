<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})

const router = useRouter()
</script>

<template>
  <div class="min-h-screen font-body" style="background-color: var(--color-background); color: var(--color-on-background);">
    <div class="sticky top-0 z-40 backdrop-blur-md border-b theme-border" style="background: color-mix(in srgb, var(--theme-bg) 90%, transparent);">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer active:scale-95 transition-transform" aria-label="返回" @click="router.back()">
          <span class="material-symbols-outlined theme-text text-[22px]" aria-hidden="true">arrow_back</span>
        </button>
        <h1 class="font-headline text-lg font-bold theme-text">{{ title }}</h1>
        <div class="min-w-10 flex justify-end">
          <slot name="action">
            <div class="w-10"></div>
          </slot>
        </div>
      </div>
    </div>

    <main class="max-w-lg mx-auto px-4 py-5 pb-12">
      <p v-if="subtitle" class="text-xs leading-relaxed theme-text-secondary mb-4 px-1">{{ subtitle }}</p>
      <slot />
    </main>
  </div>
</template>
